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
        console.log(`Intentando conectar SSE para usuario ${this.usuarioId}`);
        const url = `http://localhost:3001/api/notificaciones/sse/${this.usuarioId}`;
        console.log('URL de conexión SSE:', url);
        
        this.eventSource = new EventSource(url);
        console.log('EventSource creado');

        // Verificar el estado de la conexión
        const checkConnection = () => {
          if (this.eventSource) {
            console.log('Estado de la conexión SSE:', this.eventSource.readyState);
            if (this.eventSource.readyState === EventSource.OPEN) {
              console.log('Conexión SSE abierta');
            } else if (this.eventSource.readyState === EventSource.CONNECTING) {
              console.log('Conexión SSE en proceso');
            } else if (this.eventSource.readyState === EventSource.CLOSED) {
              console.log('Conexión SSE cerrada');
            }
          }
        };
  
        this.eventSource.onopen = () => {
          console.log('SSE connection established');
          this.reconnectAttempts = 0;
          checkConnection();
          if (this.callbacks.onConnect) {
            this.callbacks.onConnect();
          }
        };
  
        // Añadir listener para todos los eventos
        this.eventSource.addEventListener('message', (event) => {
          console.log('Evento message recibido:', event);
        });

        this.eventSource.addEventListener('nuevaNotificacion', (event) => {
          try {
            console.log('Evento nuevaNotificacion recibido:', event);
            const data = JSON.parse(event.data);
            console.log('Datos de nueva notificación:', data);
            if (this.callbacks.onNewNotification) {
              this.callbacks.onNewNotification(data);
            } else {
              console.warn('No hay callback registrado para nuevaNotificacion');
            }
          } catch (error) {
            console.error('Error al procesar nueva notificación:', error);
          }
        });
  
        this.eventSource.addEventListener('notificacionLeida', (event) => {
          try {
            console.log('Evento notificacionLeida recibido:', event);
            const data = JSON.parse(event.data);
            console.log('Datos de notificación leída:', data);
            if (this.callbacks.onNotificationRead) {
              this.callbacks.onNotificationRead(data.id);
            } else {
              console.warn('No hay callback registrado para notificacionLeida');
            }
          } catch (error) {
            console.error('Error al procesar notificación leída:', error);
          }
        });
  
        this.eventSource.addEventListener('notificacionEliminada', (event) => {
          try {
            console.log('Evento notificacionEliminada recibido:', event);
            const data = JSON.parse(event.data);
            console.log('Datos de notificación eliminada:', data);
            if (this.callbacks.onNotificationDeleted) {
              this.callbacks.onNotificationDeleted(data.id);
            } else {
              console.warn('No hay callback registrado para notificacionEliminada');
            }
          } catch (error) {
            console.error('Error al procesar notificación eliminada:', error);
          }
        });

        this.eventSource.addEventListener('conectado', (event) => {
          try {
            console.log('Evento conectado recibido:', event);
            const data = JSON.parse(event.data);
            console.log(`SSE connected with client ID: ${data.id}`);
          } catch (error) {
            console.error('Error al procesar evento de conexión:', error);
          }
        });

        this.eventSource.onerror = (error) => {
          console.error('SSE connection error:', error);
          checkConnection();

          if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
          }

          if (this.callbacks.onError) {
            this.callbacks.onError(error);
          }
          
          if (this.isActive && this.reconnectAttempts < this.maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
            console.log(`Reconectando en ${delay}ms... (Intento ${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
            this.reconnect(delay);
            this.reconnectAttempts++;
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Máximo número de intentos de reconexión alcanzado');
            this.disconnect();
          }
        };

        // Verificar la conexión después de un breve retraso
        setTimeout(checkConnection, 1000);
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