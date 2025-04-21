export interface Notification {
    id: string;
    tipo: string;
    titulo: string;
    mensaje: string;
    prioridad: string;
    leida: boolean;
    creadoEn: string;
    usuarioId: string;
    entidadId?: string;
    tipoEntidad?: string;
    datos?: any;
  }
  
  class NotificationService {
    private eventSource: EventSource | null = null;
    private usuarioId: string;
    private callbacks: {
      onNewNotification?: (notification: Notification) => void;
      onNotificationRead?: (notificationId: string) => void;
      onNotificationDeleted?: (notificationId: string) => void;
      onError?: (error: Event) => void;
      onConnect?: () => void; 
    };
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectTimeoutId: NodeJS.Timeout | null = null;
    private isActive: boolean = false;
  
    constructor(usuarioId: string) {
      this.usuarioId = usuarioId;
      this.callbacks = {};
    }
  
    onNewNotification(callback: (notification: Notification) => void) {
      this.callbacks.onNewNotification = callback;
      return this;
    }
  
    onNotificationRead(callback: (notificationId: string) => void) {
      this.callbacks.onNotificationRead = callback;
      return this;
    }
  
    onNotificationDeleted(callback: (notificationId: string) => void) {
      this.callbacks.onNotificationDeleted = callback;
      return this;
    }
  
    onError(callback: (error: Event) => void) {
      this.callbacks.onError = callback;
      return this;
    }
  
    onConnect(callback: () => void) {
      this.callbacks.onConnect = callback;
      return this;
    }

    connect() {
      if (this.eventSource) {
        this.disconnect();
      }
  
      this.isActive = true;
      
      try {
        this.eventSource = new EventSource(`http://localhost:3001/api/notificaciones/sse/${this.usuarioId}`);
  
        this.eventSource.onopen = () => {
          console.log('SSE connection established');
          this.reconnectAttempts = 0;
          if (this.callbacks.onConnect) {
            this.callbacks.onConnect();
          }
        };
  
        if (this.callbacks.onNewNotification) {
          this.eventSource.addEventListener('nuevaNotificacion', (event) => {
            const data = JSON.parse(event.data);
            this.callbacks.onNewNotification?.(data);
          });
        }
  
        if (this.callbacks.onNotificationRead) {
          this.eventSource.addEventListener('notificacionLeida', (event) => {
            const data = JSON.parse(event.data);
            this.callbacks.onNotificationRead?.(data.id);
          });
        }
  
        if (this.callbacks.onNotificationDeleted) {
          this.eventSource.addEventListener('notificacionEliminada', (event) => {
            const data = JSON.parse(event.data);
            this.callbacks.onNotificationDeleted?.(data.id);
          });
        }

        this.eventSource.addEventListener('conectado', (event) => {
          const data = JSON.parse(event.data);
          console.log(`SSE connected with client ID: ${data.id}`);
        });

        this.eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);

          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }

          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
          
          if (this.isActive && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnect(Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000));
            this.reconnectAttempts++;
          }
        };
      } catch (err) {
        console.error('Error creating EventSource:', err);
        if (this.isActive) {
          this.reconnect(1000);
        }
      }
  
      return this;
    }

    disconnect() {
      this.isActive = false;
      
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = null;
      }
      
      if (this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
      
      return this;
    }
  
    // Reconectar con retraso exponencial
    private reconnect(delay = 1000) {
      if (!this.isActive) return;
      
      console.log(`Reconnecting to SSE in ${delay}ms...`);
      
      if (this.reconnectTimeoutId) {
        clearTimeout(this.reconnectTimeoutId);
      }
      
      this.reconnectTimeoutId = setTimeout(() => {
        if (this.isActive) {
          this.connect();
        }
      }, delay);
    }
  }
  
  export default NotificationService;