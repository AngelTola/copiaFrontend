"use client";
import React, { useState, useEffect, useCallback } from 'react';
import api from "@/libs/axiosConfig";
import ModalDetallesRenta from "../componentes/componentsModales/ModalDetallesRenta";
import ToastNotification from "../componentes/componentsModales/ToastNotification";
import { useNotifications } from "../../hooks/useNotificaciones";
import Link from "next/link";
import type { Notificacion, NotificationResponse } from '@/app/types/notification';
import { motion, AnimatePresence} from "framer-motion";
import { CheckCircle } from "lucide-react";
import Image from "next/image";

interface PanelDashBoardProps {
  usuarioId: string;
}

export default function PanelDashBoard({ usuarioId }: PanelDashBoardProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [mensajeExito, setMensajeExito] = useState("");
  const [toastNotification, setToastNotification] = useState<Notificacion | null>(null);
  const {
    notifications: sseNotifications,
    refreshNotifications: cargarNotificaciones,
    markAsRead,
  } = useNotifications();

  const transformarNotificaciones = (data: NotificationResponse[]): Notificacion[] => {
    return data.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      descripcion: item.mensaje,
      mensaje: item.mensaje,
      fecha: item.creadoEn,
      tipo: item.tipo || "No especificado",
      tipoEntidad: item.tipoEntidad || "No especificado",
      imagenURL: item.imagenAuto,
      leido: item.leido,
      creadoEn: item.creadoEn,
    }));
  };

  function formatDate(dateString: Date | string) {
    const fecha = new Date(dateString);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const año = fecha.getFullYear();
    const hora = fecha.getHours().toString().padStart(2, "0");
    const minutos = fecha.getMinutes().toString().padStart(2, "0");
    return `${dia}/${mes}/${año}, ${hora}:${minutos}`;
  }

  const obtenerNotificaciones = useCallback(async () => {
    try {
      setLoading(true);
      const respuesta = await api.get(`/notificaciones/panel-notificaciones/${usuarioId}`);
      if (Array.isArray(respuesta.data.notificaciones)) {
        const notis = transformarNotificaciones(respuesta.data.notificaciones);
        setNotificaciones(notis);
      } else {
        setNotificaciones([]);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  }, [usuarioId]);

  useEffect(() => {
    obtenerNotificaciones();
  }, [obtenerNotificaciones]);

  useEffect(() => {
    if (sseNotifications && sseNotifications.length > 0) {
      const notisTransformadas = transformarNotificaciones(sseNotifications);
      
      setNotificaciones((prev) => {
        const notificacionesExistentes = new Map(prev.map(n => [n.id, n]));
        
        const nuevas = notisTransformadas.filter(nueva => {
          const existente = notificacionesExistentes.get(nueva.id);
          return !existente || existente.leido !== nueva.leido;
        });

        if (nuevas.length > 0) {
          const notificacionMasReciente = nuevas.reduce((masReciente, actual) => {
            return new Date(actual.creadoEn) > new Date(masReciente.creadoEn) ? actual : masReciente;
          });
          
          if (!notificacionMasReciente.leido) {
            setToastNotification(notificacionMasReciente);
            setTimeout(() => {
              setToastNotification(null);
            }, 3000);
          }
        }

        const todasLasNotificaciones = [...prev];
        nuevas.forEach(nueva => {
          const index = todasLasNotificaciones.findIndex(n => n.id === nueva.id);
          if (index !== -1) {
            todasLasNotificaciones[index] = nueva;
          } else {
            todasLasNotificaciones.unshift(nueva);
          }
        });

        return todasLasNotificaciones;
      });
    }
  }, [sseNotifications]);

  const handleNotificacionClick = async (notificacion: Notificacion) => {
    if (!notificacion.leido) {
      await markAsRead(notificacion.id);
    }
    setSelectedNotificacion(notificacion);
  };

  const handleCloseModal = () => {
    setSelectedNotificacion(null);
    cargarNotificaciones();
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId },
      });
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      setSelectedNotificacion(null);
      cargarNotificaciones();
      setMensajeExito("¡Se eliminó correctamente!");
      setTimeout(() => setMensajeExito(""), 3000);
    } catch (error) {
      console.error("Error al borrar notificación:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#FCA311]"></div>

      {mensajeExito && (
        <div className="fixed top-4 right-4 bg-green-100 text-green-800 px-4 py-2 rounded shadow-lg border border-green-400 flex items-center gap-2 z-50">
          <CheckCircle className="w-5 h-5" />
          <span>{mensajeExito}</span>
        </div>
      )}

      <AnimatePresence>
        {toastNotification && (
          <ToastNotification
            notificacion={toastNotification}
          />
        )}
      </AnimatePresence>

      <div className="pt-8 px-3 md:px-6">
        <div className="flex sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Notificaciones</h1>
          <Link
            href="/Notificaciones/DropDown"
            className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 px-2 py-1 rounded transition-colors border border-blue-100 hover:border-blue-300"
          >
            Volver
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#FCA311] rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {notificaciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No hay notificaciones disponibles</p>
              </div>
            ) : (
              <div className="flex flex-col space-y-4">
                {notificaciones.map((notificacion) => (
                  <div
                    key={notificacion.id}
                    className={`p-2 sm:p-4 border rounded-lg transition-shadow ${
                      notificacion.leido 
                      ?'bg-white'
                      :'bg-amber-50'
                    }`}
                  >
                  
                  <div className="sm:hidden border rounded-lg p-4 bg-white">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-800 pr-1">{notificacion.titulo}</h3>
                        <p 
                          className="text-xs text-gray-600 mt-1 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: notificacion.descripcion }}
                        />
                      </div>
  
                      <div className="text-right flex-shrink-0 ml-2">
                         <p className="text-xs text-gray-500">{formatDate(notificacion.fecha)}</p>
                          {!notificacion.leido && (
                            <span className="inline-block mt-1 text-[10px] bg-amber-200 text-amber-800 px-1 py-0.5 rounded-full font-medium">
                              Nueva
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleNotificacionClick(notificacion)}
                        className="bg-[#FCA311] text-white text-xs px-3 py-1 rounded-lg hover:bg-[#E59400] transition-colors"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>

                  <div className=' hidden sm:grid sm:grid-cols-12 sm:gap-2 '>
                    <div className='col-span-1 flex items-center justify-center'>
                      {notificacion.imagenURL && (
                        <div className='w-12 h-12 md:w-[60px] md:h-[60px] rounded-full overflow-hidden flex-shrink-0 border'>
                          <Image
                            src={notificacion.imagenURL}
                            alt="Imagen de auto"
                            width={60}
                            height={60}
                            className='object-cover w-full h-full'
                          />
                        </div>
                      )}
                    </div>

                    <div className='col-span-2 flex items-center'>
                       <h3 className='text-base md:text-xl font-semibold text-gray-800 whitespace-pre-line'>
                        {notificacion.titulo === 'Tiempo de Renta Concluido'
                          ? notificacion.titulo.replace(' de ', ' de\n ')
                          : notificacion.titulo.replace(' ', '\n')
                        }
                      </h3>
                    </div>

                     <div className='col-span-5 flex items-center ml-4'>
                      <p className='text-sm md:text-base text-gray-600 text-left line-clamp-2'
                       dangerouslySetInnerHTML={{__html: notificacion.descripcion}}>
                      </p>
                    </div>

                     <div>
                      <p className='col-span-5 text-sm md:text-base text-gray-500 font-medium'>
                        {formatDate(notificacion.fecha)}
                      </p>
                    </div>

                    <div className='col-span-3 flex flex-col items-end justify-center gap-1'>
                        {!notificacion.leido && (
                          <span className='text-xs md:text-sm bg-amber-200 text-amber-800 px-2 py-1 rounded-full font-medium'>
                            Nueva
                          </span>
                        )}

                        <button
                          onClick={() => handleNotificacionClick(notificacion)}
                          className='cursor-pointer text-sm md:text-lg bg-[#FCA311] text-white px-3 py-1 rounded-lg hover:bg-[#E59400] transition-colors'
                        >
                          Ver más 
                        </button>
                    </div>
                  </div>
                 </div>
              ))}
            </div>
          )}
        </>
       )}
     </div>

     <AnimatePresence>
       {selectedNotificacion && (
        <motion.div
         key="modal-detalles"
         initial={{ scale: 0.8, opacity: 0 }}
         animate={{ scale: 1, opacity: 1 }}
         exit={{ scale: 0.8, opacity: 0 }}
         transition={{ duration: 0.2 }}
         className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/50 p-3"
        >
            
        <ModalDetallesRenta
          isOpen={true}
          notification={selectedNotificacion}
          onClose={handleCloseModal}
          onDelete={() => handleDelete(selectedNotificacion.id)}
        />
        
        </motion.div>
       )}
      </AnimatePresence>
    </div>
  );
}
