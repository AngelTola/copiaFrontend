'use client';

import React from 'react';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
  titulo: string;
  descripcion: string;
  fecha: string;
  vehiculo: string;
  arrendatario: string;
  imagenURL?: string;
}

export const ModalDetallesRenta = ({
  visible,
  onClose,
  onDelete,
  titulo,
  descripcion,
  fecha,
  vehiculo,
  arrendatario,
  imagenURL
}: ModalProps) => {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl shadow-2xl">
        {/* Encabezado */}
        <div className="bg-[#FCA311] p-4">
          <h2 className="text-2xl font-bold text-white">{titulo}</h2>
        </div>

        {/* Cuerpo - Imagen a la derecha */}
        <div className="grid grid-cols-2 gap-8 p-6">
          {/* Texto a la izquierda */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-2">Vehículo</label>
                <p className="text-lg text-gray-800 font-medium">{vehiculo}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-2">Arrendatario</label>
                <p className="text-lg text-gray-800 font-medium">{arrendatario}</p>
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-2">Fecha y hora</label>
                <p className="text-lg text-gray-800 font-medium">{fecha}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm text-gray-500 mb-2">Detalles completos</label>
              <p className="text-gray-800 leading-relaxed whitespace-pre-line">
                {descripcion}
              </p>
            </div>
          </div>

          {/* Imagen a la derecha */}
          <div className="h-72 bg-gray-100 flex items-center justify-center">
            {imagenURL ? (
              <img 
                src={imagenURL} 
                alt="Vehículo" 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400">Sin imagen disponible</span>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end gap-4 p-4 border-t">
          <button
            onClick={onDelete}
            className="px-6 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors"
          >
            Borrar
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};