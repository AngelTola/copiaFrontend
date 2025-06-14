"use client"

interface SearchStatusProps {
  cargando: boolean;
  error: string | null;
  fechasReserva: { inicio: string; fin: string } | null;
}

export const SearchStatus = ({ cargando, error, fechasReserva }: SearchStatusProps) => {
  return (
    <>
      {/* Error */}
      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Indicador de carga */}
      {cargando && (
        <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-700 mr-2"></div>
          <p className="text-blue-700">Buscando autos disponibles...</p>
        </div>
      )}

      {/* Indicador de búsqueda activa */}
      {fechasReserva && !cargando && (
        <div className="mb-2 p-2 bg-blue-50 border border-blue-100 rounded-lg flex justify-between items-center">
          <div>
            <p className="text-blue-800 font-medium text-m">
              Mostrando autos disponibles desde {new Date(fechasReserva.inicio).toLocaleDateString()} hasta{" "}
              {new Date(fechasReserva.fin).toLocaleDateString()} - Ordenados por mejor calificación
            </p>
          </div>
        </div>
      )}
    </>
  )
}