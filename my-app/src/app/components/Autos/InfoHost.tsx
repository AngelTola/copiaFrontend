'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Usuario } from '@/app/types/auto';
import Link from "next/link";

interface Props {
  usuario: Usuario;
  marca: string;
  modelo: string;
}

export default function InfoHost({ usuario, marca, modelo }: Props) {
  const [error, setError] = useState(false);

  const handleContactClick = () => {
    try {
      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  
      const baseUrl = isMobile
        ? 'https://wa.me'
        : 'https://web.whatsapp.com/send';
  
      const link = `${baseUrl}?phone=591${usuario.telefono}&text=${encodeURIComponent(
        `Hola, estoy interesado en tu vehículo ${marca}-${modelo} publicado en REDIBO.`
      )}`;
  
      window.open(link, '_blank');
    } catch (err) {
      console.error('Error al redirigir a WhatsApp:', err);
      setError(true);
    }
  };

  // Crear la URL del perfil con parámetros
  const profileUrl = (() => {
    const queryParams = new URLSearchParams({
      nombre: usuario.nombreCompleto,
      telefono: usuario.telefono || '',
      direccion: usuario.direccion || '',
      email: usuario.email || '',
      edad: '21',
      marca: marca || '',
      modelo: modelo || ''
    }).toString();
    
    return `/home/detalleHost/${usuario.idUsuario}?${queryParams}`;
  })();

  return (
    <div className="bg-[#f5f5f5] p-6 rounded-2xl shadow-md border-2 border-black">
      <h3 className="text-[#11295b] font-semibold text-center mb-4">Datos del host</h3>

      <div className="flex justify-center mb-4">
        <div className="w-[80px] h-[80px] rounded-full bg-white border-4 border-black flex items-center justify-center">
          <Image
            src="/imagenesIconos/usuario.png"
            alt="Host"
            width={60}
            height={60}
            className="w-[60px] h-[60px]"
            unoptimized
          />
        </div>
      </div>

      <p className="text-center text-[#333] text-lg mb-2">
        {usuario?.nombreCompleto}
      </p>

      {usuario?.telefono && (
        <div className="mt-2 text-sm text-[#11295b]">
          <div className="flex justify-between items-center">
            <p className="font-semibold">Contacto directo:</p>
            <button
              onClick={handleContactClick}
              className="text-blue-600 font-semibold underline hover:text-blue-800 transition inline-flex items-center gap-1 mt-1 cursor-pointer"
            >
              <Image
                src="/imagenesIconos/whatsapp.png"
                alt="WhatsApp"
                width={18}
                height={18}
                className="inline-block"
                unoptimized
              />
              Contactar
            </button>
          </div>
          {error && (
            <p className="text-red-600 mt-2 font-medium">¡Ups! Algo salió mal.</p>
          )}
        </div>
      )}

      <div className="flex justify-center mt-4">
        <Link
          href={profileUrl}
          className="bg-[#FCA311] text-white font-bold py-2 px-4 rounded-full shadow-md transition"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}