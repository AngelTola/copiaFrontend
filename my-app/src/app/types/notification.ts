// types/notification.ts
export type PrioridadNotificacion = 'ALTA' | 'MEDIA' | 'BAJA';

export interface Notificacion {
  id: string;
  usuarioId: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  prioridad: PrioridadNotificacion;
  entidadId?: string;
  tipoEntidad?: string;
  leido: boolean;
  leidoEn?: Date | null;
  creadoEn: Date;
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
  data: any;
  usuarioId: string;
}

export interface ComandoWebSocket {
  accion: string;
  notificacionId?: string;
  usuarioId: string;
  params?: any;
}

export interface ConteoNoLeidas {
  count: number;
}
