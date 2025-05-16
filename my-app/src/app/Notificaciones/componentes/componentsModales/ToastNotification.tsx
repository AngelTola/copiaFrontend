import { motion } from "framer-motion";
import { Bell } from "lucide-react";
import { Notificacion } from "../../types/notification";

interface ToastNotificationProps {
  notificacion: Notificacion;
  onClose: () => void;
}

const ToastNotification = ({ notificacion, onClose }: ToastNotificationProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-[#FCA311] max-w-sm z-50"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <Bell className="w-6 h-6 text-[#FCA311]" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800">{notificacion.titulo}</h4>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notificacion.descripcion}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default ToastNotification; 