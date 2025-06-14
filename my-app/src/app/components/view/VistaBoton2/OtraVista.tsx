"use client";

import { useState, useRef, useEffect } from "react";
import BotonConfirm from "@/app/components/botons/botonConfirm";
import dynamic from "next/dynamic";

const MapaGPS = dynamic(() => import('@/app/components/mapa/mapaGps'), { ssr: false });
import AutosPage from "../../Autos/ListaAutos/AutosPage"

interface OtraVistaProps {
  onSetBuscarCallback?: (callback: (fechaInicio: string, fechaFin: string) => void) => void;
}

export default function OtraVista({ onSetBuscarCallback }: OtraVistaProps) {
  const [lat, setLat] = useState(-17.7833); // por ejemplo, La Paz, Bolivia
  const [lng, setLng] = useState(-63.1833); // por ejemplo, Santa Cruz, Bolivia
  const [, setEstadoUbicacion] = useState<"nulo" | "actual" | "personalizada" | "aeropuerto">("nulo");
  
  // Ref para almacenar la función de búsqueda del AutosBrowser
  const buscarAutosRef = useRef<((fechaInicio: string, fechaFin: string) => void) | null>(null);

  // Función que se ejecutará cuando FiltersBar haga búsqueda
  const handleBuscarDisponibilidad = (fechaInicio: string, fechaFin: string) => {
    console.log('Búsqueda en OtraVista:', { fechaInicio, fechaFin });
    
    // Llamar a la función de búsqueda del AutosBrowser
    if (buscarAutosRef.current) {
      buscarAutosRef.current(fechaInicio, fechaFin);
    }
  };

  // Función para registrar el callback del AutosBrowser
  const setBuscarAutosCallback = (callback: (fechaInicio: string, fechaFin: string) => void) => {
    buscarAutosRef.current = callback;
  };

  // Registrar la función de búsqueda con el componente padre
  useEffect(() => {
    if (onSetBuscarCallback) {
      onSetBuscarCallback(handleBuscarDisponibilidad);
    }
  }, [onSetBuscarCallback]);

  return (
    <div className="text-2xl text-center text-[var(--azul-oscuro)] font-bold flex h-screen w-full">
      {/* Contenedor del mapa - Fijo a la izquierda */}
      <div className="w-100 h-full flex flex-col justify-center items-center p-5 bg-gray-50">
        <div className="w-100 h-100 border-2">
          <MapaGPS
            lat={lat}
            lng={lng}
            selectedDistance={5}
            vehiculos={[]} // Por ahora vacío
            setLat={setLat}
            setLng={setLng}
            setEstadoUbicacion={setEstadoUbicacion}
            cerrarTodosLosPaneles={() => {}}
            setResultadosAeropuerto={() => {}}
            setAutoReservado={() => {}}
            setMostrarMensaje={() => {}}
          />
        </div>
        <div className="mt-5 w-100">
          <BotonConfirm texto="Ver más" ruta="/home/homePage/mapaGps" />
        </div>
      </div>

      {/* Contenedor de la lista de autos - SIN overflow, altura fija */}
      <div className="w-full h-full flex flex-col p-5">
        <AutosPage 
          showFiltersBar={false} // No mostrar FiltersBar aquí
          onSetBuscarCallback={setBuscarAutosCallback} // Pasar la función para registrar callback
          className="min-h-0 bg-transparent h-full" // Añadir h-full para que ocupe toda la altura
        />
      </div>
    </div>
  );
}