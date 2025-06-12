"use client";
import { useState } from "react";
import BotonConfirm from "@/app/components/botons/botonConfirm";
import BuscadorInput from "@/app/components/input/BuscadorInput";
import dynamic from "next/dynamic";
import { FaSearch } from "react-icons/fa";
const MapaGPS = dynamic(() => import('@/app/components/mapa/mapaGps'), { ssr: false });
//import { IoCloseSharp } from "react-icons/io5";
export default function OtraVista() {
  
  const [lat, setLat] = useState(-17.7833); // por ejemplo, La Paz, Bolivia
  const [lng, setLng] = useState(-63.1833); // por ejemplo, Santa Cruz, Bolivia
  const [, setEstadoUbicacion] = useState<"nulo" | "actual" | "personalizada" | "aeropuerto">("nulo");
  const [textoBusqueda, setTextoBusqueda] = useState("");
  return (
    <div className="text-2xl text-center text-[var(--azul-oscuro)] font-bold  h-160 flex justify-center w-full">
      <div className=" w-full flex flex-col justify-center items-center pr-5 pl-60">
        <div className=" w-full h-full border-2">
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
      <div className=" w-full pr-60 pl-5 flex flex-col">
        <div className="w-full h-auto mb-5">
          <BuscadorInput
            value={textoBusqueda}
            onChange={setTextoBusqueda}
            placeholder="Buscar vehículos"
            leftIcon={<FaSearch className="w-5 h-5 text-[var(--azul-oscuro)]" />}
            //rightIcon={<IoCloseSharp className="w-5 h-5 text-[var(--azul-oscuro)] cursor-pointer" />}
            onClear={() => console.log("Se limpió el input")}
            onEnter={() => console.log("Se presionó Enter")}
          />
        </div>
        <div className="">
          lista de autos
        </div>
        
      </div>
    </div>
  );
}