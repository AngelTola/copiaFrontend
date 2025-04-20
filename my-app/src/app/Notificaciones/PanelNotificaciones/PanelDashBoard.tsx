'use client';

import { useState, useEffect } from 'react';
import api from '@/libs/axiosConfig';
import ModalDetallesRenta from './ComponentsModales/ModalDetallesRenta';

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

export default function PanelDashBoard({usuarioId}: PanelDashBoardProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [selectedNotificacion, setSelectedNotificacion] = useState<Notificacion | null>(null);
  const [loading, setLoading] = useState(true);

  //const usuarioId = '24fdafde-3838-475c-90b5-d4c56dba5f5a';

  const transformarNotificaciones = (data: any[]): Notificacion[] => {
    return data.map((item) => ({
      id: item.id,
      titulo: item.titulo,
      descripcion: item.mensaje,
      fecha: new Date(item.creadoEn).toLocaleString(),
      tipo: item.tipo || 'No especificado',
      tipoEntidad: item.tipoEntidad, //recibir por consulta
      imagenURL: undefined, // recibir por consulta
      leida: item.leida
    }));
  };

  // Obtener notificaciones del backend
  useEffect(() => {
    const obtenerNotificaciones = async () => {
      try {
        const respuesta = await api.get(`/notificaciones/panel-notificaciones/${usuarioId}`);
        //console.log('URL solicitada:', respuesta.config.url);
        //console.log('Respuesta del backend:', respuesta.data.notificaciones);
    
        if (Array.isArray(respuesta.data.notificaciones)) {
          const notis = transformarNotificaciones(respuesta.data.notificaciones);
          setNotificaciones(notis);
        } else {
          console.error("La respuesta no es un array:", respuesta.data.notificaciones);
          setNotificaciones([]);
        }
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      } finally {
        setLoading(false);
      }
    };    
    obtenerNotificaciones();
  }, []);

  // Borrar notificación (implementar lógica con backend)
  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/notificaciones/eliminar-notificacion/${id}`, {
        data: { usuarioId }
      });
      setNotificaciones(prev => prev.filter(n => n.id !== id));
      setSelectedNotificacion(null);
    } catch (error) {
      console.error('Error al borrar notificación:', error);
    }
  };

  return (
    <div className="w-screen bg-white flex flex-col relative">
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
                      <p className="text-gray-600 mt-1">{notificacion.tipo}</p>
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
        isOpen={true}
        notification={{
          titulo: selectedNotificacion.titulo,
          descripcion: selectedNotificacion.descripcion,
          fecha: selectedNotificacion.fecha,
          tipo: selectedNotificacion.tipo,
          tipoEntidad: selectedNotificacion.tipoEntidad,
          imagenURL: selectedNotificacion.imagenURL
        }}
        onClose={() => setSelectedNotificacion(null)}
        onDelete={() => handleDelete(selectedNotificacion.id)}
      />
      )}
    </div>
  );
}