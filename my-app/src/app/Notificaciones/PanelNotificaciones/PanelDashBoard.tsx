'use client';

import { useState, useEffect } from 'react';
import api from '@/libs/axiosConfig';

export default function PanelDashBoard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNotificacion, setSelectedNotificacion] = useState<any | null>(null);
  const [notificaciones, setNotificaciones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para el campo estático
  const [staticNotificationOpen, setStaticNotificationOpen] = useState(false);

  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const res = await api.get('/notificaciones');
        setNotificaciones(res.data);
      } catch (err) {
        console.error('Error al obtener notificaciones:', err);
      } finally {
        setLoading(false);
      }
    };
    obtenerNotificaciones();
  }, []);

  const openModal = (notificacion: any) => {
    setSelectedNotificacion(notificacion);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNotificacion(null);
  };

  const openStaticModal = () => {
    setStaticNotificationOpen(true);
  };

  const closeStaticModal = () => {
    setStaticNotificationOpen(false);
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col relative">
      {/* Línea amarilla superior */}
      <div
        className="absolute top-0 left-0 border-t-4 border-orange-500"
        style={{ width: '2023px', height: '138px', border: '3px solid #FCA311', left: '-10px' }}
      ></div>

      <div className="pt-[140px] px-6">
        <h2 className="text-3xl font-bold text-blue-900">Notificaciones</h2>
      </div>

      {/* Campo estático actualizado según diseño - formato más amplio */}
      <div className="w-full bg-gray-100 border-t border-b border-gray-200 my-4"
      style={{width: '2023px', marginLeft: '-10px'}}>
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center">
            <div className="h-12 w-12 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <h3 className="font-semibold text-gray-900">Tiempo de renta concluido</h3>
              <p className="text-gray-600 text-sm">Tu vehículo Nissan Sentra ya concluyó su tiempo de renta con el arrendatario El Señor X</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm whitespace-nowrap">03/31/2025, 21:00</span>
            <button 
              onClick={openStaticModal}
              className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-600"
            >
              Ver más
            </button>
          </div>
        </div>
      </div>

      {/* Modal estático */}
      {staticNotificationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <h3 className="text-xl font-semibold text-gray-800">Tiempo de renta concluido</h3>
            <p className="text-gray-700 mt-4">
              Tu vehículo Nissan Sentra ya concluyó su tiempo de renta con el arrendatario El Señor X.
              Puedes revisar los detalles de la devolución y el estado actual del vehículo.
            </p>
            <button
              onClick={closeStaticModal}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-400 text-lg">Cargando...</p>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-gray-500 text-lg">No hay notificaciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notificaciones.map((n) => (
              <div key={n.id} className="p-4 border rounded-lg shadow-md bg-gray-50 hover:bg-gray-100 transition">
                <strong className="text-lg text-gray-800">{n.titulo}</strong>
                <p className="text-gray-600 mt-2">{n.descripcion}</p>
                <small className="text-gray-500 text-xs mt-2 block">{n.fecha}</small>
                <button
                  onClick={() => openModal(n)}
                  className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                >
                  Ver más
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && selectedNotificacion && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 sm:w-1/3">
            <h3 className="text-xl font-semibold text-gray-800">{selectedNotificacion.titulo}</h3>
            <p className="text-gray-700 mt-4">{selectedNotificacion.descripcion}</p>
            <p className="text-sm text-gray-500 mt-2">{selectedNotificacion.fecha}</p>
            <button
              onClick={closeModal}
              className="mt-6 px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}