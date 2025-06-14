'use client';

import { useState } from 'react';
import BarraReserva from '../Autos/barraReserva';

interface FiltersBarProps {
  onBuscarDisponibilidad?: (fechaInicio: string, fechaFin: string) => void;
}

export default function FiltersBar({ onBuscarDisponibilidad }: FiltersBarProps) {
  const filtros = ['Filtro 1', 'Filtro 2', 'Filtro 3', 'Filtro 4', 'Filtro 5', 'Filtro 6', 'Filtro 7'];
  const [filtroActivo, setFiltroActivo] = useState(filtros[0]);

  const handleBuscarDisponibilidad = (fechaInicio: string, fechaFin: string) => {
    console.log('Búsqueda de disponibilidad en FiltersBar:', { fechaInicio, fechaFin });
    
    // Llamar a la función padre si existe
    if (onBuscarDisponibilidad) {
      onBuscarDisponibilidad(fechaInicio, fechaFin);
    }
  };

  return (
    <div className="flex flex-col bg-white font-[var(--fuente-principal)] border-b-[2px] border-[rgba(0,0,0,0.2)] shadow-[0_4px_10px_rgba(0,0,0,0.25)] rounded-b-[20px]">
      {/* Barra de Reserva */}
      <div className="px-4 py-3">
        <BarraReserva onBuscarDisponibilidad={handleBuscarDisponibilidad} />
      </div>
      
      {/* Filtros existentes */}
      <div className="flex justify-center items-center px-4 py-2">
        <div className="flex gap-16 overflow-x-auto scrollbar-hide text-[rgba(0,0,0,0.64)]">
          {filtros.map((filtro) => (
            <span
              key={filtro}
              onClick={() => setFiltroActivo(filtro)}
              className={`cursor-pointer whitespace-nowrap ${
                filtro === filtroActivo
                  ? 'text-[var(--naranja)] font-bold underline'
                  : ''
              }`}
            >
              {filtro}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-12 ml-4">
          <button className="bg-white border-2 border-[rgba(0,0,0,0.2)] rounded px-2 py-1 cursor-pointer">
            &gt;
          </button>
          <button className="bg-[var(--naranja)] text-[var(--blanco)] font-bold rounded px-8 py-2 shadow-[0px_4px_3px_rgba(1,0,0,0.165)] cursor-pointer">
            Filtros
          </button>
        </div>
      </div>
    </div>
  );
}