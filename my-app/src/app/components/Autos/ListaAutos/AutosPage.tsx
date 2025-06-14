"use client"

import { useRef } from 'react';
import FiltersBar from '../../filters/FiltersBar';
import { AutosBrowser } from './AutosBrowser';

interface AutosPageProps {
  showFiltersBar?: boolean;
  onBuscarDisponibilidad?: (fechaInicio: string, fechaFin: string) => void;
  onSetBuscarCallback?: (callback: (fechaInicio: string, fechaFin: string) => void) => void;
  className?: string;
}

export default function AutosPage({ 
  showFiltersBar = true, 
  onBuscarDisponibilidad,
  onSetBuscarCallback,
  className = ""
}: AutosPageProps) {
  const buscarAutosRef = useRef<((fechaInicio: string, fechaFin: string) => void) | null>(null);

  const handleBuscarDisponibilidad = (fechaInicio: string, fechaFin: string) => {
    console.log('Iniciando búsqueda con fechas:', { fechaInicio, fechaFin });
    
    // Si viene una función externa, la usamos
    if (onBuscarDisponibilidad) {
      onBuscarDisponibilidad(fechaInicio, fechaFin);
    }
    
    // Llamar a la función de búsqueda del AutosBrowser
    if (buscarAutosRef.current) {
      buscarAutosRef.current(fechaInicio, fechaFin);
    }
  };

  const setBuscarAutosCallback = (callback: (fechaInicio: string, fechaFin: string) => void) => {
    buscarAutosRef.current = callback;
    
    // Si hay un callback externo para registrar esta función, lo llamamos
    if (onSetBuscarCallback) {
      onSetBuscarCallback(callback);
    }
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Solo mostrar FiltersBar si showFiltersBar es true */}
      {showFiltersBar && (
        <FiltersBar onBuscarDisponibilidad={handleBuscarDisponibilidad} />
      )}
      
      {/* Navegador de autos */}
      <AutosBrowser 
        onBuscarDisponibilidad={setBuscarAutosCallback}
        showSearchBar={true}
        showSortOptions={true}
        className={showFiltersBar ? "mt-4" : ""}
      />
    </div>
  );
}