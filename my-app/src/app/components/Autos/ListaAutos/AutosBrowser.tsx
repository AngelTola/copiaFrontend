"use client"

import BarraBusqueda from "@/app/components/Autos/BusquedaAuto/BarraBusqueda"
import OrdenadoPor from "@/app/components/Autos/Ordenamiento/OrdenadoPor"
import { AutosList } from "./AutosList"
import { SearchStatus } from "./EstadoBusqueda"
import { useAutosSearch } from "./useAutosSearch"
import { useEffect } from "react"

interface AutosBrowserProps {
  showReservaBar?: boolean;
  showSearchBar?: boolean;
  showSortOptions?: boolean;
  className?: string;
  initialLoadCount?: number;
  loadMoreCount?: number;
  // Nueva prop para recibir la función de búsqueda
  onBuscarDisponibilidad?: (callback: (fechaInicio: string, fechaFin: string) => void) => void;
}

export const AutosBrowser = ({ 
  showSearchBar = true,
  showSortOptions = true,
  className = "",
  initialLoadCount = 8,
  loadMoreCount = 4,
  onBuscarDisponibilidad
}: AutosBrowserProps) => {
  const {
    autosFiltrados,
    busquedaActiva,
    fechasReserva,
    cargando,
    error,
    promediosPorAuto,
    filtrarAutos,
    aplicarOrden,
    buscarAutosDisponibles,
  } = useAutosSearch()

  // Exponer la función de búsqueda al componente padre
  useEffect(() => {
    if (onBuscarDisponibilidad) {
      onBuscarDisponibilidad(buscarAutosDisponibles);
    }
  }, [onBuscarDisponibilidad, buscarAutosDisponibles]);

  return (
    <div className={`max-w-4xl mx-auto px-4 py-2 h-full flex flex-col ${className}`}>
      {/* Estados de búsqueda */}
      <SearchStatus 
        cargando={cargando}
        error={error}
        fechasReserva={fechasReserva}
      />

      {/* Barra de búsqueda */}
      {showSearchBar && (
        <div className="mb-4 flex-shrink-0">
          <BarraBusqueda onBuscar={filtrarAutos} totalResultados={autosFiltrados.length} />
        </div>
      )}

      {/* Componente OrdenadoPor */}
      {showSortOptions && (
        <div className="mb-6 flex-shrink-0">
          <OrdenadoPor onOrdenar={aplicarOrden} />
        </div>
      )}
      
      {/* Lista de autos - Con scroll aquí */}
      {autosFiltrados.length > 0 ? (
        <div className="flex-1 overflow-y-auto">
          <AutosList 
            autos={autosFiltrados}
            promediosPorAuto={promediosPorAuto}
            initialLoadCount={initialLoadCount}
            loadMoreCount={loadMoreCount}
          />
        </div>
      ) : (
        <p className="text-center text-gray-600 mt-10 flex-1 flex items-center justify-center">
          {busquedaActiva ? 
            (cargando ? "Cargando autos..." : "No se encontraron resultados") : 
            "Ingrese las fechas que desea rentar"}
        </p>
      )}
    </div>
  )
}