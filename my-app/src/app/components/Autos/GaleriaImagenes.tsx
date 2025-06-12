'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Auto } from '@/app/types/auto';

interface OptimizedGalleryImageProps {
  src: string;
  alt: string;
  isActive: boolean;
  onLoad: () => void;
}

const OptimizedGalleryImage = ({ src, alt, isActive, onLoad }: OptimizedGalleryImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  const fallbackImage = '/imagenesIconos/default.png';

  useEffect(() => {
    const isValidSrc = typeof src === 'string' && src.trim() !== '';
    if (!isValidSrc) {
      setImgSrc(fallbackImage);
      setHasError(true);
    } else {
      setImgSrc(src);
      setHasError(false);
    }
  }, [src]);

  const handleError = () => {
    if (!hasError && imgSrc !== fallbackImage) {
      console.warn(`Error cargando imagen: ${src}, usando fallback`);
      setImgSrc(fallbackImage);
      setHasError(true);
    }
  };

  const handleLoadComplete = () => {
    setIsLoading(false);
    onLoad();
  };

  // No renderizar si no hay una src válida
  if (!imgSrc || imgSrc.trim() === '') {
    return (
      <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-[20px]">
          <div className="text-gray-500 text-sm">Cargando imagen...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
      {isLoading && isActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 animate-pulse rounded-[20px] z-20">
          <div className="w-12 h-12 border-4 border-[#11295B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        fill
        quality={isActive ? 90 : 60}
        priority={isActive}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 80vw, (max-width: 1024px) 70vw, 60vw"
        style={{
          objectFit: 'cover',
          transition: 'transform 0.3s ease-out',
        }}
        placeholder="blur"
        blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjFmMWYxIi8+PC9zdmc+"
        className={`rounded-[20px] ${
          imgSrc === fallbackImage 
            ? 'opacity-90 scale-75'  // Solo para imagen por defecto
            : isActive 
              ? 'scale-100'          // Para imágenes normales activas
              : 'scale-105'          // Para imágenes normales inactivas
        }`}
        onLoadingComplete={handleLoadComplete}
        onError={handleError}
      />
      {hasError && (
        <div className="absolute top-2 right-2 bg-red-500/80 text-white text-xs px-2 py-1 rounded z-30">
          Imagen no disponible
        </div>
      )}
    </div>
  );
};

export default function GaleriaImagenes({ imagenes, marca, modelo }: Pick<Auto, 'imagenes' | 'marca' | 'modelo'>) {
  const [imagenActual, setImagenActual] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState<string[]>([]);

  const fallbackImage = '/imagenesIconos/default.png';

  useEffect(() => {
    if (!imagenes || imagenes.length === 0) return;

    const getDireccion = (index: number) => {
      const direccion = imagenes[index]?.direccionImagen;
      return typeof direccion === 'string' && direccion.trim() !== '' ? direccion : null;
    };

    const toPreload = [getDireccion(imagenActual), getDireccion((imagenActual + 1) % imagenes.length)]
      .filter((src): src is string => src !== null);

    setPreloadedImages((prev) => [...new Set([...prev, ...toPreload])]);
  }, [imagenes, imagenActual]);

  const siguienteImagen = () => {
    if (isTransitioning || !imagenes || imagenes.length <= 1) return;

    setIsTransitioning(true);
    setImagenActual((prev) => (prev < imagenes.length - 1 ? prev + 1 : 0));

    if (imagenes.length > 2) {
      const nextIndex = (imagenActual + 2) % imagenes.length;
      const direccion = imagenes[nextIndex]?.direccionImagen;
      if (typeof direccion === 'string' && direccion.trim() !== '') {
        setPreloadedImages((prev) => [...new Set([...prev, direccion])]);
      }
    }
  };

  const imagenAnterior = () => {
    if (isTransitioning || !imagenes || imagenes.length <= 1) return;

    setIsTransitioning(true);
    setImagenActual((prev) => (prev > 0 ? prev - 1 : imagenes.length - 1));

    if (imagenes.length > 2) {
      const prevIndex = imagenActual === 0 ? imagenes.length - 2 : (imagenActual - 2 + imagenes.length) % imagenes.length;
      const direccion = imagenes[prevIndex]?.direccionImagen;
      if (typeof direccion === 'string' && direccion.trim() !== '') {
        setPreloadedImages((prev) => [...new Set([...prev, direccion])]);
      }
    }
  };

  const handleImageLoad = () => {
    setIsTransitioning(false);
  };

  if (!imagenes || imagenes.length === 0) {
    return (
      <div className="relative mx-auto w-[100%] sm:w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] border border-black rounded-[20px] overflow-hidden">
        <Image
          src={fallbackImage}
          alt={`Imagen por defecto para ${marca} ${modelo}`}
          fill
          quality={90}
          style={{ objectFit: 'cover',
                   transition: 'transform 0.3s ease-out',
          }}
          className="rounded-[20px] opacity-70 scale-75"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[20px]">
          <div className="text-center text-gray-600">
            <div className="text-lg font-semibold">Sin imágenes</div>
            <div className="text-sm">No hay imágenes disponibles</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-[100%] sm:w-full h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] border border-black rounded-[20px] overflow-hidden">
      <button
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center cursor-pointer text-[24px] sm:text-[32px] text-black z-50 transition-colors"
        onClick={imagenAnterior}
        disabled={isTransitioning || imagenes.length <= 1}
        aria-label="Imagen anterior"
      >
        {'<'}
      </button>

      <div className="relative w-full h-full">
        {imagenes.map((imagen, index) => (
          <OptimizedGalleryImage
            key={imagen.idImagen}
            src={imagen?.direccionImagen || ''}
            alt={`Imagen ${index + 1} del auto ${marca} ${modelo}`}
            isActive={index === imagenActual}
            onLoad={handleImageLoad}
          />
        ))}
      </div>

      <button
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-white/60 hover:bg-white/80 rounded-full flex items-center justify-center cursor-pointer text-[24px] sm:text-[32px] text-black z-50 transition-colors"
        onClick={siguienteImagen}
        disabled={isTransitioning || imagenes.length <= 1}
        aria-label="Imagen siguiente"
      >
        {'>'}
      </button>

      {imagenes.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-50">
          {imagenes.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === imagenActual ? 'bg-[#11295B] w-4' : 'bg-white/70'
              }`}
              onClick={() => {
                if (!isTransitioning) {
                  setIsTransitioning(true);
                  setImagenActual(index);
                }
              }}
              aria-label={`Ver imagen ${index + 1}`}
            />
          ))}
        </div>
      )}

      <div className="hidden">
        {preloadedImages
          .filter(src => src && src.trim() !== '') // Filtrar src vacías
          .map((src, idx) => (
            <Image
              key={`preload-${idx}`}
              src={src}
              alt="Precarga"
              width={1}
              height={1}
              loading="eager"
              priority={false}
            />
          ))
        }
      </div>
    </div>
  );
}