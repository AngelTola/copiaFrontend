'use client';

import { AlertTriangle } from 'lucide-react';

interface ModalConfirmacionEliminarProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ModalConfirmacionEliminar = ({
  isOpen,
  onConfirm,
  onCancel,
}: ModalConfirmacionEliminarProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6">
        <h2 className="text-lg font-semibold mb-2 text-gray-800">¿Eliminar notificación?</h2>
        <p className="text-sm text-gray-600 mb-6">
          Esta acción no se puede deshacer. ¿Estás seguro de que quieres eliminar esta notificación?
        </p>
        
        <div className="flex justify-center gap-8 mt-4">
          <button
            onClick={onCancel}
            className="cursor-pointer bg-gray-400 hover:bg-gray-500 text-white font-semibold py-1.5 px-4 rounded"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center cursor-pointer bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-4 rounded"
          >
            <AlertTriangle className="w-4 h-4 mr-2"/>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmacionEliminar;
