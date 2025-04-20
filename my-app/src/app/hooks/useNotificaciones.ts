// hooks/useNotificaciones.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { notificacionesApi } from '@/app/services/apiServices';
import { 
  Notificacion, 
  NotificacionFiltro, 
  NotificacionResponse, 
  ComandoWebSocket,
  ConteoNoLeidas
} from '@/app/types/notification';

interface UseNotificacionesProps {
  autoConnect?: boolean;
}

export function useNotificaciones({ autoConnect = true }: UseNotificacionesProps = {}) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [notificacionesNoLeidas, setNotificacionesNoLeidas] = useState<number>(0);
  const [notificacionActual, setNotificacionActual] = useState<Notificacion | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Usar useRef para manejar los reintentos de conexión
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const connectWebSocket = useCallback(() => {
    if (!user?.id) return;
    
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${wsProtocol}//${window.location.host}/api/ws?userId=${user.id}`;
      
      console.log(`Conectando a WebSocket: ${wsUrl}`);
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        console.log('Conexión WebSocket establecida');
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0; // Reiniciar contador de intentos
      };
      
      ws.onclose = (event) => {
        console.log('Conexión WebSocket cerrada:', event.reason);
        setIsConnected(false);
        
        // Intentar reconectar con backoff exponencial
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`Reintentando conexión en ${delay}ms (intento ${reconnectAttempts.current + 1})`);
          
          setTimeout(() => {
            if (user?.id) {
              reconnectAttempts.current += 1;
              connectWebSocket();
            }
          }, delay);
        } else {
          setError('No se pudo establecer conexión con el servidor de notificaciones');
        }
      };
      
      ws.onerror = (event) => {
        console.error('Error en la conexión WebSocket:', event);
        setError('Error en la conexión con el servidor de notificaciones');
      };
      
      ws.onmessage = (event) => {
        try {
          const mensaje = JSON.parse(event.data);
          handleWebSocketMessage(mensaje);
        } catch (err) {
          console.error('Error al procesar mensaje:', err);
        }
      };
      
      setSocket(ws);
      
      // Limpieza al desmontar
      return () => {
        ws.close();
      };
    } catch (error) {
      console.error('Error al crear conexión WebSocket:', error);
      setError('No se pudo conectar al servidor de notificaciones');
    }
  }, [user?.id]);
  
  const handleWebSocketMessage = (mensaje: any) => {
    const { evento, data } = mensaje;
    
    switch (evento) {
      case 'CONEXION_EXITOSA':
        console.log('Conexión confirmada:', mensaje.mensaje);
        cargarNotificaciones();
        contarNoLeidas();
        break;
        
      case 'NUEVA_NOTIFICACION':
        const nuevaNotificacion = data as Notificacion;
        setNotificaciones(prev => [nuevaNotificacion, ...prev.filter(n => n.id !== nuevaNotificacion.id)]);
        if (!nuevaNotificacion.leido) {
          setNotificacionesNoLeidas(prev => prev + 1);
        }
        break;
        
      case 'NOTIFICACION_LEIDA':
        const notificacionLeida = data as Notificacion;
        setNotificaciones(prev => 
          prev.map(n => n.id === notificacionLeida.id ? notificacionLeida : n)
        );
        setNotificacionesNoLeidas(prev => Math.max(0, prev - 1));
        break;
        
      case 'NOTIFICACION_ELIMINADA':
        setNotificaciones(prev => prev.filter(n => n.id !== data.id));
        // Actualizar el conteo si la notificación eliminada no estaba leída
        const notificacionEliminada = notificaciones.find(n => n.id === data.id);
        if (notificacionEliminada && !notificacionEliminada.leido) {
          setNotificacionesNoLeidas(prev => Math.max(0, prev - 1));
        }
        break;
        
      case 'CARGAR_NOTIFICACIONES':
        const respuesta = data as NotificacionResponse;
        setNotificaciones(respuesta.notificaciones);
        setCargando(false);
        break;
        
      case 'CONTAR_NO_LEIDAS':
        const conteo = data as ConteoNoLeidas;
        setNotificacionesNoLeidas(conteo.count);
        break;
        
      case 'ABRIR_DETALLE':
        setNotificacionActual(data as Notificacion);
        setIsModalOpen(true);
        break;
        
      case 'ERROR':
        console.error('Error del servidor:', mensaje.mensaje);
        setError(mensaje.mensaje);
        setCargando(false);
        break;
    }
  };
  
  const enviarComando = useCallback((comando: ComandoWebSocket) => {
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn('No hay conexión con el servidor de notificaciones');
      // Reintentamos conectar si no hay conexión
      if (!isConnected && user?.id) {
        connectWebSocket();
      }
      return false;
    }
    
    try {
      socket.send(JSON.stringify(comando));
      return true;
    } catch (error) {
      console.error('Error al enviar comando:', error);
      return false;
    }
  }, [socket, isConnected, user?.id, connectWebSocket]);
  
  // MÉTODOS QUE COMBINAN API REST Y WEBSOCKET
  
  const cargarNotificaciones = useCallback(async (filtros: Partial<NotificacionFiltro> = {}) => {
    if (!user?.id) return;
    
    setCargando(true);
    
    try {
      // Primero intentamos con API REST
      const respuesta = await notificacionesApi.getPanelNotificaciones(user.id, filtros);
      setNotificaciones(respuesta.notificaciones);
      setCargando(false);
      
      // También notificamos por websocket para que otros clientes reciban la actualización
      enviarComando({
        accion: 'CARGAR_NOTIFICACIONES',
        usuarioId: user.id,
        params: filtros
      });
    } catch (error) {
      console.error('Error al cargar notificaciones vía API:', error);
      
      // Si falla la API, intentamos con WebSocket
      if (isConnected) {
        enviarComando({
          accion: 'CARGAR_NOTIFICACIONES',
          usuarioId: user.id,
          params: filtros
        });
      } else {
        setCargando(false);
        setError('No se pudieron cargar las notificaciones');
      }
    }
  }, [user?.id, enviarComando, isConnected]);
  
  const marcarComoLeida = useCallback(async (notificacionId: string) => {
    if (!user?.id) return;
    
    try {
      // Primero intentamos con API REST
      const notificacionActualizada = await notificacionesApi.marcarComoLeida(notificacionId, user.id);
      
      // Actualizamos estado local
      setNotificaciones(prev => 
        prev.map(n => n.id === notificacionId ? notificacionActualizada : n)
      );
      
      // Reducimos contador de no leídas si era una no leída
      const notificacion = notificaciones.find(n => n.id === notificacionId);
      if (notificacion && !notificacion.leido) {
        setNotificacionesNoLeidas(prev => Math.max(0, prev - 1));
      }
      
      // También notificamos por websocket para otros clientes
      enviarComando({
        accion: 'MARCAR_LEIDA',
        notificacionId,
        usuarioId: user.id
      });
      
      return notificacionActualizada;
    } catch (error) {
      console.error('Error al marcar como leída vía API:', error);
      
      // Si falla API intentamos con websocket
      if (isConnected) {
        enviarComando({
          accion: 'MARCAR_LEIDA',
          notificacionId,
          usuarioId: user.id
        });
      } else {
        setError('No se pudo marcar la notificación como leída');
      }
      return null;
    }
  }, [user?.id, notificaciones, enviarComando, isConnected]);
  
  const verDetalle = useCallback(async (notificacionId: string) => {
    if (!user?.id) return;
    
    try {
      // Obtener detalle vía API
      const detalle = await notificacionesApi.getDetalleNotificacion(notificacionId, user.id);
      setNotificacionActual(detalle);
      setIsModalOpen(true);
      
      // Notificar por websocket para posible sincronización
      enviarComando({
        accion: 'ABRIR_DETALLE',
        notificacionId,
        usuarioId: user.id
      });
      
      return detalle;
    } catch (error) {
      console.error('Error al obtener detalle vía API:', error);
      
      // Si falla API intentamos con websocket
      if (isConnected) {
        enviarComando({
          accion: 'ABRIR_DETALLE',
          notificacionId,
          usuarioId: user.id
        });
      } else {
        setError('No se pudo obtener el detalle de la notificación');
      }
      return null;
    }
  }, [user?.id, enviarComando, isConnected]);
  
  const cerrarDetalle = useCallback(async () => {
    setIsModalOpen(false);
    
    // Al cerrar el detalle, marcamos la notificación como leída si existe
    if (notificacionActual && !notificacionActual.leido) {
      await marcarComoLeida(notificacionActual.id);
    }
    
    // Limpiamos después de un pequeño delay para permitir la animación de cierre
    setTimeout(() => {
      setNotificacionActual(null);
    }, 300);
  }, [notificacionActual, marcarComoLeida]);
  
  const eliminarNotificacion = useCallback(async (notificacionId: string) => {
    if (!user?.id) return;
    
    try {
      // Primero intentamos con API REST
      await notificacionesApi.eliminarNotificacion(notificacionId, user.id);
      
      // Actualizamos estado local
      const notificacion = notificaciones.find(n => n.id === notificacionId);
      setNotificaciones(prev => prev.filter(n => n.id !== notificacionId));
      
      // Actualizamos contador si era no leída
      if (notificacion && !notificacion.leido) {
        setNotificacionesNoLeidas(prev => Math.max(0, prev - 1));
      }
      
      // También notificamos por websocket
      enviarComando({
        accion: 'ELIMINAR_NOTIFICACION',
        notificacionId,
        usuarioId: user.id
      });
      
      return true;
    } catch (error) {
      console.error('Error al eliminar notificación vía API:', error);
      
      // Si falla API intentamos con websocket
      if (isConnected) {
        enviarComando({
          accion: 'ELIMINAR_NOTIFICACION',
          notificacionId,
          usuarioId: user.id
        });
      } else {
        setError('No se pudo eliminar la notificación');
      }
      return false;
    }
  }, [user?.id, notificaciones, enviarComando, isConnected]);
  
  const contarNoLeidas = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      // Primero intentamos con API REST
      const conteo = await notificacionesApi.getConteoNoLeidas(user.id);
      setNotificacionesNoLeidas(conteo.count);
      
      // También notificamos vía websocket para posible sincronización
      enviarComando({
        accion: 'CONTAR_NO_LEIDAS',
        usuarioId: user.id
      });
      
      return conteo;
    } catch (error) {
      console.error('Error al contar no leídas vía API:', error);
      
      // Si falla la API, intentamos vía websocket
      if (isConnected) {
        enviarComando({
          accion: 'CONTAR_NO_LEIDAS',
          usuarioId: user.id
        });
      } else {
        setError('No se pudo obtener el conteo de notificaciones');
      }
      return null;
    }
  }, [user?.id, enviarComando, isConnected]);
  
  const cargarNotificacionesDropdown = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const datos = await notificacionesApi.getDropdownNotificaciones(user.id);
      return datos;
    } catch (error) {
      console.error('Error al cargar notificaciones dropdown:', error);
      return null;
    }
  }, [user?.id]);
  
  // Conectar automáticamente al montar el componente
  useEffect(() => {
    if (autoConnect && user?.id && !isConnected) {
      connectWebSocket();
    }
    
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [autoConnect, user?.id, isConnected, connectWebSocket, socket]);
  
  // Mantener el socket vivo con pings periódicos
  useEffect(() => {
    if (!isConnected) return;
    
    const pingInterval = setInterval(() => {
      if (socket && socket.readyState === WebSocket.OPEN && user?.id) {
        enviarComando({
          accion: 'PING',
          usuarioId: user.id
        });
      }
    }, 30000); // Cada 30 segundos
    
    return () => clearInterval(pingInterval);
  }, [isConnected, socket, user?.id, enviarComando]);
  
  // Cargar conteo inicial de notificaciones no leídas
  useEffect(() => {
    if (user?.id) {
      contarNoLeidas();
    }
  }, [user?.id, contarNoLeidas]);
  
  return {
    socket,
    isConnected,
    notificaciones,
    notificacionesNoLeidas,
    notificacionActual,
    isModalOpen,
    cargando,
    error,
    connectWebSocket,
    cargarNotificaciones,
    marcarComoLeida,
    verDetalle,
    cerrarDetalle,
    eliminarNotificacion,
    contarNoLeidas,
    cargarNotificacionesDropdown
  };
}