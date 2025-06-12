'use client';

import { useState, useRef, useEffect } from 'react';

type OrdenOpciones =
  | 'Mejor calificación'
  | 'Modelo: a - z'
  | 'Modelo: z - a'
  | 'Marca: a - z'
  | 'Marca: z - a'
  | 'Precio: mayor a menor'
  | 'Precio: menor a mayor';

type OrdenadoPorProps = {
  onOrdenar: (opcion: OrdenOpciones) => void;
};

export default function OrdenadoPor({ onOrdenar }: OrdenadoPorProps) {
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<OrdenOpciones>('Mejor calificación');
  const menuRef = useRef<HTMLDivElement>(null);
  
  const opciones: OrdenOpciones[] = [
    'Mejor calificación',
    'Modelo: a - z',
    'Modelo: z - a',
    'Marca: a - z',
    'Marca: z - a',
    'Precio: mayor a menor',
    'Precio: menor a mayor'
  ];
  
  // Manejar el clic fuera del menú para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMostrarOpciones(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
    
  // Aplicar el ordenamiento inicial solo al montar el componente
  useEffect(() => {
    // Solo aplicar el ordenamiento inicial una vez al montar
    onOrdenar(opcionSeleccionada);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const seleccionarOpcion = (opcion: OrdenOpciones) => {
    setOpcionSeleccionada(opcion);
    setMostrarOpciones(false);
    onOrdenar(opcion);
  };
  
  return (
    <div className="relative w-full max-w-xs" ref={menuRef}>
      <div className="flex flex-col sm:flex-row sm:items-center mb-4">
        <span className="text-black font-semibold mr-2 text-sm mb-1 sm:mb-0">Ordenar por:</span>
        <button
          onClick={() => setMostrarOpciones(!mostrarOpciones)}
          className="flex items-center justify-between bg-[#FCA311] border border-black rounded-lg px-3 py-2 text-sm min-w-[180px] text-white hover:opacity-90 transition-all"
        >
          <span>{opcionSeleccionada}</span>
          <svg
            className={`w-4 h-4 ml-2 transition-transform ${mostrarOpciones ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
      </div>
      
      {mostrarOpciones && (
        <div className="absolute z-10 mt-1 w-full bg-[#e4d5c1] border border-black rounded-lg shadow-lg overflow-hidden">
          {opciones.map((opcion) => (
            <div
              key={opcion}
              onClick={() => seleccionarOpcion(opcion)}
              className={`px-4 py-2 text-sm cursor-pointer transition-colors border border-black ${
                opcionSeleccionada === opcion 
                  ? 'bg-[#FCA311] text-white' 
                  : 'text-black hover:bg-[#FCA311] hover:text-white'
              }`}
            >
              {opcion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}