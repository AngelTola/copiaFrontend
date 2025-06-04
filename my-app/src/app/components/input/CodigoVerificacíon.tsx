'use client';
import { ReactNode } from 'react';

interface CodigoVerificacionProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icono?: ReactNode;
}

export default function CodigoVerificacion({
  label,
  name,
  value,
  onChange,
  icono,
}: CodigoVerificacionProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const soloNumeros = e.target.value.replace(/[^0-9]/g, '');
    onChange({ ...e, target: { ...e.target, value: soloNumeros } });
};
  return (
    <div className="w-full relative mb-4">
      <input
        className="peer w-full p-4 pt-6 pl-15 pr-4 bg-inherit border-2 rounded-md outline-none transition disabled:opacity-70 disabled:cursor-not-allowed border-[var(--azul-oscuro)] text-[var(--azul-oscuro)] font-[var(--tamaña-bold)]"
        type="text"
        placeholder=""
        name={name}
        id={name}
        value={value}
        onChange={handleInputChange}
        maxLength={6}
        
      />
      <label
        className="pl-5 absolute text-[var(--azul-oscuro)] text-base duration-150 transform -translate-y-3 top-5 z-10 origin-[0] left-10 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-[var(--azul-oscuro)]"
        htmlFor={name}
      >
        {label}
      </label>
      {icono && (
        <div className="absolute top-6 left-4">
          {icono}
        </div>
      )}
    </div>
  );
}