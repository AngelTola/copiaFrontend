"use client";
import { useState } from "react";
import BotonConfirm from "@/app/components/botons/botonConfirm";
import dynamic from "next/dynamic";
const MapaGPS = dynamic(() => import('@/app/components/mapa/mapaGps'), { ssr: false });
import { AutosBrowser } from "../../Autos/ListaAutos/AutosBrowser";
//import { IoCloseSharp } from "react-icons/io5";
export default function OtraVista() {
  
  const [lat, setLat] = useState(-17.7833); // por ejemplo, La Paz, Bolivia
  const [lng, setLng] = useState(-63.1833); // por ejemplo, Santa Cruz, Bolivia
  const [, setEstadoUbicacion] = useState<"nulo" | "actual" | "personalizada" | "aeropuerto">("nulo");
  return (
    <div className="text-2xl text-center text-[var(--azul-oscuro)] font-bold  h-auto flex justify-center w-full">
      <div className=" w-full flex flex-col justify-center items-center pr-5 pl-60">
        <div className=" w-full h-130 border-2">
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
        <div className="mt-5 w-full h-auto">
          <BotonConfirm texto="Ver más" ruta="/home/homePage/mapaGps" />
        </div>
      </div>
      {/*integrar la parte de lista de autos quantastic*/}
      <div className=" w-full h-auto pr-60 pl-5 flex flex-col">
        <div className="">
          <AutosBrowser />
        </div>
      </div>
    </div>
  );
}