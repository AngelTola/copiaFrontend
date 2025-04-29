'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

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
  onDelete: () => void;
}

const ModalDetallesRenta = ({ isOpen, notification, onClose, onDelete }: ModalProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="bg-[#FCA311] p-4 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-4 top-4 w-8 h-8 bg-red-600 text-white hover:bg-white hover:text-red-600 rounded flex items-center justify-center transition-all"
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
                alt="Imagen de notificación"
                className="w-full h-auto max-w-xs object-contain rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-gray-800 mt-2">
                <strong>Acción Solicitada:</strong> {notification.tipoEntidad}
              </p>
              <p className="text-gray-800 mt-2">
                <strong>Fecha:</strong> {notification.fecha}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-gray-800 whitespace-pre-line">{notification.descripcion}</p>
          </div>

          {showConfirm && (
            <div className="mt-4 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg">
              <strong>¿Estás seguro que deseas borrar esta notificación?</strong>
              <p>Esta acción no se puede deshacer.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 p-4 border-t">
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              className="cursor-pointer bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Borrar
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  onDelete();
                  toast.success('¡Se eliminó correctamente!');
                  onClose();
                }}
                className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Confirmar borrado
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="cursor-pointer bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
              >
                Cancelar
              </button>
            </>
          )}

          <button
            onClick={onClose}
            className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallesRenta;
