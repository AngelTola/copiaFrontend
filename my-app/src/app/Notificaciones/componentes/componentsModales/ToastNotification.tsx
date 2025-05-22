import React from 'react';
import { motion } from 'framer-motion';
import type { Notificacion } from '@/app/types/notification';

interface ToastNotificationProps {
  notificacion: Notificacion;
}

export default function ToastNotification({ notificacion }: ToastNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-sm"
    >
      <h3 className="font-semibold text-gray-900">{notificacion.titulo}</h3>
      <p className="text-sm text-gray-600 mt-1">{notificacion.mensaje}</p>
    </motion.div>
  );
} 