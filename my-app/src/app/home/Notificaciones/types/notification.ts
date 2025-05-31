export interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  mensaje: string;
  fecha: Date | string;
  tipo: string;
  tipoEntidad: string;
  imagenURL?: string;
  leida: boolean;
  creadoEn: Date | string;
} 