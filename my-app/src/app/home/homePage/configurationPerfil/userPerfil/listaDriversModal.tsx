import React, { useEffect, useMemo, useState } from 'react';
import { useDrivers } from '@/hooks/useDrivers';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const DriversModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { drivers, loading } = useDrivers();
  const [sortKey, setSortKey] = useState<'fechaAsignacion' | 'nombreCompleto' | null>(null);
  
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);

  const toggleSortByFecha = () => {
    if (sortKey === 'fechaAsignacion') {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey('fechaAsignacion');
      setSortDirection('asc');
    }
  };
  const toggleSortByNombre = () => {
    if (sortKey === 'nombreCompleto') {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey('nombreCompleto');
      setSortDirection('asc');
    }
  };

  const sortedDrivers = useMemo(() => {
    const sorted = [...drivers];
    if (sortKey === 'fechaAsignacion') {
      return [...drivers].sort((a, b) => {
        const fechaA = new Date(a.fechaAsignacion || '').getTime();
        const fechaB = new Date(b.fechaAsignacion || '').getTime();
        return sortDirection === 'asc' ? fechaA - fechaB : fechaB - fechaA;
      });
    } else if (sortKey === 'nombreCompleto') {
      return sorted.sort((a, b) => {
        const nameA = a.nombreCompleto.toLowerCase();
        const nameB = b.nombreCompleto.toLowerCase();
        return sortDirection === 'asc'
          ? nameA.localeCompare(nameB)
          : nameB.localeCompare(nameA);
      });
    }
  return sorted;
  }, [drivers, sortKey, sortDirection]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold text-center text-blue-900 mb-6">
          Drivers que están suscritos a mi cuenta
        </h2>

        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : drivers.length === 0 ? (
          <p className="text-center text-gray-500">No tienes drivers asociados.</p>
        ) : (
          <div className="overflow-x-auto border border-[#11295B] rounded-xl">
            <table className="min-w-full text-left rounded-lg overflow-hidden">
              <thead className="bg-[#11295B] text-white">
                <tr>
                  <th
                    className="py-2 px-4 border-r cursor-pointer select-none"
                    onClick={toggleSortByFecha}
                  >
                    Fecha de Suscripción{' '}
                    <span className="ml-1">
                      {sortKey === 'fechaAsignacion' ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </th>
                  <th
                    className="py-2 px-4 border-r cursor-pointer select-none"
                    onClick={toggleSortByNombre}
                  >
                    Nombre Completo{' '}
                    <span className="ml-1">
                      {sortKey === 'nombreCompleto' ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </th>
                  <th className="py-2 px-4 border-r">Teléfono</th>
                  <th className="py-2 px-4">Correo Electrónico</th>
                </tr>
              </thead>
              <tbody className="text-[#11295B] bg-white">
                {sortedDrivers.map((driver, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 border-t border-gray-200"
                  >
                    <td className="py-2 px-4 border-r">
                      {driver.fechaAsignacion
                        ? new Date(driver.fechaAsignacion).toLocaleDateString()
                        : 'No registrada'}
                    </td>
                    <td className="py-2 px-4 border-r">{driver.nombreCompleto}</td>
                    <td className="py-2 px-4 border-r">{driver.telefono}</td>
                    <td className="py-2 px-4">{driver.email}</td>
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