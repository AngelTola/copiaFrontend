'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Trash2, AlertTriangle } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 overflow-hidden"
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">{notification.titulo}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
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
              <h3 className="text-sm font-medium text-gray-500">Mensaje</h3>
              <p className="mt-1 text-gray-900">{notification.mensaje}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Tipo</h3>
              <p className="mt-1 text-gray-900">{notification.tipo}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Fecha</h3>
              <p className="mt-1 text-gray-900">
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
              Eliminar notificación
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
