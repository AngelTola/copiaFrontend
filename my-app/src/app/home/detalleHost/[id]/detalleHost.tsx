'use client';

import { useEffect, useState, useRef } from 'react';
import { CalificacionUsuario, AutoConDisponibilidad } from '@/app/types/auto';
import Image from 'next/image';
import PanelComentariosHost from './PanelComentariosHost';
import { getUsuarioPorId, getComentariosDeHost } from '@/libs/autoServices';
import TarjetaHost from '@/app/components/Autos/DetallesHost/TarjetaHost';
import InformacionHost from '@/app/components/Autos/DetallesHost/InformacionHost';
import AutosDelHost from './AutosDelHost';

interface Props {
  id: string;
  comentarios: CalificacionUsuario[];
  autos: AutoConDisponibilidad[];
}

export default function DetalleHost({ id, comentarios: comentariosIniciales,autos }: Props) {
  console.log("Autos en DetalleHost:", autos);
  const [nombre, setNombre] = useState('');
  const [comentarios, setComentarios] = useState<CalificacionUsuario[]>(comentariosIniciales);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  
  // Estados para controlar expansión de comentarios
  const [comentariosExpandidos, setComentariosExpandidos] = useState<{[key: number]: boolean}>({});
  const [comentariosConOverflow, setComentariosConOverflow] = useState<{[key: number]: boolean}>({});
  const refsComentarios = useRef<{[key: number]: HTMLParagraphElement | null}>({});
  const primerosTresComentarios = comentarios.slice(0, 3);
  
  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError(null);

      try {
        const [nuevosComentariosRes, usuario] = await Promise.all([
          getComentariosDeHost(id),
          getUsuarioPorId(id.toString())
        ]);

        setComentarios(nuevosComentariosRes.data);
        setNombre(usuario.data.nombreCompleto);
      } catch (err) {
        console.error('Error al cargar los datos del host:', err);
        setError('Error al cargar los datos del host');
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [id]);

  // Efecto para detectar overflow en comentarios
  useEffect(() => {
    const detectarOverflow = () => {
      const nuevosOverflows: {[key: number]: boolean} = {};
      
      primerosTresComentarios.forEach((comentario) => {
        const ref = refsComentarios.current[comentario.idCalificacion];
        if (ref) {
          const lineaEstimada = parseFloat(getComputedStyle(ref).lineHeight) || 20;
          const limite = lineaEstimada * 4; // Mostrar máximo 4 líneas
          const isOverflowing = ref.scrollHeight > limite + 2;
          nuevosOverflows[comentario.idCalificacion] = isOverflowing;
        }
      });
      
      setComentariosConOverflow(nuevosOverflows);
    };

    if (!cargando && comentarios.length > 0) {
      // Pequeño delay para asegurar que el DOM esté renderizado
      setTimeout(detectarOverflow, 100);
    }
  }, [comentarios, cargando, primerosTresComentarios]);

  const handleMostrarPanel = () => setMostrarPanel(true);
  const handleCerrarPanel = () => setMostrarPanel(false);

  const toggleComentarioExpandido = (idComentario: number) => {
    setComentariosExpandidos(prev => ({
      ...prev,
      [idComentario]: !prev[idComentario]
    }));
  };

  return (
    <div>

      <main className="max-w-6xl mx-auto p-4 md:p-6">
        <h1 className="text-lg md:text-2xl font-bold mb-4 md:mb-1 text-[#11295b] text-left md:ml-106">
          Acerca del Anfitrión
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 items-center md:items-start">
          {/* Tarjeta del Host (lado izquierdo) */}
          <div className="w-full md:w-1/3 flex justify-center md:justify-start">
            <TarjetaHost 
              comentarios={comentarios}
              nombre={nombre}
            />
          </div>
          
          {/* Información del Host (lado derecho) */}
          <div className="w-full md:w-2/3 mt-4 md:mt-0">
            <InformacionHost />
          </div>
        </div>

        {cargando && (
          <div className="flex items-center gap-2 mb-4">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#fca311]"></div>
            <span className="text-gray-600">Cargando comentarios...</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">
            {error}
          </div>
        )}

        {!cargando && !error && (
          <div>
            <h3 className="text-lg font-bold text-[#11295b] mb-4">Reseñas</h3>
            <div className="flex gap-4 mb-6">
              {primerosTresComentarios.map((comentario) => {
                const estaExpandido = comentariosExpandidos[comentario.idCalificacion] || false;
                const tieneOverflow = comentariosConOverflow[comentario.idCalificacion] || false;
                
                return (
                  <div
                    key={comentario.idCalificacion}
                    className="border border-gray-200 rounded-lg p-4 shadow-sm w-full flex flex-col items-start"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src="/imagenesIconos/usuario.png"
                        alt="Usuario"
                        className="w-10 h-10 rounded-full"
                        width={50}
                        height={50}
                        unoptimized
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {comentario.nombre} {comentario.apellido}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(comentario.fechaCreacion).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-yellow-400 text-xl">
                      {'★'.repeat(comentario.puntuacion)}
                      {'☆'.repeat(5 - comentario.puntuacion)}
                    </div>

                    <p
                      ref={(el) => {
                        refsComentarios.current[comentario.idCalificacion] = el;
                      }}
                      className={`text-sm text-gray-600 mb-3 ${!estaExpandido ? 'line-clamp-3' : ''}`}
                    >
                      {comentario.comentario}
                    </p>
                    
                    {tieneOverflow && (
                      <button
                        onClick={() => toggleComentarioExpandido(comentario.idCalificacion)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2"
                      >
                        {estaExpandido ? 'Ver menos' : 'Ver más'}
                      </button>
                    )}
                    
                  
                  </div>
                );
              })}
            </div>
              
            <button
              onClick={handleMostrarPanel}
              disabled={cargando}
              className={`px-5 py-2.5 rounded-full text-base font-semibold transition ${
                cargando
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#fca311] hover:bg-[#e69500] active:bg-[#cc8400]'
              } text-white`}
            >
              {cargando ? 'Cargando...' : 'Mostrar todas las reseñas'}
            </button>
          </div>
        )}

        {mostrarPanel && !cargando && (
          <PanelComentariosHost
            mostrar={mostrarPanel}
            onClose={handleCerrarPanel}
            comentarios={comentarios}
            nombre={nombre}
          />
        )}
        <section className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-[#11295b]">Autos</h2>
        <AutosDelHost autos={autos ?? []} />
      </section>
      </main>
    </div>
  );
}