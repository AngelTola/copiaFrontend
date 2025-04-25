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

  const fetchNotifications = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/api/notificaciones/dropdown-notificaciones/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        setNotifications(data.notificaciones);
        setUnreadCount(data.totalNoLeidas);
      } else {
        setError(data.error || 'Error al cargar notificaciones');
      }
    } catch (err) {
      console.error('Error al cargar notificaciones:', err);
      setError('Error al cargar notificaciones');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // Solo ejecutar en el cliente, no durante SSR
    if (typeof window === 'undefined') return;
    if (!userId) return;

    fetchNotifications();

    // Conexión WebSocket con NotificationService
    const notificationService = new NotificationService(userId)
      .onConnect(() => {
        console.log('Conexión establecida con el servidor de notificaciones');
        setIsConnected(true);
        setError(null);
      })
      .onNewNotification((notification) => {
        setNotifications(prev => [notification, ...prev.slice(0, 3)]);
        if (!notification.leida) {
          setUnreadCount(prev => prev + 1);
        }
      })
      .onNotificationRead((notificationId) => {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, leida: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      })
      .onNotificationDeleted((notificationId) => {
        const isUnread = notifications.some(n => n.id === notificationId && !n.leida);
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        
        if (isUnread) {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
      })
      .onError(() => {
        setIsConnected(false);
        setError('Conexión al servidor de notificaciones perdida');
      })
      .connect();

    notificationServiceRef.current = notificationService;

    return () => {
      if (notificationServiceRef.current) {
        notificationServiceRef.current.disconnect();
        notificationServiceRef.current = null;
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, [userId, fetchNotifications]);

  return {
    notifications,
    unreadCount,
    isConnected,
    error,
    loading,
    setNotifications,
    refreshNotifications: fetchNotifications,
  };
}
