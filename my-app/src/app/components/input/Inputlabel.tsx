import React from "react";

interface InputlabelProps {
  id: string;
  label: string;
  type: string;

  icono?: React.ReactNode;
  className?: string;
  readOnly?: boolean; // <-- Nuevo para permitir solo lectura
  defaultValue?: string;
}

const Inputlabel: React.FC<InputlabelProps> = ({
  id,
  label,
  type,
  
  icono,
  className,
  readOnly = false, // <-- Por defecto editable
  defaultValue,
}) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          name={id}
          type={type}
         
          defaultValue={defaultValue}
          readOnly={readOnly} // <-- Aplicamos aquí
          className={`w-full border border-[#11295B] rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#11295B] ${className} shadow-[0_4px_10px_rgba(0,0,0,0.4)] pl-10 ${
            readOnly ? "bg-gray-100 cursor-not-allowed" : ""
          }`} // <-- Si es readOnly, fondo gris claro y cursor de no permitido
        />
        {icono && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#11295B]">
            {icono}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inputlabel;
