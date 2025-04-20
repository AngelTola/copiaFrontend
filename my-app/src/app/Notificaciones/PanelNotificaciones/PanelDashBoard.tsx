'use client';

import { useState, useEffect } from 'react';
import api from '@/libs/axiosConfig';
import { ModalDetallesRenta } from './ComponentsModales/ModalDetallesRenta';

interface Notificacion {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: string;
  vehiculo: string;
  arrendatario: string;
  imagenURL?: string;
}

export default function PanelDashBoard() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const [loading, setLoading] = useState(true);

  // Obtener notificaciones del backend
  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const respuesta = await api.get('/notificaciones');
        setNotificaciones(respuesta.data);
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };
    obtenerNotificaciones();
  }, []);

  // Borrar notificación (implementar lógica con backend)
  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/notificaciones/${id}`);
      setNotificaciones(prev => prev.filter(n => n.id !== id));
      setSelectedNotificacion(null);
    } catch (error) {
      console.error('Error al borrar notificación:', error);
    }
  };

  return (
    <div className="w-screen h-screen bg-white flex flex-col relative">
      <div className="absolute top-0 left-0 w-full h-2 bg-[#FCA311]"></div>

      <div className="pt-12 px-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Notificaciones</h1>

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
                  className="border border-gray-200 rounded-lg p-4 mb-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{notificacion.titulo}</h3>
                      <p className="text-gray-600 mt-1">{notificacion.vehiculo}</p>
                      <p className="text-sm text-gray-500 mt-2">{notificacion.fecha}</p>
                    </div>
                    <button
                      onClick={() => setSelectedNotificacion(notificacion)}
                      className="bg-[#FCA311] text-white px-4 py-2 rounded-lg hover:bg-[#E59400] transition-colors"
                    >
                      Ver detalles
                    </button>
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>

      {selectedNotificacion && (
        <ModalDetallesRenta
          visible={!!selectedNotificacion}
          onClose={() => setSelectedNotificacion(null)}
          onDelete={() => handleDelete(selectedNotificacion.id)}
          {...selectedNotificacion}
        />
      )}
    </div>
  );
}