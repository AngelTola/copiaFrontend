"use client"

import BarraBusqueda from "@/app/components/Autos/BusquedaAuto/BarraBusqueda"
import OrdenadoPor from "@/app/components/Autos/Ordenamiento/OrdenadoPor"
import { AutosList } from "./AutosList"
//import { SearchStatus } from "./EstadoBusqueda"
import { useAutosSearch } from "./useAutosSearch"

interface AutosBrowserProps {
  showReservaBar?: boolean;
  showSearchBar?: boolean;
  showSortOptions?: boolean;
  className?: string;
  initialLoadCount?: number;
  loadMoreCount?: number;
}

export const AutosBrowser = ({ 
  showSearchBar = true,
  showSortOptions = true,
  className = "",
  initialLoadCount = 8,
  loadMoreCount = 4
}: AutosBrowserProps) => {
  const {
    autosFiltrados,
    busquedaActiva,
    //fechasReserva,
    cargando,
    //error,
    promediosPorAuto,
    filtrarAutos,
    aplicarOrden,
  } = useAutosSearch()

  return (
    <div className={`max-w-4xl mx-auto px-4 py-2 ${className}`}>

      {/* Estados de búsqueda */}
      {/*<SearchStatus 
        cargando={cargando}
        error={error}
        //fechasReserva={fechasReserva}
      />
      */}

      {/* Barra de búsqueda */}
      {showSearchBar && (
        <div className="mb-4">
          <BarraBusqueda onBuscar={filtrarAutos} totalResultados={autosFiltrados.length} />
        </div>
      )}

      {/* Componente OrdenadoPor */}
      {showSortOptions && (
        <div className="mb-6">
          <OrdenadoPor onOrdenar={aplicarOrden} />
        </div>
      )}
      
      {/* Lista de autos */}
      {autosFiltrados.length > 0 ? (
        <AutosList 
          autos={autosFiltrados}
          promediosPorAuto={promediosPorAuto}
          initialLoadCount={initialLoadCount}
          loadMoreCount={loadMoreCount}
        />
      ) : (
        <p className="text-center text-gray-600 mt-10">
          {busquedaActiva ? 
            (cargando ? "Cargando autos..." : "No se encontraron resultados") : 
            "Ingrese las fechas que desea rentar"}
        </p>
      )}
    </div>
  )
}