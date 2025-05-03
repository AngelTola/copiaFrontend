import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../../hooks/useNotificaciones';
import NotificationIcon from '@/app/Notificaciones/componentes/notificacionCampana/notificacionIcon';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { getUserId } from '../../../utils/userIdentifier';
import api from '@/libs/axiosConfig';
import ModalDetallesRenta from '../componentsModales/ModalDetallesRenta';
import type { Notificacion } from '@/app/types/notification';
import { motion, AnimatePresence } from 'framer-motion';

type ModalNotificacion = {
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  tipoEntidad: string;
  imagenURL?: string;
};

export function NotificacionesCampana() {
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const {
    notifications,
    unreadCount,
    loading: cargando,
    isConnected,
    refreshNotifications: cargarNotificaciones,
    setNotifications,
    markAsRead,
  } = useNotifications();

  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const userId = getUserId();
  const [isProcessingRead, setIsProcessingRead] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (mostrarPanel && !target.closest('.notificaciones-panel')) {
        setMostrarPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mostrarPanel]);

  const togglePanel = () => {
    console.log("Toggle panel - Estado previo:", mostrarPanel);
    if (!mostrarPanel) {
      console.log("Panel abierto - Cargando notificaciones...");
      cargarNotificaciones();
    }
    setMostrarPanel(!mostrarPanel);
  };

  const obtenerDetalleNotificacion = async (id: string) => {
    console.log("Obteniendo detalle para notificación:", id);
    try {
      const respuesta = await api.get(`/notificaciones/detalle-notificacion/${id}?usuarioId=${userId}`);
      console.log("Detalle obtenido:", respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener detalle de notificación:', error);
      return null;
    }
  };

  const handleVerDetalles = async (notificacion: Notificacion) => {
    console.log("Manejando ver detalles para:", notificacion.id, "Leída:", notificacion.leida);
    try {
      const detalle = await obtenerDetalleNotificacion(notificacion.id);
      if (detalle) {
        console.log("Detalle recibido, actualizando selectedNotificacion", detalle);
        setSelectedNotificacion(notificacion);
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    }
  };

  const handleNotificacionClick = async (notificacion: Notificacion) => {
    console.log("Click en notificación:", notificacion.id, "Estado leída actual:", notificacion.leida);
    setMostrarPanel(false);

    try {
      await handleVerDetalles(notificacion);

      if (!userId) {
        console.error('userId no disponible');
        return;
      }

      if (!notificacion.leida && !isProcessingRead) {
        console.log("Marcando como leída la notificación:", notificacion.id);
        setIsProcessingRead(true);

        try {
          await markAsRead(notificacion.id);
          console.log("Notificación marcada como leída correctamente");
        } catch (error) {
          console.error('Error al marcar notificación como leída:', error);
        } finally {
          setIsProcessingRead(false);
        }
      }
    } catch (err) {
      console.error('Error al manejar clic en notificación:', err);
      alert('No se pudo cargar el detalle de la notificación.');
    }
  };

  const handleCloseModal = () => {
    console.log("Cerrando modal, recargando notificaciones");
    setSelectedNotificacion(null);
    cargarNotificaciones();
  };

  const handleDelete = async (id: string) => {
    console.log("Eliminando notificación:", id);
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId: userId },
      });

      console.log("Notificación eliminada, actualizando estado");
      setSelectedNotificacion(null);
      cargarNotificaciones();
    } catch (err) {
      console.error('Error al eliminar la notificación:', err);
    }
  };

  // Función para transformar las notificaciones
  const transformarNotificacion = (item: any): Notificacion => {
    return {
      id: item.id,
      titulo: item.titulo,
      descripcion: item.mensaje,
      mensaje: item.mensaje,
      fecha: new Date(item.creadoEn).toLocaleString(),
      tipo: item.tipo || "No especificado",
      tipoEntidad: item.tipoEntidad || "No especificado",
      imagenURL: item.imagenAuto || undefined,
      leida: item.leido,
      creadoEn: item.creadoEn,
    };
  };

  return (
    <>
      <div className="relative notificaciones-panel">
        <button
          onClick={togglePanel}
          className="cursor-pointer relative p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Ver notificaciones"
        >
          <BellIcon className="w-6 h-6 text-orange-500" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {!isConnected && (
            <span className="absolute bottom-0 right-0 w-2 h-2 bg-yellow-500 rounded-full border border-white"></span>
          )}
        </button>

        {mostrarPanel && (
          <div className="absolute right-0 w-80 mt-2 bg-white rounded-md shadow-lg z-40 notificaciones-panel">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Notificaciones</h3>
              {!isConnected && (
                <span className="text-xs text-yellow-600 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>
                  Reconectando...
                </span>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {cargando ? (
                <div className="p-4 text-center text-gray-500">Cargando...</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No tienes notificaciones</div>
              ) : (
                <ul>
                  {notifications.slice(0, 3).map((notificacion) => (
                    <li
                      key={notificacion.id}
                      onClick={() => handleNotificacionClick(transformarNotificacion(notificacion))}
                      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        notificacion.leida ? 'bg-white' : 'bg-amber-50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <NotificationIcon tipo={notificacion.tipo} />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{notificacion.titulo}</p>
                          <p className="text-sm text-gray-600 line-clamp-2">{notificacion.mensaje}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(notificacion.creadoEn)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="p-2 border-t border-gray-200">
              <Link href="/Notificaciones/PanelNotificaciones" className="block w-full text-center text-sm text-blue-600 hover:text-blue-800 p-2">
                Ver todas
              </Link>
            </div>
          </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/1"
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
    </>
  );
}

function formatDate(dateString: Date | string) {
  const fecha = new Date(dateString);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const hora = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${año} ${hora}:${minutos}`;
}