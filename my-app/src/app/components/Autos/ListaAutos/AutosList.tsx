"use client"

import { useEffect, useState } from "react"
import type { Auto } from "@/app/types/auto"
import { AutoCard } from "./AutoCard"

interface AutosListProps {
  autos: Auto[];
  promediosPorAuto: { [key: number]: number };
  initialLoadCount?: number;
  loadMoreCount?: number;
}

export const AutosList = ({ 
  autos, 
  promediosPorAuto, 
  initialLoadCount = 8, 
  loadMoreCount = 4 
}: AutosListProps) => {
  const [imagesToLoad, setImagesToLoad] = useState(initialLoadCount)

  useEffect(() => {
    if (!autos.length) return
    
    const observer = new IntersectionObserver(
      (entries) => {
        const lastEntry = entries[0]
        if (lastEntry.isIntersecting && autos.length > imagesToLoad) {
          setImagesToLoad(prev => prev + loadMoreCount)
        }
      },
      { threshold: 0.1 }
    )
    
    const lastCardElement = document.getElementById('last-visible-card')
    if (lastCardElement) {
      observer.observe(lastCardElement)
    }
    
    return () => {
      if (lastCardElement) observer.unobserve(lastCardElement)
    }
  }, [autos, imagesToLoad, loadMoreCount])

  useEffect(() => {
    setImagesToLoad(initialLoadCount)
  }, [autos, initialLoadCount])

  const obtenerPromedioCalculado = (auto: Auto): number => {
    return promediosPorAuto[auto.idAuto] ?? (auto.calificacionPromedio ?? 0)
  }

  if (autos.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-10">
        No se encontraron resultados
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
      {autos.slice(0, imagesToLoad).map((auto: Auto, index: number) => {
        const promedioCalculado = obtenerPromedioCalculado(auto)
        
        return (
          <AutoCard
            key={auto.idAuto}
            auto={auto}
            promedio={promedioCalculado}
            index={index}
            priority={index < 2}
            isLastVisible={index === imagesToLoad - 1}
          />
        )
      })}
    </div>
  )
}