"use client";

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useUser } from '@/hooks/useUser';
import { NotificacionesCampana } from '@/app/home/NotificacionesCampana';
//import { NotificacionesCampana } from '@/app/Notificaciones/componentes/notificacionCampana/NotificacionesCampana';
import Link from 'next/link';
import SegmentedButtonGroup from '@/app/components/filters/SegmentedButtonGroup';


export default function NavbarInicioSesion({ onBecomeHost, onBecomeDriver }: { onBecomeHost: () => void; onBecomeDriver: () => void; }) {
  const [activeBtn, setActiveBtn] = useState(0);
  const user = useUser();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleButtonClick = (index: number) => {
    setActiveBtn(index);
    if (index === 0) {
      const carouselElement = document.getElementById('carousel');
      if (carouselElement) {
        carouselElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  useEffect(() => {
    if (user?.fotoPerfil) {
      setProfilePhotoUrl(user.fotoPerfil);
    } else {
      setProfilePhotoUrl(null);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="px-6 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
      <nav className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 md:gap-0">
        <Link href="/home/homePage">
          <h1 className="text-3xl md:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
            REDIBO
          </h1>
        </Link>

        {/* ✅ Botones segmentados reutilizables */}
        <SegmentedButtonGroup
          buttons={['Botón1', 'Botón2', 'Botón3', 'Botón4', 'Botón5']}
          activeIndex={activeBtn}
          onClick={handleButtonClick}
        />
        
        {/*Campana*/}
        <button className='cursor-pointer'>
          <NotificacionesCampana/>
        </button>

        <div className="relative z-[1000] flex items-center gap-0 bg-[var(--naranja)] rounded-[20px] shadow-[var(--sombra)] overflow-visible">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="flex-1 md:flex-none px-4 md:px-8 py-[0.4rem] font-[var(--tamaña-bold)] text-[var(--blanco)] text-sm md:text-base whitespace-nowrap">
            {user?.nombreCompleto || 'Nombre Usuario'}
          </button>
          <div className="flex items-center justify-center px-3 md:px-4">
            {profilePhotoUrl ? (
              <img
                src={profilePhotoUrl}
                alt="Foto de perfil"
                className="w-6 h-6 md:w-8 md:h-8 object-cover rounded-full border border-white"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 md:w-6 md:h-6 text-[var(--blanco)]"
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>

            {/* Componente menú */}
          {isMenuOpen && (
            <ProfileMenu 
              onLogout={handleLogout} 
              router={router} 
              onBecomeHost={onBecomeHost} 
              onBecomeDriver={onBecomeDriver} 
              user={user}
            />
          )}
        </div>
      </nav>
    </div>
  );
}

function ProfileMenu({
  onLogout,
  router,
  onBecomeHost,
  //onBecomeDriver,
  user
}: {
  onLogout: () => void;
  router: ReturnType<typeof useRouter>;
  onBecomeHost: () => void;
  onBecomeDriver: () => void;
  user: ReturnType<typeof useUser>;  
}) {
  return (
    <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--blanco)] border rounded-lg shadow-lg z-[9999] font-[var(--tamaña-bold)]">
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)] rounded-t-lg"
        onClick={() => router.push('/home/homePage/configurationPerfil')}
      >
        <h2 className="hover:text-[var(--blanco)]">Cuenta</h2>
      </button>

      {user?.driverBool && (
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja-46)]"
        onClick={() => router.push('/home/homePage/userPerfilDriver')}
      >
        <h2 className="hover:text-[var(--blanco)]">Perfil de Conductor</h2>
      </button>
      )}  

      {!user?.host && (
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)]"
        onClick={onBecomeHost}
      >
        <h2 className="hover:text-[var(--blanco)]">Quiero ser Host</h2>
      </button>
      )}

      {!user?.driverBool && (
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)]"
        onClick={() => router.push('/home/Driver')}
      >
        <h2 className="hover:text-[var(--blanco)]">Quiero ser Conductor</h2>
      </button>
      )}

      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)] rounded-b-lg"
        onClick={onLogout}
      >
        <h2 className="hover:text-[var(--blanco)]">Cerrar sesión</h2>
      </button>
    </div>
  );
}