// hooks/useNotificaciones.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
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
  
  // Usar useRef para manejar los reintentos de conexión
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  
  const connectWebSocket = useCallback(() => {
    if (!user?.id) return;
    
    try {
      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      // Para desarrollo local, puedes necesitar apuntar directamente al puerto del backend
      // const wsUrl = `${wsProtocol}//localhost:3001/ws?userId=${user.id}`;
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
    const { evento, data, usuarioId } = mensaje;
    
    switch (evento) {
      case 'CONEXION_EXITOSA':
        console.log('Conexión confirmada:', mensaje.mensaje);
        cargarNotificaciones();
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
  
  const cargarNotificaciones = useCallback((filtros: Partial<NotificacionFiltro> = {}) => {
    if (!user?.id) return;
    
    setCargando(true);
    enviarComando({
      accion: 'CARGAR_NOTIFICACIONES',
      usuarioId: user.id,
      params: filtros
    });
  }, [user?.id, enviarComando]);
  
  const marcarComoLeida = useCallback((notificacionId: string) => {
    if (!user?.id) return;
    
    enviarComando({
      accion: 'MARCAR_LEIDA',
      notificacionId,
      usuarioId: user.id
    });
  }, [user?.id, enviarComando]);
  
  const verDetalle = useCallback((notificacionId: string) => {
    if (!user?.id) return;
    
    enviarComando({
      accion: 'ABRIR_DETALLE',
      notificacionId,
      usuarioId: user.id
    });
  }, [user?.id, enviarComando]);
  
  const contarNoLeidas = useCallback(() => {
    if (!user?.id) return;
    
    enviarComando({
      accion: 'CONTAR_NO_LEIDAS',
      usuarioId: user.id
    });
  }, [user?.id, enviarComando]);
  
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
  
  return {
    socket,
    isConnected,
    notificaciones,
    notificacionesNoLeidas,
    notificacionActual,
    cargando,
    error,
    connectWebSocket,
    cargarNotificaciones,
    marcarComoLeida,
    verDetalle,
    contarNoLeidas
  };
}

