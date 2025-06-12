// src/components/Auto/AutoCard.tsx
import Image from 'next/image';
import { Auto } from '@/app/types/auto';
import Link from 'next/link';
import Caracteristicas from './Caracteristicas';
import Estrellas from './Estrellas';

export default function AutoCard({ auto }: { auto: Auto }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Imagen */}
        <div className="relative w-full md:w-[350px] h-[250px] bg-[#d9d9d9] rounded-lg flex-shrink-0 flex items-center justify-center">
          {auto.imagenes?.[0]?.direccionImagen ? (
            <Image
              src={auto.imagenes[0].direccionImagen}
              alt={`Imagen de ${auto.marca} ${auto.modelo}`}
              fill
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
              Sin imagen
            </div>
          )}

          {/* Promedio y estrellas */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white/90 px-3 py-1 rounded-full shadow-md flex items-center gap-1">
            <span className="text-sm font-medium text-black">
              {(auto.calificacionPromedio ?? 0).toFixed(1)}
            </span>
            <Estrellas promedio={auto.calificacionPromedio ?? 0} />
          </div>
        </div>

        {/* Detalles */}
        <div className="flex-1 min-w-0">
          <h2 className="text-[#11295B] text-xl font-bold mb-4">
            {auto.marca} - {auto.modelo}
          </h2>
          <Caracteristicas auto={auto} />
        </div>
      </div>

      {/* Botón */}
      <div className="flex justify-end mt-3">
        <Link
          href={`/detalleCoche/${auto.idAuto}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2.5 px-4 py-2 bg-[#FCA311] text-white no-underline rounded-lg font-bold transition-colors duration-300 ease-in-out hover:bg-[#e4920b]"
        >
          Ver detalles
        </Link>
      </div>
    </div>
  );
}