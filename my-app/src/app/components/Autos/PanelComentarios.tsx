'use client';
import { Comentario } from '@/app/types/auto';
import Image from 'next/image';

import { useEffect, useRef, useState } from 'react';

interface PanelComentariosProps {
  mostrar: boolean;
  onClose: () => void;
  comentarios: Comentario[];
  marca: string;
  modelo: string;
}

export default function PanelComentarios({ mostrar, onClose, comentarios, marca, modelo }: PanelComentariosProps) {
  const [comentariosExpandidos, setComentariosExpandidos] = useState<Record<number, boolean>>({});
  const refsComentarios = useRef<Record<number, HTMLParagraphElement | null>>({});
  const [comentariosConOverflow, setComentariosConOverflow] = useState<Record<number, boolean>>({});
  const comentariosValidos = comentarios.filter(
    c => c.calificacion > 0 && c.contenido?.trim() !== ''
  );
  
  const promedioCalificacion = comentariosValidos.length
  ? parseFloat(
      (
        comentariosValidos.reduce((acc, c) => acc + c.calificacion, 0) /
        comentariosValidos.length
      ).toFixed(1)
    )
  : 0;

  const criterioTexto =
  promedioCalificacion >= 4.5
    ? 'Muy bueno'
    : promedioCalificacion >= 3.5
    ? 'Bueno'
    : promedioCalificacion >= 2.5
    ? 'Regular'
    : promedioCalificacion >= 1.5
    ? 'Malo'
    : 'Sin calificación';

    const distribucionEstrellas = (() => {
      const conteo = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      comentariosValidos.forEach(
        (c) => (conteo[c.calificacion as 1 | 2 | 3 | 4 | 5] += 1)
      );
      const total = comentariosValidos.length;
      const porcentajes = Object.fromEntries(
        Object.entries(conteo).map(([estrella, cantidad]) => [
          estrella,
          total ? Math.round((cantidad / total) * 100) : 0,
        ])
      );
      return { conteo, porcentajes };
    })();
    
    useEffect(() => {
      let mounted = false
      if (typeof window !== 'undefined') mounted = true
    
      if (!mounted) return
    
      if (mostrar) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    
      return () => {
        document.body.style.overflow = ''
      }
    }, [mostrar])
    

    useEffect(() => {
      const observers: ResizeObserver[] = [];
      comentariosValidos.forEach((comentario) => {
        const el = refsComentarios.current[comentario.idComentario];
        if (el) {
          const observer = new ResizeObserver(() => {
            // Estimar el alto de 3 líneas con estilo base (~1.5em x 3)
            const lineaEstimada = parseFloat(getComputedStyle(el).lineHeight || '20');
            const limite = lineaEstimada * 3;
    
            const isOverflowing = el.scrollHeight > limite + 2;
            setComentariosConOverflow((prev) => ({
              ...prev,
              [comentario.idComentario]: isOverflowing,
            }));
          });
    
          observer.observe(el);
          observers.push(observer);
        }
      });
    
      return () => { observers.forEach((o) => o.disconnect()); };
    }, [comentariosValidos]);
    
      const toggleExpansion = (id: number) =>
        setComentariosExpandidos(prev => ({ ...prev, [id]: !prev[id] }));
      const renderEstrellasConMedia = (promedio: number) => {
        const estrellas = [];
        for (let i = 1; i <= 5; i++) {
          if (promedio >= i) {
            estrellas.push(<span key={i}>★</span>);
          } else if (promedio >= i - 0.5) {
            estrellas.push(
              <span
                key={i}
                className="relative inline-block w-[1em]"
              >
                <span className="absolute w-[44%] overflow-hidden text-[#fca311]">★</span>
                <span className="text-[#e0e0e0]">★</span>
              </span>
            );
          } else {
            estrellas.push(<span key={i}>☆</span>);
          }
        }
        return estrellas;
      };      
  return (
    <>
      {mostrar && <div className="fixed inset-0 bg-black/50 z-[999]" onClick={onClose} />}
      
      <div className={`fixed top-0 right-0 h-screen w-full sm:w-[90%] md:w-[600px] bg-white p-4 z-[1000] overflow-y-auto border-[6px] border-black rounded-tl-2xl rounded-bl-2xl shadow-lg transition-transform duration-300 ${mostrar ? 'translate-x-0' : 'translate-x-full'}`}>
      <button
        className="absolute top-2 right-4 bg-[#fca311] text-white text-lg px-3 py-1 rounded border border-black hover:bg-[#e69500] active:bg-[#cc8400]"
        onClick={onClose}
      >
        ✕
      </button>

        <h2 className="text-2xl font-bold text-black mb-2">{marca} - {modelo}</h2>
        <hr className="border-t-4 border-black mb-3" />
        
        <div className="flex gap-4 items-center mb-4">
          <div className="bg-[#002a5c] text-white text-xl p-2 rounded w-12 text-center">
            {promedioCalificacion.toFixed(1)}
          </div>
          <div className="flex flex-col">
          <div className="flex items-center gap-3">
          <div className="text-[#fca311] text-2xl leading-none flex gap-1">
            {renderEstrellasConMedia(promedioCalificacion)}
          </div>

            <div className="flex flex-col leading-tight">
              <span className="font-bold text-black">{criterioTexto}</span>
              <span className="text-sm text-gray-500">{comentariosValidos.length} en total</span>
            </div>
          </div>

          </div>
        </div>

        {([5, 4, 3, 2, 1] as const).map((estrella) => (
          <div key={estrella} className="flex items-center gap-2 mb-1">
            <div className="bg-[#002a5c] text-white w-8 h-8 flex items-center justify-center rounded">{estrella}</div>
            <div className="flex-1 h-3 bg-gray-200 rounded">
              <div
                className="h-3 bg-[#002a5c] rounded"
                style={{ width: `${distribucionEstrellas.porcentajes[estrella]}%` }}
              />
            </div>
            <span className="text-sm text-black">
              {distribucionEstrellas.porcentajes[estrella]}% ({distribucionEstrellas.conteo[estrella]})
            </span>
          </div>
        ))}
        
        <h3 className="text-xl mt-4 mb-2 text-black font-semibold">Comentarios</h3>
        <div className="space-y-4">
        {comentariosValidos.map((comentario) => {
          const fecha = new Date(comentario.fechaCreacion).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          });
          const estaExpandido = comentariosExpandidos[comentario.idComentario] ?? false;
          const mostrarBoton = comentariosConOverflow[comentario.idComentario];
          const estrellasLlenas = Math.floor(comentario.calificacion);
          const estrellasVacias = 5 - estrellasLlenas;

          return (
            <div key={comentario.idComentario} className="border-b border-black pb-3">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-3">
                  <Image src="/imagenesIconos/usuario.png" alt="Usuario" className="w-10 h-10 rounded-full" width={50} height={50} unoptimized />
                  <div>
                    <strong className="text-black font-semibold">{comentario.usuario.nombreCompleto}</strong>
                    <div className="text-sm text-gray-500">{fecha}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                <div className="text-[#fca311] text-2xl leading-none flex gap-1">
                  {[...Array(estrellasLlenas)].map((_, i) => <span key={i}>★</span>)}
                  {[...Array(estrellasVacias)].map((_, i) => <span key={i + estrellasLlenas}>☆</span>)}
                </div>

                  <div className="bg-[#002a5c] text-white text-sm px-2 py-1 rounded font-semibold mt-1">
                    {comentario.calificacion}
                  </div>
                </div>
              </div>
              <p
                ref={(el) => {
                  refsComentarios.current[comentario.idComentario] = el;
                }}
                className={`${!estaExpandido ? 'line-clamp-3' : ''} text-black`}
              >
                {comentario.contenido}
              </p>

              {mostrarBoton && (
                <button
                  onClick={() => toggleExpansion(comentario.idComentario)}
                  className="text-blue-800 hover:underline text-sm mt-1"
                >
                  {estaExpandido ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          );
        })}

        {comentariosValidos.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Sin comentarios</p>
          </div>
        )}

        </div>
      </div>
    </>
  );
}