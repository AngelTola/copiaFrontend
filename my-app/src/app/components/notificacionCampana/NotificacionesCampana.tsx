'use client';

import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotificaciones';
import NotificationIcon from '@/app/components/notificacionCampana/notificacionIcon';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';
import { getUserId } from '../../utils/userIdentifier';
import api from '@/libs/axiosConfig';
import ModalDetallesRenta from '../../Notificaciones/PanelNotificaciones/ComponentsModales/ModalDetallesRenta';
import type { Notificacion, Notificacion as Notification } from '@/app/types/notification';

export function NotificacionesCampana() {
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const {
    notifications,
    unreadCount: unreadCountFromHook,
    loading: cargando,
    isConnected,
    refreshNotifications: cargarNotificaciones,
    setNotifications, // <- asegúrate de que este hook lo exponga correctamente
  } = useNotifications();

  const [unreadCount, setUnreadCount] = useState(unreadCountFromHook); // Definir el estado para unreadCount
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notification | null>(null);
  const userId = getUserId();

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
    setMostrarPanel(!mostrarPanel);
    if (!mostrarPanel) {
      cargarNotificaciones();
    }
  };

  const obtenerDetalleNotificacion = async (id: string) => {
    try {
      const respuesta = await api.get(`/notificaciones/detalle-notificacion/${id}?usuarioId=${userId}`);
      return respuesta.data;
    } catch (error) {
      console.error('Error al obtener detalle de notificación:', error);
      return null;
    }
  };

  const handleVerDetalles = async (notificacion: Notification) => {
    try {
      const detalle = await obtenerDetalleNotificacion(notificacion.id);
      if (detalle) {
        setSelectedNotificacion({
          ...notificacion,
          descripcion: detalle.mensaje || notificacion.descripcion,
          fecha: notificacion.creadoEn,
        });
      }
    } catch (error) {
      console.error('Error al cargar detalles:', error);
    }
  };

  const handleNotificacionClick = async (notificacion: Notification) => {
      setMostrarPanel(false);
      try {
        console.log('Clic en notificación:', notificacion.id);
        await handleVerDetalles(notificacion);
    
        if (!userId) {
          console.error('userId no disponible');
          return;
        }
    
        // Primero, actualizamos el estado local para cambiar el fondo a blanco
        if (!notificacion.leida) {
          // Hacemos la actualización de estado local antes de la llamada a la API
          setNotifications((prev) =>
            prev.map((n) => (n.id === notificacion.id ? { ...n, leida: true } : n))
          );
          console.log("Notificación marcada como leída localmente");
    
          const marcarLeidaRes = await fetch(
            `http://localhost:3001/api/notificaciones/notificacion-leida/${notificacion.id}/${userId}`,
            { method: 'PUT' }
          );
    
          if (!marcarLeidaRes.ok) {
            throw new Error('No se pudo marcar como leída');
          }
          console.log("Notificación marcada como leída en la base de datos");
        }
      } catch (err) {
        console.error('Error al manejar clic en notificación:', err);
        alert('No se pudo cargar el detalle de la notificación.');
      }
    };

  // useEffect para observar cuando las notificaciones son actualizadas y actualizar unreadCount
  useEffect(() => {
    if (notifications.length > 0) {
      const unreadNotifications = notifications.filter((noti) => !noti.leida);
      // Actualizamos el estado unreadCount
      setUnreadCount(unreadNotifications.length);
    }
  }, [notifications]);

  const handleCloseModal = () => setSelectedNotificacion(null);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId: userId },
      });

      setSelectedNotificacion(null);
      cargarNotificaciones();
    } catch (err) {
      console.error('Error al eliminar la notificación:', err);
    }
  };

  return (
    <>
      <div className="relative notificaciones-panel">
        <button
          onClick={togglePanel}
          className="relative p-2 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Ver notificaciones"
        >
          <BellIcon className="w-6 h-6 text-orange-500" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          {!isConnected && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-yellow-500 rounded-full border border-white"></span>
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
                        onClick={() => handleNotificacionClick(notificacion)}
                        className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                          notificacion.leida ? 'bg-white' : 'bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            <NotificationIcon tipo={notificacion.tipo} />
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900">{notificacion.titulo}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {notificacion.mensaje}
                            </p>
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

      {selectedNotificacion && (
        <ModalDetallesRenta
          isOpen={true}
          notification={{
            titulo: selectedNotificacion.titulo,
            descripcion: selectedNotificacion.descripcion,
            fecha: formatDate(selectedNotificacion.fecha),
            tipo: selectedNotificacion.tipo,
            tipoEntidad: selectedNotificacion.tipoEntidad,
            imagenURL: selectedNotificacion.imagenURL,
          }}
          onClose={handleCloseModal}
          onDelete={() => handleDelete(selectedNotificacion.id)}
        />
      )}
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
