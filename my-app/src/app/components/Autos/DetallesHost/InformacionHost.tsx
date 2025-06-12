'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function InformacionHost() {
  const searchParams = useSearchParams();
  const [error, setError] = useState(false);
  
  const edad = searchParams.get('edad');
  const telefono = searchParams.get('telefono');
  const direccion = searchParams.get('direccion');
  const email = searchParams.get('email');
  const marca = searchParams.get('marca') || '';
  const modelo = searchParams.get('modelo') || '';
  

  const handleContactClick = () => {
    try {
      if (!telefono) {
        throw new Error('No hay número de teléfono disponible');
      }

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const baseUrl = isMobile ? 'https://wa.me' : 'https://web.whatsapp.com/send';

      const link = `${baseUrl}?phone=591${telefono}&text=${encodeURIComponent(
        `Hola, estoy interesado en tu vehículo ${marca}-${modelo} publicado en REDIBO.`
      )}`;

      window.open(link, '_blank');
    } catch (err) {
      console.error('Error al redirigir a WhatsApp:', err);
      setError(true);
    }
  };

  return (
    <div className="flex-1 md:ml-8 mt-4 md:mt-0 text-base text-gray-800 w-full px-4 md:px-0"> 
      <div className="space-y-2 mb-5">
        <p><span className="font-bold">Edad:</span> {edad} Años</p>
        <p><span className="font-bold">Teléfono:</span> {telefono}</p>
        <p><span className="font-bold">Dirección:</span> {direccion}</p>
        <p><span className="font-bold">Correo electrónico:</span> {email}</p>
      </div>

      <div className="mt-4">
        <button
          onClick={handleContactClick}
          className="bg-[#e4d6c6] text-gray-800 font-semibold py-2 px-5 rounded-full flex items-center gap-2 text-base hover:opacity-90 transition w-full sm:w-auto justify-center sm:justify-start"
        >
          <Image
            src="/imagenesIconos/whatsapp.png"
            alt="WhatsApp"
            width={20}
            height={20}
            className="inline-block"
            unoptimized
          />
          Contacta con tu host
        </button>
        {error && (
          <p className="text-red-600 mt-2 font-medium text-base">¡Ups! Algo salió mal.</p>
        )}
      </div>
    </div>
  );
}