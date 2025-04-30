import { useState } from "react";
import { toast } from "react-hot-toast";

interface ModalComentarioProps {
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

const ModalComentario = ({ isOpen, notification, onClose, onDelete }: ModalComentarioProps) => {
  const [comentario, setComentario] = useState<string>("");

  // Manejo de cambios en el textarea de comentario
  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentario(e.target.value);
  };

  // Verificación al enviar comentario
  const handleEnviarComentario = () => {
    if (!comentario.trim()) {
      alert("El comentario no puede estar vacío.");
      return;
    }

    // Aquí va la lógica de envío del comentario (se puede extender para interacción con la API)
    console.log("Comentario enviado:", comentario);

    // Limpiar el comentario después de enviarlo y cerrar el modal
    setComentario("");
    onClose(); 
    toast.success('Comentario enviado correctamente');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Comentario sobre Notificación</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-gray-800"
          >
            X
          </button>
        </div>

        {/* Detalles de la notificación */}
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-700">Detalles de la notificación:</h3>
          <p className="text-gray-600">{notification.descripcion}</p>
        </div>

        {/* Espacio para el comentario */}
        <div className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-300 rounded-lg"
            rows={4}
            value={comentario}
            onChange={handleComentarioChange}
            placeholder="Escribe tu comentario aquí..."
          />
        </div>

        {/* Botones de acción */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleEnviarComentario}
            className="bg-[#FCA311] text-white px-4 py-2 rounded-lg hover:bg-[#E59400] transition-colors"
          >
            Enviar Comentario
          </button>
          <button
            onClick={() => {
              onDelete(); 
              toast.success("¡Notificación eliminada!");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar Notificación
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalComentario;
