import React, { useEffect } from 'react';
import { useDrivers } from '@/hooks/useDrivers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DriversModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { drivers, loading } = useDrivers();

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-50 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
          Drivers suscritos
        </h2>

        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : drivers.length === 0 ? (
          <p className="text-center text-gray-500">No tienes drivers asociados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left border border-blue-900 rounded-lg overflow-hidden">
              <thead className="bg-blue-900 text-white">
                <tr>
                  <th className="py-2 px-4 border-r">Nombre</th>
                  <th className="py-2 px-4 border-r">Teléfono</th>
                  <th className="py-2 px-4 border-r">Correo</th>
                  <th className="py-2 px-4">Fecha asignación</th>
                </tr>
              </thead>
              <tbody className="text-blue-900">
                {drivers.map((driver, index) => (
                  <tr key={index} className="bg-white hover:bg-gray-100 border-t border-gray-200">
                    <td className="py-2 px-4 border-r">{driver.nombreCompleto}</td>
                    <td className="py-2 px-4 border-r">{driver.telefono}</td>
                    <td className="py-2 px-4 border-r">{driver.email}</td>
                    <td className="py-2 px-4">
                      {driver.fechaAsignacion
                        ? new Date(driver.fechaAsignacion).toLocaleDateString()
                        : 'No registrada'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriversModal;

