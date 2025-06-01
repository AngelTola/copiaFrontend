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
      className='w-40 h-40  border-solid rounded-lg border-[var(--azul-oscuro)] 
      shadow-[0px_0px_10px_rgba(0,0,0,0.4)] hover:shadow-[0px_0px_0px_rgba(0,0,0,0.0)] hover:inset-shadow-[0px_0px_10px_rgba(0,0,0,0.4)] flex flex-col justify-center items-center
      text-[var(--azul-oscuro)] py-2 px-4 mb-2 bg-[var(--gris-claro)] 
      hover:bg-[var(--gris-hover)] transition-all '
    >
      {icono && 
      <span className="text-xl ">{icono}</span>
      }
      <span className={`font-bold text-x1${textColor}`}>{texto}</span>
    </button>
  );
}