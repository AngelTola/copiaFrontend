import React, { useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotificaciones';
import  NotificationIcon  from '@/app/components/notificacionCampana/notificacionIcon';
import { BellIcon } from 'lucide-react';
import Link from 'next/link';

export function NotificacionesCampana() {
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const {
    notifications,
    unreadCount,
    loading: cargando,
    isConnected,
    refreshNotifications: cargarNotificaciones
  } = useNotifications();

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

  const handleNotificacionClick = (notificacionId: string) => {
    setMostrarPanel(false);
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
                <div className="p-4 text-center text-gray-500 flex justify-center items-center">
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cargando...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">No tienes notificaciones</div>
              ) : (
                <ul>
                  {notifications.slice(0,3).map((notificacion) => ( //.slice(0,3) nos permite mostrar un maximo de 3 notificaciones
                    <li 
                      key={notificacion.id}
                      onClick={() => handleNotificacionClick(notificacion.id)}
                      className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                        !notificacion.leida ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <NotificationIcon tipo={notificacion.tipo} />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm font-medium text-gray-900">{notificacion.titulo}</p>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap break-words line-clamp-2">{notificacion.mensaje}</p>
                          <p className="text-xs text-gray-400 mt-1 whitespace-nowrap">
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
    </>
  );
}

function getPrioridadIndicator(prioridad: string) {
  switch (prioridad) {
    case 'ALTA':
      return <div className="w-3 h-3 bg-red-500 rounded-full" title="Prioridad Alta" />;
    case 'MEDIA':
      return <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Prioridad Media" />;
    case 'BAJA':
      return <div className="w-3 h-3 bg-green-500 rounded-full" title="Prioridad Baja" />;
    default:
      return <div className="w-3 h-3 bg-gray-300 rounded-full" title="Sin prioridad definida" />;
  }
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

export default NotificacionesCampana;
