'use client';
import { useState, useEffect } from 'react';
import { CalificacionUsuario } from '@/app/types/auto';

interface BarraFiltrosProps {
  comentarios: CalificacionUsuario[];
  onFiltrar: (comentariosFiltrados: CalificacionUsuario[]) => void;
}

export default function BarraFiltros({ comentarios, onFiltrar }: BarraFiltrosProps) {
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const comentariosFiltrados = comentarios.filter(c =>
      (c.comentario || '').toLowerCase().includes(busqueda.toLowerCase())
    );
    onFiltrar(comentariosFiltrados);
  }, [busqueda, comentarios, onFiltrar]);

  return (
    <div className="flex items-center w-full sm:w-auto border border-gray-400 rounded-full px-3 py-1 bg-white">
      <input
        type="text"
        placeholder="Buscar comentarios..."
        className="outline-none flex-grow px-2 py-1 text-black bg-transparent"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
      />
      <button className="text-[#002a5c] hover:text-[#fca311]" type="button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
          />
        </svg>
      </button>
    </div>
  );
}