'use client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface BotonConfirmProps {
  texto: string;
  ruta?: string;
  icono?: ReactNode;
  textColor?: string;
  onClick?: () => void;
}

export default function BotonConfirm({
  texto,
  ruta,
  icono,
  textColor,
  onClick,
}: BotonConfirmProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Ejecuta lógica personalizada (como setState)
    } else if (ruta) {
      router.push(ruta); // Redirige si no se usa onClick
    }
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer transition-all bg-blue-500 text-white px-6 py-2 rounded-lg
      border-blue-600
        border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px]
        active:border-b-[2px] active:brightness-90 active:translate-y-[2px]"
    >
      {icono && <span className="text-xl ">{icono}</span>}
      <span className={`font-bold ${textColor} group-hover:text-[var(--blanco)]`}>{texto}</span>
    </button>
    
  );
}
