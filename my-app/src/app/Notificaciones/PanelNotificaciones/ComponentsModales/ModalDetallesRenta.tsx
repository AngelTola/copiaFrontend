'use client';

interface ModalProps {
  isOpen: boolean;
  notification: {
    titulo: string;
    descripcion: string;
    fecha: string;
    vehiculo: string;
    arrendatario: string;
    imagenURL?: string;
  };
  onClose: () => void;
  onDelete: () => void;
}

const ModalDetallesRenta = ({ isOpen, notification, onClose, onDelete }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
        <div className="bg-[#FCA311] p-4 rounded-t-lg">
          <h2 className="text-xl font-semibold text-white">{notification.titulo}</h2>
        </div>

        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-row-reverse gap-4">
            {notification.imagenURL && (
              <img
                src={notification.imagenURL}
                alt="Vehículo"
                className="w-32 h-32 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <p className="text-gray-800">
                <strong>Vehículo:</strong> {notification.vehiculo}
              </p>
              <p className="text-gray-800 mt-2">
                <strong>Arrendatario:</strong> {notification.arrendatario}
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
            onClick={onDelete}
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
