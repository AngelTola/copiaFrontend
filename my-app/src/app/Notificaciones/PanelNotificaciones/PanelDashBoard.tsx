'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import ModalDetallesRenta from './ComponentsModales/ModalDetallesRenta';

export interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  vehiculo: string;
  arrendatario: string;
  imagenURL?: string;
  leida: boolean;
}

interface PanelDashBoardProps {
  notificaciones: Notificacion[];
}

export default function PanelDashBoard({ notificaciones: notificacionesIniciales }: PanelDashBoardProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(notificacionesIniciales || []);
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);

  const handleOpenModal = (notificacion: Notificacion) => {
    if (!notificacion.leida) {
      setNotificaciones(prev =>
        prev.map(n =>
          n.id === notificacion.id ? { ...n, leida: true } : n
        )
      );
    }
    setSelectedNotificacion(notificacion);
  };

  const cantidadNoLeidas = notificaciones.filter(n => !n.leida).length;

  return (
    <div className="w-full min-h-screen bg-white px-4 sm:px-8 py-10">
      <div className="border-t-4 border-[#FCA311] mb-8 w-full"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-[#003049]">
          Notificaciones
          {cantidadNoLeidas > 0 && (
            <span className="ml-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {cantidadNoLeidas} no leída{cantidadNoLeidas > 1 ? 's' : ''}
            </span>
          )}
        </h2>
        <div className="relative">
          <Bell className="w-6 h-6 sm:w-7 sm:h-7 text-[#003049]" />
          {cantidadNoLeidas > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-600 rounded-full animate-pulse border-2 border-white"></span>
          )}
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="bg-[#f5f5f5] p-4 sm:p-6 rounded-md shadow-md w-full max-w-5xl mx-auto">
        {notificaciones.length === 0 ? (
          <p className="text-center text-gray-500">No hay notificaciones por el momento.</p>
        ) : (
          notificaciones.map((notificacion) => (
            <div
              key={notificacion.id}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 py-3 border ${!notificacion.leida ? 'bg-[#F4EAD5]' : 'bg-white'} rounded-md mb-2`}
            >
              <div className="flex items-center gap-4 w-full sm:w-auto mb-2 sm:mb-0">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
                {!notificacion.leida && (
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                )}
              </div>

              <div className="flex-1 sm:ml-4 text-left sm:text-left">
                <h3 className="font-bold text-sm text-gray-800">{notificacion.titulo}</h3>
                <p className="text-gray-700 text-sm">{notificacion.descripcion}</p>
                <p className="text-gray-500 text-xs">{notificacion.fecha}</p>
              </div>

              <div className="mt-2 sm:mt-0 sm:ml-4">
                <button
                  onClick={() => handleOpenModal(notificacion)}
                  className="bg-[#FCA311] hover:bg-[#e58c00] text-white text-sm px-4 py-1 rounded-md font-semibold"
                >
                  Ver más
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {selectedNotificacion && (
        <ModalDetallesRenta
          isOpen={!!selectedNotificacion}
          notification={selectedNotificacion}
          onClose={() => setSelectedNotificacion(null)}
          onDelete={() => {
            setNotificaciones(prev =>
              prev.filter(n => n.id !== selectedNotificacion.id)
            );
            setSelectedNotificacion(null);
          }}
        />
      )}
    </div>
  );
}
