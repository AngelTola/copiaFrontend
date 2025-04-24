// components/PaginaNotificaciones.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useNotifications } from '@/app/hooks/useNotificaciones';
import { NotificacionFiltro, PrioridadNotificacion } from '@/app/types/notification';

export function PaginaNotificaciones() {
  const {
    notifications,
    unreadCount,
    isConnected,
    error,
    loading,
    refreshNotifications
  } = useNotifications();

  const [filtros, setFiltros] = useState<NotificacionFiltro>({
    limit: 20,
    offset: 0,
  });

  useEffect(() => {
    refreshNotifications(); // Nota: el hook no acepta filtros actualmente
  }, []);

  const handleFiltroChange = (campo: keyof NotificacionFiltro, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      offset: 0,
    }));
  };

  const handlePaginaAnterior = () => {
    if (filtros.offset && filtros.offset >= (filtros.limit || 20)) {
      setFiltros(prev => ({
        ...prev,
        offset: prev.offset! - (prev.limit || 20),
      }));
    }
  };

  const handlePaginaSiguiente = () => {
    setFiltros(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 20),
    }));
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Head><title>Mis Notificaciones</title></Head>
      <h1 className="text-2xl font-bold mb-6">Mis Notificaciones</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!isConnected && (
        <div className="bg-yellow-100 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
          <span className="animate-spin h-5 w-5 mr-2">🔄</span>
          Reconectando con el servidor de notificaciones...
        </div>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-wrap gap-4 items-center">
          <select
            className="border px-3 py-2 rounded text-sm"
            value={filtros.leido?.toString() || ''}
            onChange={(e) =>
              handleFiltroChange('leido', e.target.value === '' ? undefined : e.target.value === 'true')
            }
          >
            <option value="">Todos</option>
            <option value="true">Leídas</option>
            <option value="false">No leídas</option>
          </select>

          <select
            className="border px-3 py-2 rounded text-sm"
            value={filtros.prioridad || ''}
            onChange={(e) =>
              handleFiltroChange('prioridad', e.target.value as PrioridadNotificacion || undefined)
            }
          >
            <option value="">Todas</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAJA">Baja</option>
          </select>

          <select
            className="border px-3 py-2 rounded text-sm"
            value={filtros.tipo || ''}
            onChange={(e) => handleFiltroChange('tipo', e.target.value || undefined)}
          >
            <option value="">Todos</option>
            <option value="ALQUILER_FINALIZADO">Alquiler finalizado</option>
            <option value="PAGO_RECIBIDO">Pago recibido</option>
            <option value="SISTEMA">Sistema</option>
          </select>

          <button
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            onClick={refreshNotifications}
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando notificaciones...</div>
        ) : notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay notificaciones que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Mensaje</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500">Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notifications.map((noti) => (
                  <tr key={noti.id} className={!noti.leida ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4 text-sm">{noti.titulo}</td>
                    <td className="px-6 py-4 text-sm">{noti.mensaje}</td>
                    <td className="px-6 py-4 text-sm">{noti.prioridad}</td>
                    <td className="px-6 py-4 text-sm">{new Date(noti.creadoEn).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm">{noti.leida ? 'Leída' : 'No leída'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}