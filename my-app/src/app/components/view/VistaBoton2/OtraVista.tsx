import { useState } from "react";
import MapaGPS from "@/app/components/mapa/mapaGps";
import BotonConfirm from "@/app/components/botons/botonConfirm";
import PanelResultados from "@/app/components/mapa/resVehiculos";
export default function OtraVista() {
  const [lat, setLat] = useState(-17.7833); // por ejemplo, La Paz, Bolivia
  const [lng, setLng] = useState(-63.1833); // por ejemplo, Santa Cruz, Bolivia
  const [, setEstadoUbicacion] = useState<"nulo" | "actual" | "personalizada" | "aeropuerto">("nulo");
  
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [vehiculos] = useState<[]>([]);

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
        <div className="mt-5 w-full">
          <BotonConfirm texto="Ver más" ruta="/home/homePage/mapaGps" />
        </div>
      </div>
      {/*integrar la parte de lista de autos quantastic*/}
      <div className="bg-amber-400 w-full pr-60 pl-5">
        <div className="">
          <PanelResultados 
            textoBusqueda={textoBusqueda} 
            setTextoBusqueda={setTextoBusqueda} 
            vehiculos={vehiculos} 
          />
        </div>
        <div className="">

        </div>
      </div>
    </div>
  );
}