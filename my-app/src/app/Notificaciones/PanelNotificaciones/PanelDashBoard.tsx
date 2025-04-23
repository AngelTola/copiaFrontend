"use client";

import { useState, useEffect } from "react";
import api from "@/libs/axiosConfig";
import ModalDetallesRenta from "./ComponentsModales/ModalDetallesRenta";
import { useNotifications } from "../../hooks/useNotificaciones";
import Image from "next/image";
import Link from 'next/link';
export interface Notificacion {
  id: string;
  titulo: string;
  descripcion: string;
  fecha: string;
  tipo: string;
  tipoEntidad: string;
  imagenURL?: string;
  leida: boolean;
}

interface PanelDashBoardProps {
  usuarioId: string;
}

export default function PanelDashBoard({ usuarioId }: PanelDashBoardProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [selectedNotificacion, setSelectedNotificacion] =
    useState<Notificacion | null>(null);
  const [loading, setLoading] = useState(true);
  const [notificacionDetalle, setNotificacionDetalle] = useState<any>(null);

  // Usar el hook de notificaciones para SSE
  const {
    isConnected,
    error: sseError,
    refreshNotifications,
  } = useNotifications();

  const transformarNotificaciones = (data: any[]): Notificacion[] => {
    return data.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      descripcion: item.mensaje,
      fecha: new Date(item.creadoEn).toLocaleString(),
      tipo: item.tipo || "No especificado",
      tipoEntidad: item.tipoEntidad || "No especificado",
      imagenURL: undefined,
      leida: item.leido,
    }));
  };

  // Obtener notificaciones del backend
  const obtenerNotificaciones = async () => {
    try {
      setLoading(true);
      const respuesta = await api.get(
        `/notificaciones/panel-notificaciones/${usuarioId}`
      );

      if (Array.isArray(respuesta.data.notificaciones)) {
        const notis = transformarNotificaciones(respuesta.data.notificaciones);
        setNotificaciones(notis);
      } else {
        console.error(
          "La respuesta no es un array:",
          respuesta.data.notificaciones
        );
        setNotificaciones([]);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener notificaciones iniciales
  useEffect(() => {
    obtenerNotificaciones();

    // Establecer listeners para eventos de notificaciones
    const handleNuevaNotificacion = () => {
      obtenerNotificaciones();
    };

    window.addEventListener("nueva-notificacion", handleNuevaNotificacion);

    return () => {
      window.removeEventListener("nueva-notificacion", handleNuevaNotificacion);
    };
  }, [usuarioId]);

  // Obtener detalles de una notificación
  const obtenerDetalleNotificacion = async (id: string) => {
    try {
      const respuesta = await api.get(
        `/notificaciones/detalle-notificacion/${id}?usuarioId=${usuarioId}`
      );
      //console.log("Datos desde backend:", respuesta.data);
      return respuesta.data;
    } catch (error) {
      console.error("Error al obtener detalle de notificación:", error);
      return null;
    }
  };

  // Manejar la apertura del modal con detalles
  const handleVerDetalles = async (notificacion: Notificacion) => {
    try {
      const detalle = await obtenerDetalleNotificacion(notificacion.id);

      if (detalle) {
        setSelectedNotificacion({
          ...notificacion,
          // Puedes agregar más datos del detalle si es necesario
          descripcion: detalle.mensaje || notificacion.descripcion,
        });
      }
    } catch (error) {
      console.error("Error al cargar detalles:", error);
    }
  };

  // Marcar notificación como leída al cerrar el modal
  const handleCloseModal = async () => {
    if (selectedNotificacion && !selectedNotificacion.leida) {
      try {
        await api.put(
          `/notificaciones/notificacion-leida/${selectedNotificacion.id}/${usuarioId}`
        );

        // Actualizar localmente
        setNotificaciones((prev) =>
          prev.map((n) =>
            n.id === selectedNotificacion.id ? { ...n, leida: true } : n
          )
        );
        console.log("Notificaciones actualizadas localmente:", notificaciones);
        // Refrescar el contador de notificaciones
        refreshNotifications();
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    }
    setSelectedNotificacion(null);
  };

  // Borrar notificación
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId },
      });

      // Actualizar el estado local
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      setSelectedNotificacion(null);

      // Refrescar el contador de notificaciones
      refreshNotifications();
    } catch (error) {
      console.error("Error al borrar notificación:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#FCA311]"></div>

    <div className="pt-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Notificaciones</h1>
        <Link
      href="/Notificaciones/DropDown" className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded transition-colors border border-blue-100 hover:border-blue-300">
      Volver
    </Link>
  </div>

        {isConnected && (
          <div className="text-green-500 text-sm mb-4 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Conectado a actualizaciones en tiempo real
          </div>
        )}

        {sseError && (
          <div className="text-red-500 text-sm mb-4 flex items-center">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            Error en la conexión de notificaciones
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-[#FCA311] rounded-full border-t-transparent"></div>
          </div>
        ) : (
          <>
            {notificaciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No hay notificaciones disponibles
                </p>
              </div>
            ) : (
              notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`border ${
                    notificacion.leida
                      ? "border-gray-200"
                      : "border-[#FCA311] bg-amber-50"
                  } rounded-lg p-4 mb-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-4">
                    {/* Imagen circular del auto (estatico xd) */}
                    <Image
                      src="/images/auto.png"
                      alt="Imagen de auto"
                      width={64}
                      height={64}
                      className="rounded-full object-cover border border-gray-300"
                    />

                    {/* Datos de la notificación */}
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800">
                        {notificacion.titulo}
                      </h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">
                        {notificacion.descripcion}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        {notificacion.fecha}
                      </p>
                      {!notificacion.leida && (
                        <span className="inline-block px-2 py-1 text-xs bg-amber-200 text-amber-800 rounded-full mt-2">
                          Nueva
                        </span>
                      )}
                    </div>

                    {/* Botones */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerDetalles(notificacion)}
                        className="bg-[#FCA311] text-white px-4 py-2 rounded-lg hover:bg-[#E59400] transition-colors"
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {selectedNotificacion && (
        <ModalDetallesRenta
          isOpen={true}
          notification={{
            titulo: selectedNotificacion.titulo,
            descripcion: selectedNotificacion.descripcion,
            fecha: selectedNotificacion.fecha,
            tipo: selectedNotificacion.tipo,
            tipoEntidad: selectedNotificacion.tipoEntidad,
            imagenURL: selectedNotificacion.imagenURL,
          }}
          onClose={handleCloseModal}
          onDelete={() => handleDelete(selectedNotificacion.id)}
        />
      )}
    </div>
  );
}
