'use client';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface BotonNavegacionProps {
  texto: string;
  ruta?: string;
  icono?: ReactNode;
  textColor?: string;
  onClick?: () => void;
}

export default function BotonNavegacion({
  texto,
  ruta,
  icono,
  textColor,
  onClick,
}: BotonNavegacionProps) {
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
      className='group w-full h-15 border-2 border-solid rounded-lg border-[var(--azul-oscuro)] 
      shadow-[2px_2px_4px_rgba(0,0,0,0.4)] flex items-center gap-3 text-left 
      py-2 px-4 mb-2 bg-[var(--blanco)]
      transition-all cursor-pointer hover:bg-[var(--naranja)]'
    >
      {icono && <span className="text-xl ">{icono}</span>}
      <span className={`font-bold ${textColor} group-hover:text-[var(--blanco)]`}>{texto}</span>
    </button>
    
  );
}
