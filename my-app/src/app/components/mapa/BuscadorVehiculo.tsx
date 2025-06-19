"use client";

import { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { AiOutlineClockCircle } from "react-icons/ai";

interface BuscadorVehiculoProps {
  textoBusqueda: string;
  setTextoBusqueda: React.Dispatch<React.SetStateAction<string>>;
}

interface Busqueda {
  termino: string;
  creado_en: string;
}

export default function BuscadorVehiculo({
  textoBusqueda,
  setTextoBusqueda,
}: BuscadorVehiculoProps) {
  const [historial, setHistorial] = useState<Busqueda[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);
  const refBuscador = useRef<HTMLDivElement>(null);
  const usuarioId = 1;

  const fetchHistorial = async () => {
    try {
      const url = textoBusqueda.trim()
        ? `https://copia-backend.vercel.app/api/autocompletar?usuarioId=${usuarioId}&texto=${textoBusqueda}`
        : `https://copia-backend.vercel.app/api/ultimas?usuarioId=${usuarioId}`;
      const res = await fetch(url);
      const data = await res.json();
      setHistorial(data);
      setMostrarHistorial(true);
    } catch (err) {
      console.error("Error al obtener historial:", err);
    }
  };

  const registrarBusqueda = async () => {
    if (!textoBusqueda.trim()) return;
    try {
      await fetch("https://copia-backend.vercel.app/api/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId, termino: textoBusqueda }),
      });
      fetchHistorial();
    } catch (err) {
      console.error("Error al registrar búsqueda:", err);
    }
  };

  const eliminarBusquedaVisual = (termino: string) => {
    setHistorial((prev) => prev.filter((b) => b.termino !== termino));
  };

  const limpiarHistorialVisual = () => {
    setHistorial([]);
  };

  useEffect(() => {
  const fetchHistorial = async () => {
    try {
      const url = textoBusqueda.trim()
        ? `https://copia-backend.vercel.app/api/autocompletar?usuarioId=${usuarioId}&texto=${textoBusqueda}`
        : `https://copia-backend.vercel.app/api/ultimas?usuarioId=${usuarioId}`;
      const res = await fetch(url);
      const data = await res.json();
      setHistorial(data);
      setMostrarHistorial(true);
    } catch (err) {
      console.error("Error al obtener historial:", err);
    }
  };

  fetchHistorial();
}, [textoBusqueda]);

  // Cerrar historial si se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refBuscador.current && !refBuscador.current.contains(event.target as Node)) {
        setMostrarHistorial(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={refBuscador} className="relative flex-1 w-full max-w-md">
      <input
        type="text"
        placeholder="Buscar vehículos..."
        value={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-black rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FCA311] focus:border-transparent text-gray-700"
        onFocus={() => setMostrarHistorial(true)} // mostrar historial al enfocar
      />
      <button
        type="button"
        onClick={() => setTextoBusqueda("")}
        className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-black"
      >
        <IoClose className="h-5 w-5" />
      </button>
      <div className="absolute inset-y-0 left-2 flex items-center">
        <button
          type="button"
          onClick={registrarBusqueda}
          className="bg-[#FCA311] hover:bg-[#e6950e] transition-colors rounded-full h-8 w-8 flex items-center justify-center focus:outline-none"
        >
          <FiSearch className="h-5 w-5 text-white" />
        </button>
      </div>

      {mostrarHistorial && historial.length > 0 && (
        <div className="absolute z-50 top-full left-0 w-full bg-white border border-gray-200 shadow-lg rounded-lg mt-1">
          {historial.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-sm text-gray-700 truncate"
            >
              <div
                className="flex items-center gap-2 truncate cursor-pointer w-full"
                onClick={() => {
                  setTextoBusqueda(item.termino);
                  setMostrarHistorial(false);
                }}
              >
                <AiOutlineClockCircle className="text-gray-500 flex-shrink-0" />
                <span className="truncate">{item.termino}</span>
              </div>
              <button
                onClick={() => eliminarBusquedaVisual(item.termino)}
                className="text-gray-400 hover:text-red-600 ml-2 flex-shrink-0"
              >
                <IoClose className="h-4 w-4" />
              </button>
            </div>
          ))}
          <div
            onClick={limpiarHistorialVisual}
            className="text-center py-2 text-sm text-[#FCA311] font-semibold cursor-pointer hover:underline"
          >
            Eliminar historial de búsqueda
          </div>
        </div>
      )}
    </div>
  );
}
