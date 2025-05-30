"use client";
import { useState, useEffect } from 'react';

import NavbarPerfilUsuario from "@/app/components/navbar/NavbarPerfilUsuario";
import BotonConfiguration from "@/app/components/botons/BotonConfiguration";
import BotonNavegacion from "@/app/components/botons/BotonNavegacion";
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { FaUser} from 'react-icons/fa';
import { BiSolidCheckShield } from "react-icons/bi";
import { TbPasswordUser } from "react-icons/tb";
import { PiPasswordFill } from "react-icons/pi";
import { BsTrash3 } from "react-icons/bs";
import ModalVerificacionPaso1 from '@/app/components/modals/ModalVerificacionPaso1';
import ModalVerificacionExitosa from '@/app/components/modals/ModalVerificacionExitosa';

export default function ConfigurationHome() {
  const user = useUser();
  const router = useRouter();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);


  const [seccionActiva, setSeccionActiva] = useState<string>('personal');

  const [mostrarModalVerificacion, setMostrarModalVerificacion] = useState(false);
  const [mostrarModalVerificacionExitosa, setMostrarModalVerificacionExitosa] = useState(false);

  useEffect(() => {
    if (user?.fotoPerfil) {
      setProfilePhotoUrl(user.fotoPerfil);
    } else {
      setProfilePhotoUrl(null);
    }
  }, [user]);
 
  return (
    <>
      <header>
        <NavbarPerfilUsuario />
      </header>
      
      <main className='min-h-screen bg-[var(--blanco)] text-gray-900 flex justify-center sm:px-8 lg:px-12 font-[var(--fuente-principal)]'>
        <div className='bg-[var(--blanco)] w-auto h-full flex justify-center border-r-2 border-[rgba(0,0,0,0.05)]'>
            <div className='bg-[var(--blanco)] px-30 w-150 h-full flex flex-col items-center justify-start p-4 gap-6 mt-10'>
                <h1 className='text-[var(--azul-oscuro)] font-[var(--tamaña-bold)] text-2xl text-left w-full'>
                    CONFIGURACIÓN DE CUENTA
                </h1>
                <BotonConfiguration
                texto="Información personal" 
                ruta="/configuracion/personal" 
                icono={<FaUser className='text-[var(--azul-oscuro)] text-2xl' />} 
                textColor='text-[var(--azul-oscuro)] text-xl'
                onClick={() => setSeccionActiva('personal')}
                />
                <BotonConfiguration 
                texto="Inicio de sesión y seguridad" 
                ruta="/configuracion/personal" 
                icono={<BiSolidCheckShield className='text-[var(--azul-oscuro)] text-2xl' />} 
                textColor='text-[var(--azul-oscuro)] text-xl'
                onClick={() => setSeccionActiva('seguridad')}
                />
            </div>
        </div>
        <div className='bg-[var(--blanco)] w-full h-full flex justify-center'>
            {seccionActiva === 'personal' && (
            <>
                <div className='mt-10 h-full w-full flex flex-col items-center '>
                    <h1 className='pl-16 self-start text-[var(--azul-oscuro)] font-[var(--tamaña-bold)] text-2xl'>Información Personal</h1>
                    <div className='w-80 h-auto mt-10 border-2 flex flex-col items-center rounded-lg shadow-lg bg-[var(--gris-claro)]'>
                        {profilePhotoUrl ? (
                            <img
                                src={profilePhotoUrl}
                                alt="Foto de perfil"
                                className="w-80 h-80 object-cover rounded-t-lg border border-gray-300"
                                />
                            ) : (
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-80 h-80 text-gray-400"
                                >
                                <path
                                    fillRule="evenodd"
                                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                                    clipRule="evenodd"
                                />
                                </svg>
                            )}
                        <h2 className='text-[var(--azul-oscuro)] border-y-2 w-full text-center font-[var(--tamaña-bold)]'>{user?.nombreCompleto || 'Nombre Usuario'}</h2>
                        <button
                            onClick={() => router.push('/home/homePage/configurationPerfil/userPerfil')}
                            className='text-[var(--blanco)] bg-[var(--naranja)] w-full rounded-b-lg font-[var(--tamaña-bold)] hover:underline'
                            >
                            Editar Perfil
                        </button>
                    </div>
                </div>

            </>
            )}

            {seccionActiva === 'seguridad' && (
            <>
                <div className='mt-10 h-full w-full'>
                    <h1 className='pl-16 text-[var(--azul-oscuro)] font-[var(--tamaña-bold)] text-2xl'>Inicio de sesión y seguridad</h1>
                    <div className='flex justify-around mt-10'>
                        <BotonNavegacion 
                        texto='VERIFICACIÓN EN DOS PASOS'
                        icono={<TbPasswordUser className='text-[var(--azul-oscuro)] text-6xl' />}
                        textColor=' text-[var(--naranja)] text-xs'
                        onClick={() => setMostrarModalVerificacion(true)}
                        />
                        <BotonNavegacion 
                        texto='ACTUALIZAR CONTRASEÑA'
                        icono={<PiPasswordFill className='text-[var(--azul-oscuro)] text-6xl' />}
                        textColor=' text-[var(--naranja)] text-xs'/>
                        <BotonNavegacion 
                        texto='ELIMINAR CUENTA'
                        icono={<BsTrash3 className='text-[var(--azul-oscuro)] text-6xl' />}
                        textColor=' text-[var(--naranja)] text-xs'/>
                    </div>
                </div>
            </>
            )}
        </div>
      </main>
      {mostrarModalVerificacion && (
        <ModalVerificacionPaso1
          onClose={() => setMostrarModalVerificacion(false)}
          onVerificacionExitosa={() => {
            setMostrarModalVerificacion(false);
            setMostrarModalVerificacionExitosa(true);
          }}
        />
      )}

    {mostrarModalVerificacionExitosa && (
        <ModalVerificacionExitosa onClose={() => setMostrarModalVerificacionExitosa(false)} />
      )}  
    </>
  );
  
}
