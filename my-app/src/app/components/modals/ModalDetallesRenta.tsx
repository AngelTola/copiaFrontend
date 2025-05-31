'use client';

import React, { useState } from 'react';
import ModalConfirmacionEliminar from './ModalConfirmacionEliminar';
import { motion , AnimatePresence} from 'framer-motion';
import type { Notificacion } from '@/app/types/notification';
import { Trash2, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ModalDetallesRentaProps {
  isOpen: boolean;
  notification: Notificacion;
  onClose: () => void;
  onDelete: () => void;
}

export default function ModalDetallesRenta({ isOpen, notification, onClose, onDelete }: ModalDetallesRentaProps) {
  const [mostrarFallBack, setMostrarFallBack] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/50 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4"
        onClick={(e) => e.stopPropagation()}
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
            {notification.imagenURL && !mostrarFallBack ? (
              <Image
                src={notification.imagenURL}
                alt="Imagen"
                width={60}
                height={60}
                unoptimized
                className="w-full h-auto max-w-xs object-contain rounded-lg"
                onError={() => setMostrarFallBack(true)}
              />
            ) : (
              <div className="h-48 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-500">
                <ImageIcon className="h-12 w-12 mb-2" />
                <span className="text-sm">imagen.jpg</span>
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs mt-1 text-gray-900"> {formatDate(notification.creadoEn)} </p>
              <p className="text-gray-800 whitespace-pre-line mt-3" dangerouslySetInnerHTML={{ __html: notification.descripcion }}></p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-8 p-4 border-t">
          <button
            onClick={() => setMostrarConfirmacion(true)}
            className="flex items-center cursor-pointer bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-2"/>
            Borrar
          </button>

          {notification.titulo === 'Renta Cancelada' && (
              <button
              onClick={onClose}
              className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Volver a rentar
              </button>
          )}

          <button
            onClick={onClose}
            className="cursor-pointer bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {notification.titulo === 'Calificación Recibida'
              ? "Ver calificación"
              : notification.titulo === 'Reserva Confirmada'
              ? "Ver reserva"
              : "Cerrar"}
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
