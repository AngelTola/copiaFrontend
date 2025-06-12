'use client';

import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { IoClose } from 'react-icons/io5';

interface BarraBusquedaProps {
  onBuscar: (valorBusqueda: string) => void;
  totalResultados: number;
}

export default function BarraBusqueda({ onBuscar, totalResultados }: BarraBusquedaProps) {
  const [valorBusqueda, setValorBusqueda] = useState('');
  const [error, setError] = useState('');
  const [busquedaEjecutada, setBusquedaEjecutada] = useState(false);
  const caracteresNoValidos = /[@#$%()^&*!_+?/:";',.<>{}\[\]:-]/;

  useEffect(() => {
    const historial = localStorage.getItem('historialBusquedas');
    if (!historial) {
      localStorage.setItem('historialBusquedas', JSON.stringify([]));
    }
  }, []);

  const manejarCambio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;

    if (valor.startsWith(' ') || valor.includes('  ')) {
      setError('');
      return;
    }

    if (valor.length > 50) {
      setError('El campo no puede exceder los 50 caracteres');
      return;
    }

    if (caracteresNoValidos.test(valor)) {
      setError('No se permiten símbolos como @, #, $, %, (, ), ^, &, *, _, +, ?, /, ", :, ;, .');
    } else {
      setError('');
      setValorBusqueda(valor);
      setBusquedaEjecutada(false); 
    }
  };

  const limpiarBusqueda = () => {
    setValorBusqueda('');
    setBusquedaEjecutada(false); 
    onBuscar('');
  };

  const ejecutarBusqueda = () => {
    const valor = valorBusqueda.trim();

    if (!valor) {
      setBusquedaEjecutada(false);
      onBuscar('');
      return;
    }

    if (valor.startsWith(' ') || valor.includes('  ')) {
      setError('Por favor corrija los espacios en la búsqueda');
      return;
    }

    setError('');
    setBusquedaEjecutada(true); 
    onBuscar(valor);
    guardarEnHistorial(valor);
  };

  const manejarEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') ejecutarBusqueda();
  };

  const guardarEnHistorial = (valor: string) => {
    const historial = JSON.parse(localStorage.getItem('historialBusquedas') || '[]');
    if (!historial.includes(valor)) {
      historial.push(valor);
      localStorage.setItem('historialBusquedas', JSON.stringify(historial));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-4 sticky top-0 bg-white z-10 py-4">
      <div className="flex items-center gap-2 w-full">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-2 flex items-center">
            <div className="bg-[#FCA311] rounded-full h-8 w-8 flex items-center justify-center">
              <FiSearch className="h-5 w-5 text-white" />
            </div>
          </div>

          <input
            type="text"
            placeholder="Buscar por marca o modelo..."
            value={valorBusqueda}
            onChange={manejarCambio}
            onKeyDown={manejarEnter}
            className="block w-full pl-10 pr-10 py-3 border border-black rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent text-gray-700"
          />
          {valorBusqueda && (
            <button
              onClick={limpiarBusqueda}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-black"
            >
              <IoClose className="h-5 w-5" />
            </button>
          )}
        </div>
        <button
          onClick={ejecutarBusqueda}
          className="bg-[var(--naranja)] hover:bg-[#e4920b] text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200 text-base h-full"
        >
          Buscar
        </button>
      </div>

      <div className="mt-2 text-left text-gray-600 text-lg pl-2 font-bold">
        {totalResultados > 0 ? (
          <>
            {totalResultados}{' '}
            <span className="text-lg">
              {totalResultados === 1 ? ' coche disponible' : ' coches disponibles'}
            </span>
          </>
        ) : busquedaEjecutada && valorBusqueda ? ( 
          <p className="text-red-500">No se encontraron resultados para su búsqueda.</p>
        ) : null}
      </div>

      {error && <p className="text-red-500 mt-2 text-sm pl-2">{error}</p>}
    </div>
  );
}