import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface BotonConfirmProps {
  texto: string;
  ruta?: string;
  icono?: ReactNode;
  textColor?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export default function BotonConfirm({
  texto,
  ruta,
  icono,
  textColor,
  onClick,
  disabled = false,
}: BotonConfirmProps) {
  const router = useRouter();

  const handleClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick(); // Ejecuta lógica personalizada (como setState)
    } else if (ruta) {
      router.push(ruta); // Redirige si no se usa onClick
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`py-4 w-full rounded-lg font-bold cursor-pointer transition-all
        ${disabled
          ? 'bg-[var(--naranjaOscuro)] text-white opacity-80 cursor-not-allowed'
          : 'bg-[var(--naranja)] text-white border-[var(--naranjaOscuro)] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]'
        }
      `}
    >
      {icono && <span className="text-xl ">{icono}</span>}
      <span className={`font-bold ${textColor} group-hover:text-[var(--blanco)]`}>{texto}</span>
    </button>
    
  );
}
