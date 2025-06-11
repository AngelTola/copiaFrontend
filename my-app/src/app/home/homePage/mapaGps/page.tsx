"use client";

import dynamic from "next/dynamic";

// OJO: nombre exacto del archivo
const MapaConFiltrosEstaticos = dynamic(() => import('@/app/home/homePage/mapaGps/MapasGps'), { ssr: false });

export default function PageMapaGps() {
  return (
    <div className="w-full h-screen">
      <MapaConFiltrosEstaticos />
    </div>
  );
}
