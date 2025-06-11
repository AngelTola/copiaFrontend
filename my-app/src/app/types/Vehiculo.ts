export interface Vehiculo {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagenUrl?: string;
  calificacion: number;
  estado: string;
  latitud: number;
  longitud: number;
  distancia: number;
  anio: number;
  transmision: string;
  consumo: string; // <-- aquí estaba el problema (antes lo tenías como string)
}