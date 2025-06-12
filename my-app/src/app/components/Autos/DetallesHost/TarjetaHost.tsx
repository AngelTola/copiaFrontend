'use client';

import Image from 'next/image';
import { CalificacionUsuario } from '@/app/types/auto';
import { useMemo } from 'react';

interface TarjetaHostProps {
  comentarios?: CalificacionUsuario[];
  nombre: string;
}

export default function TarjetaHost({ 
  comentarios = [], 
  nombre = 'Nombre',
}: TarjetaHostProps) {
  const { promedioCalificacion, totalReseñas } = useMemo(() => {
    const comentariosValidos = comentarios.filter(c => 
      c.puntuacion && 
      c.puntuacion >= 1 && 
      c.puntuacion <= 5 && 
      (c.comentario?.trim() ?? '').length > 0
    );

    const promedio = comentariosValidos.length > 0
      ? comentariosValidos.reduce((acc, c) => acc + (c.puntuacion || 0), 0) / comentariosValidos.length
      : 0;

    return {
      promedioCalificacion: parseFloat(promedio.toFixed(1)),
      totalReseñas: comentariosValidos.length
    };
  }, [comentarios]);

  return (
    <div className="bg-white rounded-2xl border border-black p-5 w-full max-w-[320px] h-[180px] shadow-sm flex justify-between items-center mx-auto md:mx-0">
      {/* Sección del host */}
      <div className="flex flex-col items-center">
        <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center bg-white">
          <Image
            src="/imagenesIconos/usuario.png"
            alt="Host"
            width={48}
            height={48}
            className="w-18 h-18"
            unoptimized
          />
        </div>
        <p className="text-lg font-semibold text-gray-900 text-center mt-2 leading-5">
          {nombre}<br />
        </p>
      </div>

      {/* Calificación y reseñas */}
      <div className="text-right">
        <div className="flex items-center justify-end gap-1">
          <span className="text-xl font-semibold text-black">
            {promedioCalificacion || '0'}
          </span>
          <span className="text-lg text-[#fca311]">★</span>
        </div>
        <p className="text-base text-gray-500">Calificación</p>
        
        <div className="border-t mt-3 pt-1">
          <span className="text-xl font-semibold text-black">{totalReseñas}</span>
          <p className="text-base text-gray-500">Reseñas</p>
        </div>
      </div>
    </div>
  );
}