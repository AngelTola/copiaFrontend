import MapaConFiltrosEstaticos from "@/app/components/mapa/mapas";
export default function OtraVista() {
  return (
    <div className="text-2xl text-center text-[var(--azul-oscuro)] font-bold bg-amber-500 h-160 flex justify-center w-full">
      <div className="bg-amber-300 w-full">
        hola
        <MapaConFiltrosEstaticos />
      </div>
      <div className="bg-amber-400 w-full">
        hola
      </div>
    </div>
  );
}