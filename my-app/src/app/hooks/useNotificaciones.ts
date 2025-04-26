import { useState, useEffect, useCallback, useRef } from 'react';
import NotificationService, { Notification } from '../services/NotificationService';
import { getUserId } from '../utils/userIdentifier';
import { Notificacion } from '../types/notification';

export function useNotifications() {
  const [notifications, setNotifications] = useState<(Notificacion | Notification)[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const notificationServiceRef = useRef<NotificationService | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  const userId = getUserId();

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
    } catch (error) {
      console.error("Error al consultar conteo de no leídas:", error);
    }
  }, [userId]);

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
        const notificacionesMapped = data.notificaciones.map((n: any) => ({
          ...n,
          leida: n.leido !== undefined ? n.leido : n.leida,
        }));
        
        console.log("Actualizando notificaciones en estado local", notificacionesMapped.map((n: { id: any; leida: any; }) => ({id: n.id, leida: n.leida})));
        setNotifications(notificacionesMapped);
        
        console.log("Contador de no leídas desde API:", data.totalNoLeidas);
        setUnreadCount(data.totalNoLeidas);
      } else {
        console.error("Error en respuesta API:", data.error);
        setError(data.error || 'Error al cargar notificaciones');
      }
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
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
            console.log(`Cambiando notificación ${n.id} a leída (estaba: ${n.leida})`);
            return { ...n, leida: true };
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
      
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, leida: false } : n)
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

    console.log("Cargando notificaciones iniciales");
    fetchNotifications();
    fetchUnreadCount();

    console.log("Inicializando servicio de notificaciones");
    const notificationService = new NotificationService(userId)
      .onConnect(() => {
        console.log('Conexión establecida con el servidor de notificaciones');
        setIsConnected(true);
        setError(null);
      })
      .onNewNotification((notification) => {
        console.log("Nueva notificación recibida:", notification);
        setNotifications(prev => {
          const exists = prev.some(n => n.id === notification.id);
          if (exists) {
            console.log("Notificación ya existe, ignorando");
            return prev;
          }
          
          console.log("Agregando nueva notificación al array");
          return [notification, ...prev];
        });
        
        fetchUnreadCount();
      })
      .onNotificationRead((notificationId) => {
        console.log("Evento notificación leída recibido:", notificationId);
        setNotifications(prev => {
          const updated = prev.map(n => {
            if (n.id === notificationId) {
              console.log(`SSE: cambiando notificación ${n.id} a leída (estaba: ${n.leida})`);
              return { ...n, leida: true };
            }
            return n;
          });
          return updated;
        });
        
        fetchUnreadCount();
      })
      .onNotificationDeleted((notificationId) => {
        console.log("Evento notificación eliminada recibido:", notificationId);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        fetchUnreadCount();
      })
      .onError(() => {
        console.log("Error en conexión SSE");
        setIsConnected(false);
        setError('Conexión al servidor de notificaciones perdida');
      })
      .connect();

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
