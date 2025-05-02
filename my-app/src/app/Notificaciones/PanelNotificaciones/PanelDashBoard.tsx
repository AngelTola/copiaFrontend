"use client";

import { useState, useEffect } from "react";
import api from "@/libs/axiosConfig";
import ModalDetallesRenta from "../componentes/componentsModales/ModalDetallesRenta"; // Modal Detalles renta
import ModalConfirmacionEliminar from "../componentes/componentsModales/ModalConfirmacionEliminar" //Modal confirmacion
import ModalComentario from "../componentes/componentsModales/ModalComentarios"; // Modal comentarios
import { useNotifications } from "../../hooks/useNotificaciones";
import Image from "next/image";
import Link from "next/link";
import { Notificacion } from "../../types/notification";
import {motion, AnimatePresence} from 'framer-motion'

interface PanelDashBoardProps {
  usuarioId: string;
}

const obtenerImagenPorMensaje = (mensaje: string): string | null => {
  const texto = mensaje.toLowerCase();

  if (texto.includes("toyota") && texto.includes("corolla")) {
    return "https://i.imgur.com/biZb0ua.png";
  } else if (texto.includes("chevrolet") && texto.includes("malibu")) {
    return "https://i.imgur.com/muFk0C5.png";
  } else if (texto.includes("honda") && texto.includes("civic")) {
    return "https://i.imgur.com/yFSuVQY.png";
  } else if (texto.includes("ford") && texto.includes("mustang")) {
    return "https://i.imgur.com/yOURDEFAULTFALLBACK.png";
  }

  return null;
};

export default function PanelDashBoard({ usuarioId }: PanelDashBoardProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const [loading, setLoading] = useState(true);

  const { isConnected, error: sseError, refreshNotifications } = useNotifications();

  const transformarNotificaciones = (data: any[]): Notificacion[] => {
    return data.map((item) => {
      const imagenURL = obtenerImagenPorMensaje(item.mensaje);
      return {
        id: item.id,
        titulo: item.titulo,
        descripcion: item.mensaje,
        mensaje: item.mensaje,
        fecha: new Date(item.creadoEn).toLocaleString(),
        tipo: item.tipo || "No especificado",
        tipoEntidad: item.tipoEntidad || "No especificado",
        imagenURL: imagenURL || undefined,
        leida: item.leido,
        creadoEn: item.creadoEn,
      };
    });
  };

  const obtenerNotificaciones = async () => {
    try {
      setLoading(true);
      const respuesta = await api.get(`/notificaciones/panel-notificaciones/${usuarioId}`);

      if (Array.isArray(respuesta.data.notificaciones)) {
        const notis = transformarNotificaciones(respuesta.data.notificaciones);
        setNotificaciones(notis);
      } else {
        console.error("La respuesta no es un array:", respuesta.data.notificaciones);
        setNotificaciones([]);
      }
    } catch (error) {
      console.error("Error al cargar notificaciones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerNotificaciones();

    const handleNuevaNotificacion = () => {
      obtenerNotificaciones();
    };

    window.addEventListener("nueva-notificacion", handleNuevaNotificacion);
    return () => window.removeEventListener("nueva-notificacion", handleNuevaNotificacion);
  }, [usuarioId]);

  const handleVerDetalles = async (notificacion: Notificacion) => {
    setSelectedNotificacion(notificacion);
  };

  const handleCloseModal = async () => {
    if (selectedNotificacion && !selectedNotificacion.leida) {
      try {
        await api.put(`/notificaciones/notificacion-leida/${selectedNotificacion.id}/${usuarioId}`);
        setNotificaciones((prev) =>
          prev.map((n) => (n.id === selectedNotificacion.id ? { ...n, leida: true } : n))
        );
        refreshNotifications();
      } catch (error) {
        console.error("Error al marcar como leída:", error);
      }
    }
    setSelectedNotificacion(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId },
      });
      setNotificaciones((prev) => prev.filter((n) => n.id !== id));
      setSelectedNotificacion(null);
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
          <Link href="/Notificaciones/DropDown" className="text-sm text-blue-600 hover:text-blue-800 px-3 py-1 rounded transition-colors border border-blue-100 hover:border-blue-300">
            Volver
          </Link>
        </div>

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
                <p className="text-gray-500">No hay notificaciones disponibles</p>
              </div>
            ) : (
              notificaciones.map((notificacion) => (
                <div
                  key={notificacion.id}
                  className={`border ${notificacion.leida ? "border-gray-200" : "border-[#FCA311] bg-amber-50"} rounded-lg p-4 mb-4 hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-center gap-4">
                    {notificacion.imagenURL && (
                      <Image
                        src={notificacion.imagenURL}
                        alt="Imagen de auto"
                        width={64}
                        height={64}
                        className="rounded-full object-cover border border-gray-300"
                      />
                    )}

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

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleVerDetalles(notificacion)}
                        className="cursor-pointer bg-[#FCA311] text-white px-4 py-2 rounded-lg hover:bg-[#E59400] transition-colors"
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

      <AnimatePresence>
        {selectedNotificacion && (
          <motion.div
            key="modal-detalles"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-White/1"
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
