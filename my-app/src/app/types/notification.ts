export type PrioridadNotificacion = 'ALTA' | 'MEDIA' | 'BAJA';

export interface NotificacionFiltro {
  leido?: boolean;
  prioridad?: PrioridadNotificacion;
  tipo?: string;
  offset?: number;
  limit?: number;
}

export interface Notificacion {
  id: string;
  titulo: string;
  mensaje: string;
  prioridad: PrioridadNotificacion;
  tipo: string;
  leido: boolean;
  fecha: string;
}
