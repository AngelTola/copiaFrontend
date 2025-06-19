'use client';
import { useState, useRef } from 'react';

//foto de perfil
//import { uploadProfilePhoto } from '@/libs/userService';
import { deleteProfilePhoto } from '@/libs/userService';
interface Props {
  setImagePreviewUrl: (url: string | null) => void;
}
export default function FotoDePerfilEditable({setImagePreviewUrl }: Props) {
  const [feedback, setFeedback] = useState('');

  const [alertType, setAlertType] = useState<'success' | 'error'>('success');

  
  // Creamos la referencia para el input file
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  // Al hacer click en el botón, activamos el input
  const handleCambiarFoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Esto abre el selector de archivos
    }
  };

  const handleEliminarFoto = async () => {
    try {
      await deleteProfilePhoto();
      setImagePreviewUrl(null);
      setFeedback('Foto de perfil eliminada exitosamente.');
      setAlertType('success');
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        setFeedback(error.message || 'Error al eliminar la foto.');
      } else {
        console.error('Unknown error:', error);
        setFeedback('Error al eliminar la foto.');
      }
      setAlertType('error');
    }
  
    setTimeout(() => setFeedback(''), 3000);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
  
    if (file) {
      // Validación rápida: PNG y tamaño
      if (!file.type.includes('png')) {
        setFeedback('Formato de imagen no válido. Usa PNG.');
        setAlertType('error');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setFeedback('La imagen debe pesar menos de 2MB.');
        setAlertType('error');
        return;
      }
  
      setImagePreviewUrl(null);
      setFeedback('Subiendo foto...');
  
      // 👉 Crear FormData para enviar el archivo
      const formData = new FormData();
      formData.append('fotoPerfil', file);
  
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://copia-backend.vercel.app/api/upload-profile-photo', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          setFeedback('Foto de perfil actualizada exitosamente.');
          setAlertType('success');

          setImagePreviewUrl(data.fotoPerfil); // 👈 Usa la URL real de Firebase
          console.log('Foto guardada en:', data.fotoPerfil);
        } else {
          console.error(data.message);
          setFeedback(data.message || 'Error al subir la foto.');
          setAlertType('error');
        }
      } catch (error) {
        console.error('Error:', error);
        setFeedback('Error al subir la foto.');
        setAlertType('error');
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setTimeout(() => setFeedback(''), 3000);
    }
  };

  return (
    <div className="flex flex-col w-50 mt-4 gap-3">
      <button
        onClick={handleCambiarFoto}
        className="bg-[var(--naranja)] text-[var(--blanco)] px-4 py-2 rounded-lg shadow hover:bg-[var(--naranja)] transition cursor-pointer w-full"
      >
        Cambiar foto de perfil
      </button>

      {/* ✅ Input oculto */}
      
      <input
        type="file"
        ref={fileInputRef}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        onClick={handleEliminarFoto}
        className="bg-[var(--naranja)] text-[var(--blanco)] px-4 py-2 rounded-lg shadow hover:bg-[var(--rojo)] transition cursor-pointer w-full"
      >
        Eliminar foto de perfil
      </button>

      {feedback && (
        <p className={`text-center mt-2 font-semibold ${
          alertType === 'success' ? 'text-[var(--verde)]' : 'text-[var(--rojo)]'
        }`}>{feedback}</p>
      )}
    </div>
  );
}