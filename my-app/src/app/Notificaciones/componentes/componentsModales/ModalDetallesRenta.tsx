'use client';

import { useState } from 'react';
import ModalConfirmacionEliminar from './ModalConfirmacionEliminar';

interface ModalProps {
  isOpen: boolean;
  notification: {
    titulo: string;
    descripcion: string;
    fecha: string;
    tipo: string;
    tipoEntidad: string;
    imagenURL?: string;
  };
  onClose: () => void;
  onDelete: () => void; // Ahora solo invoca la apertura del modal de confirmación
}

const ModalDetallesRenta = ({ isOpen, notification, onClose, onDelete }: ModalProps) => {
  if (!isOpen) return null;
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  function eliminarNotificacion() {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="bg-[#FCA311] p-4 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-4 top-4 w-8 h-8 bg-red-600 text-white hover:bg-white hover:text-red-600 rounded"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-white">{notification.titulo}</h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-row-reverse gap-4">
            {notification.imagenURL && (
              <img
                src={notification.imagenURL}
                alt="Imagen"
                className="w-full h-auto max-w-xs object-contain rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-gray-800 mt-2">
                <strong>Acción Solicitada:</strong> {notification.tipoEntidad}</p>
              <p className="text-gray-800 mt-2">
                <strong>Fecha:</strong> {notification.fecha}</p>
            </div>
          </div>
          <div className="border-t pt-4">
            <p className="text-gray-800 whitespace-pre-line">{notification.descripcion}</p>
          </div>
        </div>

        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={() => setMostrarConfirmacion(true)}
            className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Borrar
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
      {/* Modal de confirmación */}
      <ModalConfirmacionEliminar
        isOpen={mostrarConfirmacion}
        onCancel={() => setMostrarConfirmacion(false)}
        onConfirm={() => {
          eliminarNotificacion();
          setMostrarConfirmacion(false);
          onClose();
        }}
      />
  </div>
  );
};

export default ModalDetallesRenta;
