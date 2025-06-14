import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Estrellas from "@/app/components/Autos/Estrellas";

interface Imagen {
  idImagen: number;
  direccionImagen: string;
}

interface AutoConDisponibilidad {
  idAuto: number;
  modelo: string;
  marca: string;
  precio: string;
  calificacionPromedio?: number | null;
  disponible: boolean;
  imagenes?: Imagen[];
}

interface Props {
  autos: AutoConDisponibilidad[];
}

const OptimizedImage = ({
  src,
  alt,
  priority = false,
  className = "",
  sizes = "100vw"
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const placeholderSrc = "/placeholder.svg";

  return (
    <div className="relative w-full h-48 bg-gray-100 rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse rounded-lg">
          <span className="sr-only">Cargando...</span>
        </div>
      )}
      <Image
        src={src || placeholderSrc}
        alt={alt}
        fill
        sizes={sizes}
        quality={85}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,..."
        className={`object-cover transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};

export default function AutosDelHost({ autos }: Props) {
  // Estado local para almacenar links con query params, solo en cliente
  const [links, setLinks] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (typeof window !== "undefined") {
      const reservaData = localStorage.getItem("reservaData");
      const nuevosLinks: { [key: number]: string } = {};

      autos.forEach((auto) => {
        let linkDetalle = `/detalleCoche/${auto.idAuto}`;
        if (reservaData) {
          try {
            const { pickupDate, pickupTime, returnDate, returnTime } = JSON.parse(reservaData);
            if (pickupDate && pickupTime && returnDate && returnTime) {
              const inicioISO = new Date(pickupDate).toISOString();
              const finISO = new Date(returnDate).toISOString();
              linkDetalle += `?inicio=${encodeURIComponent(inicioISO)}&fin=${encodeURIComponent(finISO)}`;
            }
          } catch (error) {
            console.warn("Error al parsear reservaData:", error);
          }
        }
        nuevosLinks[auto.idAuto] = linkDetalle;
      });

      setLinks(nuevosLinks);
    }
  }, [autos]);

  if (autos.length === 0) {
    return <p className="text-gray-500">El host no tiene autos disponibles.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {autos.map((auto, index) => {
        const imageSrc =
          auto.imagenes && auto.imagenes.length > 0
            ? auto.imagenes[0].direccionImagen.startsWith('/imagenesAutos')
              ? auto.imagenes[0].direccionImagen
              : `/imagenesAutos/${auto.marca}/${auto.imagenes[0].direccionImagen}`
            : "";

        return (
          <div
            key={auto.idAuto}
            className="bg-white shadow-md p-4 rounded-lg flex flex-col"
          >
            <div className="w-full h-48 bg-gray-100 rounded-lg relative">
              {imageSrc ? (
                <OptimizedImage
                  src={imageSrc}
                  alt={`${auto.marca} ${auto.modelo}`}
                  priority={index < 2}
                  sizes="(max-width: 768px) 100vw, 400px"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                  Sin imagen
                </div>
              )}
            </div>

            <h3 className="text-base font-bold text-[#11295b] mt-4">
              {auto.modelo} - {auto.marca}
            </h3>

            <div className="text-sm text-[#292929] font-semibold mt-1 flex items-center gap-2">
              <span>{(auto.calificacionPromedio ?? 0).toFixed(1)}</span>
              <Estrellas promedio={auto.calificacionPromedio ?? 0} />
            </div>

            <div className="flex justify-between items-center mt-2">
              <div>
                <p className="text-[13px] text-gray-500">Precio por día</p>
                <p className="text-lg font-bold text-[#11295b]">{auto.precio} BOB</p>
              </div>

              {/* Si el link aun no está calculado en cliente, muestra enlace simple sin query */}
              <Link
                href={links[auto.idAuto] || `/detalleCoche/${auto.idAuto}`}
                className="bg-[#fca311] hover:bg-[#e4920b] text-white px-4 py-2 rounded text-sm font-bold"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}