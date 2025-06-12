'use client';
import { CalificacionUsuario } from '@/app/types/auto';
import Image from 'next/image';
import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { getUsuarioPorId } from '@/libs/autoServices';

interface PanelComentariosHostProps {
  mostrar: boolean;
  onClose: () => void;
  comentarios: CalificacionUsuario[];
  nombre: string;
}

export default function PanelComentariosHost({
  mostrar,
  onClose,
  comentarios,
  nombre,
}: PanelComentariosHostProps) {
  const comentariosValidos = useMemo(() => {
    return comentarios
      .map(c => ({
        ...c,
        calificacion: c.puntuacion ?? 0,
        contenido: c.comentario ?? '',
        idComentario: c.idCalificador ?? 0
      }))
      .filter(c =>
        c.calificacion >= 1 &&
        c.calificacion <= 5 &&
        (c.contenido.trim() !== '' || c.comentario?.trim() !== '')
      );
  }, [comentarios]);

  function resaltarCoincidencias(texto: string, termino: string) {
    if (!termino) return texto;

    const regex = new RegExp(`(${termino})`, 'gi');
    const partes = texto.split(regex);

    return partes.map((parte, index) =>
      regex.test(parte) ? (
        <span key={index} className="font-bold text-black">
          {parte}
        </span>
      ) : (
        <span key={index}>{parte}</span>
      )
    );
  }

  const promedioCalificacion = comentariosValidos.length > 0
    ? parseFloat((comentariosValidos.reduce((acc, c) => acc + c.calificacion, 0) / comentariosValidos.length).toFixed(1))
    : 0;

  const [comentariosExpandidos, setComentariosExpandidos] = useState<Record<number, boolean>>({});
  const [comentariosConOverflow, setComentariosConOverflow] = useState<Record<number, boolean>>({});
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [comentariosFiltrados, setComentariosFiltrados] = useState(comentariosValidos);
  const [filtroSeleccionado, setFiltroSeleccionado] = useState<string>('Los más recientes');
  const refsComentarios = useRef<Record<number, HTMLParagraphElement | null>>({});

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
  
  const [advertencia, setAdvertencia] = useState('');
  const [nombresUsuarios, setNombresUsuarios] = useState<Record<number, { nombreCompleto: string; }>>({});

  // Memoizar los IDs únicos para evitar recálculos innecesarios
  const idsUnicos = useMemo(() => {
    return [...new Set(comentariosValidos.map(c => c.idCalificador))];
  }, [comentariosValidos]);

  // Corregir el useEffect para cargar nombres - eliminar nombresUsuarios de las dependencias
  useEffect(() => {
    const cargarNombres = async () => {
      const idsParaCargar = idsUnicos.filter(id => !nombresUsuarios[id]);
      
      if (idsParaCargar.length === 0) return;
      
      const nuevosNombres: Record<number, { nombreCompleto: string; }> = {};
      
      await Promise.all(idsParaCargar.map(async (id) => {
        try {
          const usuario = await getUsuarioPorId(id.toString());
          nuevosNombres[id] = {
            nombreCompleto: usuario.data.nombreCompleto || 'Anónimo',
          };
        } catch {
          nuevosNombres[id] = { nombreCompleto: 'Anónimo' };
        }
      }));
      
      if (Object.keys(nuevosNombres).length > 0) {
        setNombresUsuarios(prev => ({ ...prev, ...nuevosNombres }));
      }
    };
    
    cargarNombres();
  }, [idsUnicos, nombresUsuarios]);

  useEffect(() => {
    let mounted = false;
    if (typeof window !== 'undefined') mounted = true;

    if (!mounted) return;

    if (mostrar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mostrar]);

  useEffect(() => {
    const observers: ResizeObserver[] = [];
    comentariosValidos.forEach((comentario) => {
      const el = refsComentarios.current[comentario.idComentario];
      if (el) {
        const observer = new ResizeObserver(() => {
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
    return () => {
      observers.forEach((o) => o.disconnect());
    };
  }, [comentariosValidos]);

  // Memoizar la función de filtrado para mejorar performance
  const filtrarYOrdenarComentarios = useCallback(() => {
    let comentariosFiltrados = [...comentariosValidos];
    
    // Aplicar filtro de búsqueda
    if (terminoBusqueda) {
      comentariosFiltrados = comentariosFiltrados.filter((comentario) => {
        const texto = comentario.comentario?.toLowerCase() ?? '';
        const nombre = nombresUsuarios[comentario.idCalificador]?.nombreCompleto?.toLowerCase() ?? '';
        return (
          texto.includes(terminoBusqueda.toLowerCase()) ||
          nombre.includes(terminoBusqueda.toLowerCase())
        );
      });
    }
    
    // Aplicar ordenamiento
    switch (filtroSeleccionado) {
      case 'Los más recientes':
        comentariosFiltrados.sort((a, b) => 
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        break;
      case 'Los Mejores':
        comentariosFiltrados.sort((a, b) => b.calificacion - a.calificacion);
        break;
      case 'Los Peores':
        comentariosFiltrados.sort((a, b) => a.calificacion - b.calificacion);
        break;
    }
    
    return comentariosFiltrados;
  }, [comentariosValidos, terminoBusqueda, nombresUsuarios, filtroSeleccionado]);

  // Actualizar comentarios filtrados cuando cambien las dependencias
  useEffect(() => {
    const comentariosFiltradosActualizados = filtrarYOrdenarComentarios();
    setComentariosFiltrados(comentariosFiltradosActualizados);
  }, [filtrarYOrdenarComentarios]);

  const toggleExpansion = (id: number) => {
    setComentariosExpandidos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderEstrellasConMedia = (promedio: number) => {
    const estrellas = [];
    for (let i = 1; i <= 5; i++) {
      if (promedio >= i) {
        estrellas.push(<span key={i}>★</span>);
      } else if (promedio >= i - 0.5) {
        estrellas.push(
          <span key={i} className="relative inline-block w-[1em]">
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
      <div className={`fixed top-0 left-1/2 transform -translate-x-1/2 h-screen w-full sm:w-[90%] md:w-[600px] bg-[#f5f5f5] p-6 z-[1000] overflow-y-auto border-2 border-black rounded-2xl shadow-md transition-transform duration-300 ${
        mostrar ? 'translate-y-0' : '-translate-y-full'
      }`}>
        
        <button
          className="absolute top-2 right-4 bg-[#fca311] text-white text-lg px-3 py-1 rounded border border-black hover:bg-[#e69500] active:bg-[#cc8400]"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-black mb-10">
          {nombre}
        </h2>
        <hr className="border-t-4 border-black mb-3" />
        <h3 className="text-3xl font-bold text-[#002a5c] text-center mt-4">
          Calificación del Host
        </h3>
        <div className="flex gap-4 items-center mb-4">
          <div className="bg-[#002a5c] text-white text-xl p-2 rounded w-12 text-center">
            {promedioCalificacion.toFixed(1)}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              <div className="text-[#fca311] text-2xl leading-none flex gap-1">
                {renderEstrellasConMedia(promedioCalificacion)}
              </div>
            </div>
          </div>
        </div>

        {([5, 4, 3, 2, 1] as const).map((estrella) => (
          <div key={estrella} className="flex items-center gap-2 mb-3">
            <div className="bg-[#002a5c] text-white w-8 h-8 flex items-center justify-center rounded">
              {estrella}
            </div>
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

        {comentariosValidos.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div className="flex items-center w-full sm:w-auto border border-gray-400 rounded-full px-3 py-1 bg-white"
            style={{ minWidth: '300px' }}
            >
              
              <input
                type="text"
                placeholder="Buscar comentarios..."
                className="outline-none flex-grow px-2 py-1 text-black bg-transparent"
                value={terminoBusqueda}
                maxLength={20}
                onChange={(e) => {
                  const value = e.target.value;
                  const caracteresNoPermitidos = /[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]/;

                  if (caracteresNoPermitidos.test(value)) {
                    setAdvertencia('No se permiten caracteres especiales en la búsqueda.');
                  } else if (value.length === 20) {
                    setAdvertencia('Búsqueda máxima permitida: 20 caracteres');
                  } else {
                    setAdvertencia('');
                  }

                  // Actualizar solo si el valor es válido
                  if (!caracteresNoPermitidos.test(value)) {
                    setTerminoBusqueda(value);
                  }
                }}
              />
              {terminoBusqueda && (
                <button
                  className="text-gray-500 hover:text-red-600 px-1"
                  onClick={() => setTerminoBusqueda('')}
                >
                  ✕
                </button>
              )}
              <button className="text-[#002a5c] hover:text-[#fca311]" type="button">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                  />
                </svg>
              </button>
            </div>

            
            <div className="relative">
              <select
                className="bg-[#fca311] text-white font-semibold px-4 py-1 rounded cursor-pointer border border-black"
                value={filtroSeleccionado}
                onChange={(e) => setFiltroSeleccionado(e.target.value)}
              >
                <option value="Los más recientes">Los más recientes</option>
                <option value="Los Mejores">Los Mejores</option>
                <option value="Los Peores">Los Peores</option>
              </select>
            </div>
          </div>
        )}

        {advertencia && (
          <p className="text-red-600 text-sm mt-6 sm:mt-8 mb-4 text-center">
            {advertencia}
          </p>
        )}

        <div className="space-y-4">
          {comentariosFiltrados.length > 0 ? (
            comentariosFiltrados.map((comentario) => {
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
                <div key={comentario.idCalificacion} className="border-b border-black pb-3">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <Image
                        src="/imagenesIconos/usuario.png"
                        alt="Usuario"
                        className="w-10 h-10 rounded-full"
                        width={50}
                        height={50}
                        unoptimized
                      />
                      <div>
                        <strong className="text-black font-semibold">
                          {nombresUsuarios[comentario.idCalificador]?.nombreCompleto || 'Anónimo'}{' '}
                        </strong>
                        <div className="text-sm text-gray-500">{fecha}</div>
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[#fca311] text-2xl leading-none flex gap-1">
                        {[...Array(estrellasLlenas)].map((_, i) => (
                          <span key={i}>★</span>
                        ))}
                        {[...Array(estrellasVacias)].map((_, i) => (
                          <span key={i + estrellasLlenas}>☆</span>
                        ))}
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
                    {resaltarCoincidencias(
                      comentario.contenido || comentario.comentario || '',
                      terminoBusqueda
                    )}
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
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {terminoBusqueda
                  ? `No hay resultados para '${terminoBusqueda}'`
                  : 'No hay reseñas disponibles'}
              </p>
            </div>
          )}
        </div> 
      </div>
    </>
  );
}