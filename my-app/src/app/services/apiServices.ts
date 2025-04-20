import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Notificacion, NotificacionResponse, ConteoNoLeidas } from '@/app/types/notification';

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error codes
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login)
      console.error('Session expired or unauthorized');
      // You could redirect to login or trigger auth refresh here
    }
    return Promise.reject(error);
  }
);

// Notification API endpoints
export const notificacionesApi = {
  // Get notification panel data with filters
  getPanelNotificaciones: async (usuarioId: string, filtros?: Record<string, any>): Promise<NotificacionResponse> => {
    const params = new URLSearchParams();
    if (filtros) {
      Object.entries(filtros).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    const queryString = params.toString() ? `?${params.toString()}` : '';
    const response = await apiClient.get<NotificacionResponse>(`/notificaciones/panel-notificaciones/${usuarioId}${queryString}`);
    return response.data;
  },

  // Get notification detail
  getDetalleNotificacion: async (id: string, usuarioId: string): Promise<Notificacion> => {
    const response = await apiClient.get<Notificacion>(`/notificaciones/detalle-notificacion/${id}?usuarioId=${usuarioId}`);
    return response.data;
  },

  // Mark notification as read
  marcarComoLeida: async (id: string, usuarioId: string): Promise<Notificacion> => {
    const response = await apiClient.put<Notificacion>(`/notificaciones/notificacion-leida/${id}`, { usuarioId });
    return response.data;
  },

  // Delete notification
  eliminarNotificacion: async (id: string, usuarioId: string): Promise<any> => {
    const response = await apiClient.delete(`/notificaciones/eliminar-notificacion/${id}`, {
      data: { usuarioId }
    });
    return response.data;
  },

  // Get unread notifications count
  getConteoNoLeidas: async (usuarioId: string): Promise<ConteoNoLeidas> => {
    const response = await apiClient.get<ConteoNoLeidas>(`/notificaciones/notificaciones-no-leidas/${usuarioId}`);
    return response.data;
  },

  // Get dropdown notifications (limited to 4)
  getDropdownNotificaciones: async (usuarioId: string): Promise<{
    notificaciones: Notificacion[],
    totalNoLeidas: ConteoNoLeidas,
    hayMas: boolean
  }> => {
    const response = await apiClient.get(`/notificaciones/dropdown-notificaciones/${usuarioId}`);
    return response.data;
  },

  // Generate rent concluded notification
  generarNotificacionRentaConcluida: async (rentaId: string): Promise<any> => {
    const response = await apiClient.post(`/notificaciones/generar-renta-concluida/${rentaId}`);
    return response.data;
  }
};

export default apiClient;