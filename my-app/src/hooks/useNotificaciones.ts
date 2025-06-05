import { useState, useEffect, useCallback, useRef } from 'react';
import NotificationService from '../app/services/NotificationService';
import { getUserId } from '../app/utils/userIdentifier';
import type { Notificacion, NotificationResponse } from '@/app/types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationResponse[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const notificationServiceRef = useRef<NotificationService | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const userId = getUserId();

  const fetchNotifications = useCallback(async () => {
    console.log("Ejecutando fetchNotifications con userId:", userId);
    if (!userId) {
      console.log("No hay userId, abortando carga de notificaciones");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Solicitando notificaciones a la API...");
      const response = await fetch(`http://localhost:3001/api/notificaciones/dropdown-notificaciones/${userId}`);
      const data = await response.json();
      
      console.log("Respuesta API notificaciones:", data);
      
      if (response.ok) {
        const transformarNotificacion = (n: NotificationResponse): Notificacion => ({
          id: n.id,
          titulo: n.titulo,
          descripcion: n.mensaje,
          mensaje: n.mensaje,
          fecha: n.creadoEn,
          tipo: n.tipo || "No especificado",
          tipoEntidad: n.tipoEntidad || "No especificado",
          imagenURL: n.imagenAuto,
          leido: n.leido,
          creadoEn: n.creadoEn,
        });

        const notificacionesMapped = data.notificaciones.map(transformarNotificacion);
        
        console.log("Actualizando notificaciones en estado local", notificacionesMapped.map((n: Notificacion) => ({id: n.id, leido: n.leido})));
        setNotifications(notificacionesMapped);
      } else {
        console.error("Error en respuesta API:", data.error);
        setError(data.error || 'Error al cargar notificaciones');
      }
    } catch (error:unknown) {
      if (error instanceof Error) console.error('Error al cargar notificaciones:', error.message);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchUnreadCount = useCallback(async () => {
    if (!userId) return;
    
    try {
      console.log("Obteniendo conteo de no leídas directo de la API");
      const response = await fetch(`http://localhost:3001/api/notificaciones/notificaciones-no-leidas/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log("Contador de no leídas recibido de API:", data.count);
        setUnreadCount(data.count);
      } else {
        console.error("Error al obtener conteo:", data.error);
      }
    } catch (error:unknown) {
      if (error instanceof Error) console.error("Error al consultar conteo de no leídas:", error.message);
    }
  }, [userId]);

  const markAsRead = useCallback(async (notificationId: string) => {
    console.log("markAsRead llamada para:", notificationId);
    if (!userId) {
      console.log("No hay userId, abortando markAsRead");
      return;
    }
    
    try {
      console.log("Actualizando estado local antes de llamar API");
      setNotifications(prev => {
        const updated = prev.map(n => {
          if (n.id === notificationId) {
            console.log(`Cambiando notificación ${n.id} a leída (estaba: ${n.leido})`);
            return { ...n, leido: true };
          }
          return n;
        });
        return updated;
      });
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      console.log("Llamando a API para marcar como leída:", notificationId);
      const response = await fetch(
        `http://localhost:3001/api/notificaciones/notificacion-leida/${notificationId}/${userId}`,
        { method: 'PUT' }
      );
      
      if (!response.ok) {
        throw new Error('Error al marcar como leída');
      }
      
      await fetchUnreadCount();
      
    } catch (error:unknown) {
      if (error instanceof Error) console.error('Error al marcar notificación como leída:', error.message);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, leido: false } : n)
      );
      await fetchUnreadCount();
    }
  }, [userId, fetchUnreadCount]);

  useEffect(() => {
    console.log("Init useEffect para SSE/WebSocket, userId:", userId);
    if (typeof window === 'undefined') {
      console.log("Ejecutando en SSR, abortando conexión SSE");
      return;
    }
    if (!userId) {
      console.log("No hay userId, abortando conexión SSE");
      return;
    }

    // Cargar notificaciones y contador inicial
    fetchNotifications();
    fetchUnreadCount();

    console.log("Inicializando servicio de notificaciones");
    const notificationService = new NotificationService(userId)
      .onConnect(() => {
        console.log('Conexión establecida con el servidor de notificaciones');
        setIsConnected(true);
        setError(null);
        // Recargar notificaciones al reconectar
        fetchNotifications();
        fetchUnreadCount();
      })
      .onNewNotification((notification) => {
        console.log("Nueva notificación recibida en hook:", notification);
        setNotifications(prev => {
          const exists = prev.some(n => n.id === notification.id);
          if (exists) {
            console.log("Notificación ya existe, actualizando");
            return prev.map(n => n.id === notification.id ? notification : n);
          }
          
          console.log("Agregando nueva notificación al array");
          return [notification, ...prev];
        });
        
        // Incrementar contador solo si la notificación no está leída
        if (!notification.leido) {
          console.log("Incrementando contador de no leídas");
          setUnreadCount(prev => {
            const newCount = prev + 1;
            console.log("Nuevo contador de no leídas:", newCount);
            return newCount;
          });
        }
      })
      .onNotificationRead((notificationId) => {
        console.log("Evento notificación leída recibido en hook:", notificationId);
        setNotifications(prev => {
          const updated = prev.map(n => {
            if (n.id === notificationId) {
              console.log(`SSE: cambiando notificación ${n.id} a leída (estaba: ${n.leido})`);
              return { ...n, leido: true };
            }
            return n;
          });
          return updated;
        });
        
        // Decrementar contador solo si la notificación estaba no leída
        setUnreadCount(prev => {
          const newCount = Math.max(0, prev - 1);
          console.log("Nuevo contador de no leídas:", newCount);
          return newCount;
        });
      })
      .onNotificationDeleted((notificationId) => {
        console.log("Evento notificación eliminada recibido en hook:", notificationId);
        setNotifications(prev => {
          const updated = prev.filter(n => n.id !== notificationId);
          return updated;
        });
        
        // Recalcular contador de no leídas
        setUnreadCount(prev => {
          const newCount = Math.max(0, prev - 1);
          console.log("Nuevo contador de no leídas:", newCount);
          return newCount;
        });
      })
      .onError((error) => {
        console.log("Error en conexión SSE:", error);
        setIsConnected(false);
        setError('Conexión al servidor de notificaciones perdida');
      });

    // Conectar el servicio
    console.log("Conectando servicio de notificaciones...");
    notificationService.connect();
    notificationServiceRef.current = notificationService;

    return () => {
      console.log("Limpiando conexión SSE");
      if (notificationServiceRef.current) {
        notificationServiceRef.current.disconnect();
        notificationServiceRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [userId, fetchNotifications, fetchUnreadCount]);

  return {
    notifications,
    unreadCount,
    isConnected,
    error,
    loading,
    setNotifications,
    refreshNotifications: fetchNotifications,
    markAsRead,
  };
}
