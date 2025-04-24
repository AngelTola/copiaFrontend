'use client';

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
  if (!isOpen) return null;

  const handleDelete = () => {
    onDelete(); // Ejecutar la función original de borrado
    toast.success('¡Se eliminó correctamente!'); // Mostrar mensaje
    onClose(); // Cerrar el modal
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
        <div className="bg-[#FCA311] p-4 rounded-t-lg relative">
          <button 
            onClick={onClose}
            className="absolute right-3 top-3 text-white hover:text-gray-200"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-white">{notification.titulo}</h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-row-reverse gap-4">
            {notification.imagenURL ? (
              <img
                src={notification.imagenURL}
                alt="Imagen de notificación"
                className="w-48 h-48 object-cover rounded-lg"
              />
            ) : (
              <div className="w-48 h-48 bg-gray-200 flex items-center justify-center rounded-lg">
                <span className="text-gray-500">Sin imagen</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-gray-800">
                <strong>Tipo de Notificación:</strong> {notification.tipo}
              </p>
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
        </div>

        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={handleDelete} 
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
          >
            Borrar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetallesRenta;

