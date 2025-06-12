// Tipos enumerados primero para referencia
export type TipoCalificacionUsuario = 'ARRENDADOR' | 'ARRENDATARIO';
export type EstadoReserva = 'SOLICITADA' | 'APROBADA' | 'RECHAZADA' | 'CONFIRMADA' | 'CANCELADA' | 'EN_CURSO' | 'FINALIZADA';
export type EstadoGarantia = 'DEPOSITADA' | 'LIBERADA' | 'RETENIDA';
export type MetodoPago = 'QR' | 'TARJETA_DEBITO';
export type Transmision = 'AUTOMATICO' | 'MANUAL';
export type Combustible = 'GASOLINA' | 'DIESEL' | 'ELECTRICO' | 'HIBRIDO';
export type TipoMantenimiento = 'PREVENTIVO' | 'CORRECTIVO' | 'REVISION';
export type EstadoAuto = 'ACTIVO' | 'INACTIVO';
export type MotivoNoDisponibilidad = 'MANTENIMIENTO' | 'REPARACION' | 'USO_PERSONAL' | 'OTRO';
export type TipoPago = 'RENTA' | 'GARANTIA';
export type RolUsuario = 'ARRENDADOR' | 'RENTADOR' | 'DRIVER';
export type PrioridadNotificacion = 'BAJA' | 'MEDIA' | 'ALTA';
export type TipoDeNotificacion = 'RESERVA_SOLICITADA' | 'RESERVA_APROBADA' | 'RESERVA_RECHAZADA' | 'DEPOSITO_CONFIRMADO' | 'DEPOSITO_RECIBIDO' | 'RESERVA_CANCELADA' | 'ALQUILER_FINALIZADO' | 'RESERVA_MODIFICADA' | 'VEHICULO_CALIFICADO';

// Interfaces principales
export interface Usuario {
  idUsuario: number;
  nombreCompleto: string;
  email: string;
  telefono?: string | null;
  direccion?: string | null;
  fechaRegistro: Date | string;
  contraseña: string;
  esAdmin: boolean;
  notificaciones: Notificacion[];
  autos: Auto[];
  reservas: Reserva[];
  comentariosEscritos: Comentario[];
  calificacionesRecibidas: CalificacionUsuario[];
  calificacionesRealizadas: CalificacionUsuario[];
}

export interface Notificacion {
  idNotificacion: number;
  idUsuario: number;
  titulo: string;
  mensaje: string;
  idEntidad?: string | null;
  tipoEntidad?: string | null;
  leido: boolean;
  leidoEn?: Date | string | null;
  creadoEn: Date | string;
  actualizadoEn: Date | string;
  haSidoBorrada: boolean;
  tipo: TipoDeNotificacion;
  prioridad: PrioridadNotificacion;
  usuario: Usuario;
}

export interface Ubicacion {
  idUbicacion: number;
  nombre: string;
  descripcion?: string | null;
  latitud: number;
  longitud: number;
  esActiva: boolean;
  autos: Auto[];
}

export interface Auto {
  idAuto: number;
  idPropietario: number;
  idUbicacion: number;
  ubicacion: Ubicacion;
  propietario: Usuario;
  marca: string;
  modelo: string;
  descripcion?: string | null;
  precioRentaDiario: string;
  montoGarantia: number;
  kilometraje: number;
  comentarios: Comentario[];
  calificacionPromedio?: number | null;
  totalComentarios: number;
  reservas: Reserva[];
  disponibilidad: Disponibilidad[];
  tipo: string;
  año: number;
  placa: string;
  color: string;
  estado: EstadoAuto;
  fechaAdquisicion: Date | string;
  historialMantenimiento: HistorialMantenimiento[];
  imagenes: Imagen[];
  asientos: number;
  capacidadMaletero: number;
  transmision: Transmision;
  combustible: Combustible;
  diasTotalRenta?: number | null;
  vecesAlquilado?: number | null;
}

export interface AutoConDisponibilidad {
  idAuto: number;
  modelo: string;
  marca: string;
  precio: string;
  calificacionPromedio?: number | null;
  disponible: boolean;
  imagenes: Imagen[];
}

export interface Imagen {
  idImagen: number;
  idAuto: number;
  auto: Auto;
  direccionImagen: string;
}

export interface Disponibilidad {
  idDisponibilidad: number;
  idAuto: number;
  auto: Auto;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  motivo: MotivoNoDisponibilidad;
  descripcion?: string | null;
}

export interface Reserva {
  idReserva: number;
  fechaInicio: Date | string;
  fechaFin: Date | string;
  idAuto: number;
  auto: Auto;
  idCliente: number;
  cliente: Usuario;
  estado: EstadoReserva;
  fechaSolicitud: Date | string;
  fechaAprobacion?: Date | string | null;
  fechaLimitePago: Date | string;
  montoTotal: number;
  kilometrajeInicial?: number | null;
  kilometrajeFinal?: number | null;
  pagos: Pago[];
  garantia?: Garantia | null;
  comentario?: Comentario | null;
  estaPagada: boolean;
  calificacionUsuario?: CalificacionUsuario | null;
}

export interface Pago {
  idPago: number;
  idReserva: number;
  reserva: Reserva;
  monto: number;
  fechaPago: Date | string;
  metodoPago: MetodoPago;
  referencia?: string | null;
  comprobante?: string | null;
  tipo: TipoPago;
}

export interface Garantia {
  idGarantia: number;
  idReserva: number;
  reserva: Reserva;
  monto: number;
  fechaDeposito: Date | string;
  fechaLiberacion?: Date | string | null;
  estado: EstadoGarantia;
  comprobante?: string | null;
}

export interface HistorialMantenimiento {
  idHistorial: number;
  idAuto: number;
  auto: Auto;
  fechaInicio: Date | string;
  fechaFin?: Date | string | null;
  descripcion: string;
  costo?: number | null;
  tipoMantenimiento: TipoMantenimiento;
  kilometraje: number;
}

export interface Comentario {
  idComentario: number;
  idCalificador: number;
  nombreCompleto: string;
  contenido: string;
  comentario: string;
  calificacion: number;
  puntuacion: number;
  fechaCreacion: string;
  usuario: {
  nombreCompleto: string;
};
}


export interface CalificacionUsuario {
  idCalificacion: number;
  idCalificador: number;
  calificador: Usuario;
  idCalificado: number;
  calificado: Usuario;
  puntuacion: number;
  comentario?: string | null;
  fechaCreacion: Date | string;
  idReserva: number;
  reserva: Reserva;
  tipoCalificacion: TipoCalificacionUsuario;
  nombre: string;
  apellido: string;
}

// Tipos utilitarios para relaciones parciales
export type UsuarioPreview = Pick<Usuario, 'idUsuario' | 'nombreCompleto' | 'email'>;
export type AutoPreview = Pick<Auto, 'idAuto' | 'marca' | 'modelo' | 'precioRentaDiario' | 'imagenes'>;
export type ReservaPreview = Pick<Reserva, 'idReserva' | 'fechaInicio' | 'fechaFin' | 'estado'>;