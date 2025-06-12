import type { Auto, Comentario, CalificacionUsuario,
     Usuario, AutoConDisponibilidad } from "@/app/types/auto"
     
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function getAutos(): Promise<{ data: Auto[] }> {
  const res = await fetch(`${BASE_URL}/api/autos`, { cache: "no-store" })
  if (!res.ok) throw new Error("Error al obtener autos")
  return res.json()
}

export async function getAutoPorId(id: string): Promise<{ data: Auto }> {
  const res = await fetch(`${BASE_URL}/api/autos/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Auto no encontrado")
  return res.json()
}

export async function getComentariosDeAuto(autoId: number): Promise<{ data: Comentario[] }> {
  const res = await fetch(`${BASE_URL}/api/autos/${autoId}/comentarios`, { cache: "no-store" })
  if (!res.ok) throw new Error("No se pudieron cargar los comentarios")
  return res.json()
}

export async function getAutosDisponiblesPorFecha(fechaInicio: string, fechaFin: string): Promise<{ data: Auto[] }> {
  try {
    const inicio = fechaInicio.split("T")[0]
    const fin = fechaFin.split("T")[0]

    console.log(`Consultando autos disponibles entre ${inicio} y ${fin}`)

    const res = await fetch(`${BASE_URL}/api/autosDisponibles/${inicio}/${fin}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      console.error(`Error de API: Status ${res.status} - ${res.statusText}`)
      let errorMessage = `${res.status} ${res.statusText}`
      
      try {
        const errorData = await res.json()
        console.error("Detalles del error:", errorData)
        if (errorData.message) errorMessage = errorData.message
      } catch (error) {
        console.log("No se pudo parsear la respuesta de error:", error)
      }

      throw new Error(`Error al obtener autos disponibles: ${errorMessage}`)
    }

    return res.json()
  } catch (error) {
    console.error("Error en getAutosDisponiblesPorFecha:", error)
    throw error
  }
}


export async function getUsuarios(): Promise<{ data: Usuario[] }> {
  const res = await fetch(`${BASE_URL}/api/usuarios`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function getComentariosDeHost(id: string): Promise<{ data: CalificacionUsuario[] }> {
  const res = await fetch(`${BASE_URL}/api/host/${id}`, { cache: "no-store" });
  if (!res.ok) return { data: [] }; // devuelve array vacío en vez de null
  return res.json();
}


export async function getHost(id: number, inicio: string, fin: string): Promise<{
  success: boolean;
  host: {
    idUsuario: number;
    nombre: string;
    apellido:string;
    correo:string;
    autos: {
      idAuto: number;
      modelo: string;
      marca: string;
      precio: number;
      calificacionPromedio: number | null;
      disponible: boolean;
    }[];
  };
}> {
  const res = await fetch(`${BASE_URL}/api/hosts/${id}/${inicio}/${fin}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const errorDetails = await res.text();
    console.error(`Error al obtener el host. Status: ${res.status}. Detalles: ${errorDetails}`);
    throw new Error(`Error al obtener el host: ${res.statusText}`);
  }

  const data = await res.json();

  if (!data.success || !data.host) {
    throw new Error("La respuesta del servidor no contiene un host válido.");
  }

  return data;
}

export async function getUsuarioPorId(id: string): Promise<{ data: Usuario }> {
  const res = await fetch(`${BASE_URL}/api/usuario/${id}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Usuario no encontrado")
  return res.json()
}

export async function getAutosPorHostYFecha(
  idUsuario: number, 
  fechaInicio: string, 
  fechaFin: string
): Promise<AutoConDisponibilidad[]> {
  // Convierte las fechas a objetos Date para normalizar y luego a yyyy-mm-dd
  const inicioDate = new Date(fechaInicio);
  const finDate = new Date(fechaFin);

  const inicio = inicioDate.toISOString().split('T')[0];
  const fin = finDate.toISOString().split('T')[0];
  console.log("URL fetch:", `${BASE_URL}/api/hosts/${idUsuario}/${inicio}/${fin}`);
  const res = await fetch(`${BASE_URL}/api/hosts/${idUsuario}/${inicio}/${fin}`);

  if (!res.ok) {
    console.error("Error al obtener los autos del host", await res.text());
    throw new Error("Error al obtener los autos del host");
  }

  const data = await res.json();

  return data.host.autos;
}

export async function getAutosPorHost(idUsuario: number): Promise<AutoConDisponibilidad[]> {
  const res = await fetch(`${BASE_URL}/api/hosts/${idUsuario}`, { cache: "no-store" }); // asegúrate del plural "hosts"
  
  if (!res.ok) {
    console.error("Error al obtener los autos del host:", await res.text());
    throw new Error("Error al obtener los autos del host");
  }
  
  const data = await res.json();
  return data.host.autos;
}