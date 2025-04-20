
// components/PaginaNotificaciones.tsx
import React, { useEffect, useState } from 'react';
import { useNotificaciones } from '@/hooks/useNotificaciones';
import { NotificacionFiltro, PrioridadNotificacion } from '@/types/notification';
import Head from 'next/head';

export function PaginaNotificaciones() {
  const {
    notificaciones,
    cargando,
    error,
    isConnected,
    cargarNotificaciones,
    marcarComoLeida,
    verDetalle
  } = useNotificaciones();

  const [filtros, setFiltros] = useState<NotificacionFiltro>({
    limit: 20,
    offset: 0
  });
  
  const [totalItems, setTotalItems] = useState(0);
  
  useEffect(() => {
    cargarNotificaciones(filtros);
  }, [filtros, cargarNotificaciones]);
  
  useEffect(() => {
    // Actualizar el total cuando se carguen las notificaciones
    if (notificaciones.length > 0) {
      setTotalItems(notificaciones.length);
    }
  }, [notificaciones]);
  
  const handleFiltroChange = (campo: keyof NotificacionFiltro, valor: any) => {
    setFiltros(prev => ({
      ...prev,
      [campo]: valor,
      offset: 0 // Reiniciar paginación
    }));
  };
  
  const handlePaginaAnterior = () => {
    if (filtros.offset && filtros.offset >= (filtros.limit || 20)) {
      setFiltros(prev => ({
        ...prev,
        offset: (prev.offset || 0) - (prev.limit || 20)
      }));
    }
  };
  
  const handlePaginaSiguiente = () => {
    setFiltros(prev => ({
      ...prev,
      offset: (prev.offset || 0) + (prev.limit || 20)
    }));
  };

  const handleMarcarTodasLeidas = () => {
    const noLeidas = notificaciones.filter(n => !n.leido);
    if (noLeidas.length === 0) return;
    
    // Marcar todas como leídas en secuencia
    noLeidas.forEach(n => {
      marcarComoLeida(n.id);
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Head>
        <title>Mis Notificaciones</title>
      </Head>
      
      <h1 className="text-2xl font-bold mb-6">Mis Notificaciones</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {!isConnected && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 flex items-center">
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Reconectando con el servidor de notificaciones...
        </div>
      )}
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                id="estado"
                className="px-3 py-2 border rounded text-sm"
                value={filtros.leido?.toString() || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFiltroChange('leido', value === '' ? undefined : value === 'true');
                }}
              >
                <option value="">Todos</option>
                <option value="true">Leídas</option>
                <option value="false">No leídas</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="prioridad" className="block text-sm font-medium text-gray-700 mb-1">Prioridad</label>
              <select
                id="prioridad"
                className="px-3 py-2 border rounded text-sm"
                value={filtros.prioridad || ''}
                onChange={(e) => handleFiltroChange('prioridad', 
                  e.target.value as PrioridadNotificacion || undefined
                )}
              >
                <option value="">Todas</option>
                <option value="ALTA">Alta</option>
                <option value="MEDIA">Media</option>
                <option value="BAJA">Baja</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <select
                id="tipo"
                className="px-3 py-2 border rounded text-sm"
                value={filtros.tipo || ''}
                onChange={(e) => handleFiltroChange('tipo', e.target.value || undefined)}
              >
                <option value="">Todos</option>
                <option value="ALQUILER_FINALIZADO">Alquiler finalizado</option>
                <option value="PAGO_RECIBIDO">Pago recibido</option>
                <option value="SISTEMA">Sistema</option>
              </select>
            </div>
            
            <div className="ml-auto flex items-end gap-2">
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                onClick={() => cargarNotificaciones(filtros)}
              >
                Filtrar
              </button>
              
              <button 
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 text-sm"
                onClick={handleMarcarTodasLeidas}
              >
                Marcar todas como leídas
              </button>
            </div>
          </div>
        </div>
        
        {cargando ? (
          <div className="p-8 text-center text-gray-500">
            <svg className="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando notificaciones...
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No hay notificaciones que coincidan con los filtros seleccionados.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notificaciones.map((notificacion) => (
                  <tr 
                    key={notificacion.id}
                    className={!notificacion.leido ? 'bg-blue-50' : ''}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{notificacion.titulo}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{notificacion.mensaje}</td>
                    