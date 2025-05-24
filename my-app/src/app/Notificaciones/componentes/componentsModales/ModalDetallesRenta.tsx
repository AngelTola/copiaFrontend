'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import type { Notificacion } from '@/app/types/notification';

interface ModalDetallesRentaProps {
  isOpen: boolean;
  notification: Notificacion;
  onClose: () => void;
  onDelete: () => void;
}

export default function ModalDetallesRenta({ isOpen, notification, onClose, onDelete }: ModalDetallesRentaProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    setIsDeleting(true);
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.error('Error al eliminar la notificación:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50s flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
      >
        <div className="bg-[#FCA311] p-4 rounded-t-lg relative">
          <h2 className="text-xl font-semibold text-white-800 w-full text-center underline">{notification.titulo}</h2>
          <button
            onClick={onClose}
            className="cursos-pointer absolute right-4 top-4 w-8 h-8 bg-red-600 text-white hover:bg-white hover:text-red-500 rounded"
          >
            X
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4">
          {notification.imagenURL && (
            <div className="mb-4 relative w-full h-48 rounded-lg overflow-hidden">
              <Image
                src={notification.imagenURL}
                alt={notification.titulo}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <p className="mt-1 text-gray-900" dangerouslySetInnerHTML={{__html: notification.mensaje}}>
              </p>
            </div>

            <div>
              <p className="text-xs mt-1 text-gray-900">
                {new Date(notification.creadoEn).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end space-x-3">
          {showDeleteConfirm ? (
            <>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                disabled={isDeleting}
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <AlertTriangle className="w-4 h-4 mr-2 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Confirmar eliminación
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 flex items-center"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Borrar
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
