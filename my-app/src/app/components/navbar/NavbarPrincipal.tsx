'use client';

import { useState } from 'react';
import Link from 'next/link';
import SegmentedButtonGroup from '@/app/components/filters/SegmentedButtonGroup';

export default function Navbar({ onLoginClick, onRegisterClick }: { 
  onLoginClick: () => void; 
  onRegisterClick: () => void; 
}) {
  const [activeBtn, setActiveBtn] = useState(0);

  const handleButtonClick = (index: number) => {
    setActiveBtn(index);
    if (index === 0) {
      const carouselElement = document.getElementById('carousel');
      if (carouselElement) {
        carouselElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="px-6 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
      <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <Link href="/home">
          <h1 className="text-3xl md:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
            REDIBO
          </h1>
        </Link>

        {/* ✅ Botones segmentados reutilizables */}
        <SegmentedButtonGroup
          buttons={['Home', 'Botón2', 'Botón3', 'Botón4', 'Botón5']}
          activeIndex={activeBtn}
          onClick={handleButtonClick}
        />

        <div className="flex justify-center md:justify-end gap-0 w-full md:w-auto">
          <button onClick={onRegisterClick} className=" cursor-pointer w-1/2 md:w-auto px-4 md:px-8 py-[0.4rem] rounded-l-[20px] bg-[var(--naranja-46)] font-[var(--tamaño-regular)] text-[var(--azul-oscuro)] shadow-[var(--sombra)] text-sm md:text-base">
            Registrarse
          </button>
          <button
            onClick={onLoginClick}
            className="cursor-pointer w-1/2 md:w-auto px-4 py-[0.4rem] rounded-r-[20px] bg-[var(--naranja)] text-[var(--blanco)] font-[var(--tamaña-bold)] shadow-[var(--sombra)] transition-transform duration-100 active:scale-[0.97] active:shadow-[0_1px_3px_rgba(0,0,0,0.2)] text-sm md:text-base"
          >
            Iniciar Sesión
          </button>
        </div>
      </nav>
    </div>
  );
}