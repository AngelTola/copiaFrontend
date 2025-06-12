"use client"

import Image from "next/image"
import Link from "next/link"
import type { Auto } from "@/app/types/auto"
import { OptimizedImage } from "./OptimizedImage"
import Estrellas from "@/app/components/Autos/Estrellas"

interface AutoCardProps {
  auto: Auto;
  promedio: number;
  index: number;
  priority?: boolean;
  isLastVisible?: boolean;
}

export const AutoCard = ({ 
  auto, 
  promedio,
  priority = false, 
  isLastVisible = false 
}: AutoCardProps) => {
  const caracteristicas = [
    {
      icon: "/imagenesIconos/usuario.png",
      label: "Capacidad",
      value: `${auto.asientos} personas`,
    },
    {
      icon: "/imagenesIconos/cajaDeCambios.png",
      label: "Transmisión",
      value: auto.transmision,
    },
    {
      icon: "/imagenesIconos/maleta.png",
      label: "Maletero",
      value: `${auto.capacidadMaletero} equipaje/s`,
    },
    {
      icon: "/imagenesIconos/velocimetro.png",
      label: "Kilometraje",
      value: `${auto.kilometraje} km`,
    },
    {
      icon: "/imagenesIconos/gasolinera.png",
      label: "Combustible",
      value: auto.combustible,
    },
  ]

  return (
    <div
      id={isLastVisible ? 'last-visible-card' : undefined}
      className="bg-white rounded-lg p-4 shadow-md transition-transform duration-200 ease-in-out hover:translate-y-[-5px] hover:shadow-lg"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Contenedor de imagen y estrellas */}
        <div className="flex flex-col w-full md:w-[350px] flex-shrink-0">
          {/* Imagen */}
          <div className="relative w-full h-[250px] bg-[#f1f1f1] rounded-lg">
            <OptimizedImage
              src={auto.imagenes?.[0]?.direccionImagen || ""}
              alt={`${auto.marca} ${auto.modelo}`}
              priority={priority}
              sizes="(max-width: 768px) 100vw, 350px"
            />
          </div>

          {/* Promedio y estrellas */}
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center gap-8">
              <span className="bg-[#11295B] text-white text-base font-bold px-3 py-1 rounded-md min-w-[48px] text-center">
                {promedio.toFixed(1)}
              </span>
              <div className="scale-150">
                <Estrellas promedio={promedio} />
              </div>
            </div>
          </div>
        </div>

        {/* Detalles + Precio y Botón */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="bg-white p-5 w-full h-full flex flex-col justify-between">
            <h2 className="text-[#11295B] text-xl font-bold mb-4">
              {auto.marca} - {auto.modelo}
            </h2>

            {/* Características - Versión móvil (2 columnas) */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 mb-4 sm:hidden">
              {caracteristicas.map(({ icon, label, value }, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Image
                    src={icon || "/placeholder.svg"}
                    alt={label}
                    width={30}
                    height={30}
                    className="w-[30px] h-[30px]"
                    loading="lazy"
                  />
                  <div className="flex flex-col">
                    <span className="font-bold text-[14px] text-black whitespace-nowrap">
                      {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                    </span>
                    <span className="text-[12px] text-[#292929]">{label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Características - Versión original para tablets y desktop */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-y-6 sm:gap-x-4 lg:gap-x-30 mb-4">
              {/* Columna 1 */}
              <div className="flex flex-col gap-5">
                {caracteristicas.slice(0, 3).map(({ icon, label, value }, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Image
                      src={icon || "/placeholder.svg"}
                      alt={label}
                      width={50}
                      height={50}
                      className="w-[50px] h-[50px]"
                      loading="lazy"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[16px] text-black whitespace-nowrap">
                        {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                      </span>
                      <span className="text-[14px] text-[#292929]">{label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna 2 */}
              <div className="flex flex-col gap-5">
                {caracteristicas.slice(3, 5).map(({ icon, label, value }, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <Image
                      src={icon || "/placeholder.svg"}
                      alt={label}
                      width={50}
                      height={50}
                      className="w-[50px] h-[50px]"
                      loading="lazy"
                    />
                    <div className="flex flex-col">
                      <span className="font-bold text-[16px] text-black whitespace-nowrap">
                        {value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()}
                      </span>
                      <span className="text-[14px] text-[#292929]">{label}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Columna 3 - Vacía para layout */}
              <div className="hidden lg:block"></div>
            </div>

            {/* Precio y botón */}
            <div className="flex flex-row justify-between items-center mt-2 sm:mt-4">
              <div className="text-left">
                <p className="text-sm text-gray-600">Precio por día</p>
                <p className="text-lg font-semibold text-[#11295B]">{auto.precioRentaDiario} BOB</p>
              </div>

              <Link
                className="inline-block px-4 py-2 bg-[#FCA311] text-white no-underline rounded-lg font-bold transition-colors duration-300 ease-in-out hover:bg-[#e4920b]"
                href={`/home/detalleCoche/${auto.idAuto}`}
                target="_blank"
              >
                Ver detalles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}