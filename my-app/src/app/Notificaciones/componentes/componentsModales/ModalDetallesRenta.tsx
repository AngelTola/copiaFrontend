'use client';

import { useState } from 'react';
import ModalConfirmacionEliminar from './ModalConfirmacionEliminar';
import { motion, AnimatePresence } from "framer-motion";

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

function formatDate(dateString: Date | string) {
  const fecha = new Date(dateString);
  const dia = fecha.getDate().toString().padStart(2, '0');
  const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
  const año = fecha.getFullYear();
  const hora = fecha.getHours().toString().padStart(2, '0');
  const minutos = fecha.getMinutes().toString().padStart(2, '0');

  return `${dia}/${mes}/${año}, ${hora}:${minutos}`;
}


const ModalDetallesRenta = ({ isOpen, notification, onClose, onDelete }: ModalProps) => {
  if (!isOpen) return null;
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center"
    onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
      onClick={(e)=>e.stopPropagation()}
      >
        <div className="bg-[#FCA311] p-4 rounded-t-lg relative">
          <button
            onClick={onClose}
            className="cursor-pointer absolute right-4 top-4 w-8 h-8 bg-red-600 text-white hover:bg-white hover:text-red-600 rounded"
          >
            ✕
          </button>
          <h2 className="text-xl font-semibold text-white text-center w-full underline">{notification.titulo}</h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col lg:flex-row-reverse gap-4">
          {notification.imagenURL && (
              <img
                src={notification.imagenURL}
                alt="Imagen"
                className="w-full h-auto max-w-xs object-contain rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-xs text-gray-800 mt-2">{formatDate(notification.fecha)}</p>
              <p className="text-gray-800 whitespace-pre-line mt-3">{notification.descripcion}</p>
            </div>
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
      
      <AnimatePresence>
        {mostrarConfirmacion && (
          <motion.div
              key="modal-confirmacion"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30"
            >
            <ModalConfirmacionEliminar
              isOpen={true}
              onCancel={() => setMostrarConfirmacion(false)}
              onConfirm={() => {
                onDelete();
                setMostrarConfirmacion(false);
                onClose();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
  </div>
  );
};

export default ModalDetallesRenta;
