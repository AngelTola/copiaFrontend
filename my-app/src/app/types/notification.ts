export type PrioridadNotificacion = 'ALTA' | 'MEDIA' | 'BAJA';

export interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  mensaje: string;
  fecha: string;
  tipo: string;
  tipoEntidad: string;
  imagenURL?: string;
  leido: boolean;
  creadoEn: string;
  imagenAuto?: string;
}

export interface NotificacionFiltro {
  usuarioId?: string;
  tipo?: string;
  leido?: boolean;
  prioridad?: PrioridadNotificacion;
  tipoEntidad?: string;
  desde?: Date;
  hasta?: Date;
  limit?: number;
  offset?: number;
}

export interface NotificacionResponse {
  notificaciones: Notificacion[];
  total: number;
  page: number;
  limit: number;
}

export interface NotificacionWebSocket {
  evento: string;
  data: Notificacion;
  usuarioId: string;
}

export interface ComandoWebSocket {
  accion: string;
  notificacionId?: string;
  usuarioId: string;
  params?: Record<string, unknown>;
}

export interface ConteoNoLeidas {
  count: number;
}

export interface NotificationResponse {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  tipoEntidad: string;
  creadoEn: string;
  leido: boolean;
  imagenAuto?: string;
  imagenURL?: string;
}

export interface NotificationError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}
