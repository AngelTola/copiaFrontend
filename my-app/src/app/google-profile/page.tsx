/* 'use client';

import CompleteProfileModal from "@/app/components/auth/authregistro/CompleteProfileModal";
import { useRouter } from 'next/navigation';
import Navbar from "@/app/components/navbar/Navbar"; // ajusta ruta si es necesario
// import Home from "@/app/home/page"; // solo si tienes un componente home modular

export default function GoogleProfilePage() {
  const router = useRouter();

  const handleComplete = async ({
    name,
    birthDate,
  }: {
    name: string;
    birthDate: string;
  }) => {
    try {
      const res = await fetch('http://localhost:3001/api/google/complete-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // mantiene la sesión de Google activa
        body: JSON.stringify({ name, birthDate }),
      });

      if (!res.ok) throw new Error('Error al completar perfil');

      router.push('/home'); // o donde quieras redirigir después
    } catch (err) {
      console.error(err);
    }
  };

  return (
    
    <CompleteProfileModal
      onComplete={handleComplete}
      onClose={() => router.push('/')}
    />
  );
}
 */