"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface OptimizedImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export const OptimizedImage = ({ 
  src, 
  alt,
  priority = false,
  className = "",
  sizes = "100vw"
}: OptimizedImageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isValidImage, setIsValidImage] = useState(false)
  
  const fallbackImage = "/imagenesIconos/default.png"
  
  // Función para validar si es una URL de imagen válida
  const isValidImageUrl = (url: string): boolean => {
    if (!url || url.trim() === "") return false
    
    // Extensiones de imagen soportadas
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico|tiff)(\?.*)?$/i
    
    // Verificar si la URL tiene una extensión de imagen válida
    const hasValidExtension = imageExtensions.test(url)
    
    // También verificar si es una URL válida
    try {
      const urlObj = new URL(url, window.location.origin)
      return hasValidExtension && (urlObj.protocol === 'http:' || urlObj.protocol === 'https:' || urlObj.protocol === 'data:')
    } catch {
      // Si falla la creación de URL, verificar si es una ruta relativa válida
      return hasValidExtension && (url.startsWith('/') || url.startsWith('./') || url.startsWith('../') || !url.includes('://'))
    }
  }
  
  // Función para verificar si la imagen se puede cargar
  const checkImageValidity = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      
      img.onload = () => {
        resolve(true)
      }
      
      img.onerror = () => {
        console.log(`Error verificando imagen: ${url}`)
        resolve(false)
      }
      
      // Timeout de 10 segundos para evitar carga infinita
      setTimeout(() => {
        resolve(false)
      }, 10000)
      
      img.src = url
    })
  }
  
  const [imgSrc, setImgSrc] = useState(() => {
    const initialSrc = src && src.trim() !== "" ? src : fallbackImage
    return initialSrc
  })
  
  const handleError = () => {
    console.log(`Error cargando imagen: ${imgSrc}`)
    if (imgSrc !== fallbackImage) {
      setHasError(true)
      setImgSrc(fallbackImage)
      setIsLoading(false)
    }
  }
  
  const handleLoadComplete = () => {
    setIsLoading(false)
    setHasError(false)
  }
  
  // Effect para validar y actualizar la imagen cuando cambia el src
  useEffect(() => {
    const validateAndSetImage = async () => {
      // Reset states
      setIsLoading(true)
      setHasError(false)
      setIsValidImage(false)
      
      // Si no hay src, usar fallback
      if (!src || src.trim() === "") {
        setImgSrc(fallbackImage)
        setIsValidImage(false)
        return
      }
      
      // Verificar si la URL tiene formato de imagen válido
      if (!isValidImageUrl(src)) {
        console.log(`URL no es una imagen válida: ${src}`)
        setImgSrc(fallbackImage)
        setHasError(true)
        setIsValidImage(false)
        return
      }
      
      // Verificar si la imagen se puede cargar
      const canLoad = await checkImageValidity(src)
      
      if (canLoad) {
        setImgSrc(src)
        setIsValidImage(true)
      } else {
        console.log(`Imagen no se puede cargar: ${src}`)
        setImgSrc(fallbackImage)
        setHasError(true)
        setIsValidImage(false)
      }
    }
    
    validateAndSetImage()
  }, [src, fallbackImage])

  // Si no hay imagen válida, mostrar placeholder
  if (!imgSrc || imgSrc.trim() === "") {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 text-2xl mb-2"></div>
            <span className="text-gray-500 text-sm">Sin imagen</span>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative w-full h-full">
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin text-gray-400 text-2xl mb-2">⏳</div>
            <span className="sr-only">Cargando imagen...</span>
          </div>
        </div>
      )}
      
      <Image
        src={imgSrc}
        alt={alt}
        fill
        sizes={sizes}
        quality={85}
        priority={priority}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
        className={`rounded-lg object-cover transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${
          imgSrc === fallbackImage ? 'scale-75 opacity-60' : ''
        } ${className}`}
        onLoad={handleLoadComplete}
        onError={handleError}
        unoptimized={!isValidImage} // Para imágenes externas o problemáticas
      />
      
      {/* Indicador de error */}
      {hasError && imgSrc === fallbackImage && (
        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded z-20">
          ❌ Imagen no disponible
        </div>
      )}
    </div>
  )
}