'use client';

import GaleriaImagenes from '@/app/components/Autos/GaleriaImagenes';
import Caracteristicas from '@/app/components/Autos/Caracteristicas';
import InfoHost from '@/app/components/Autos/InfoHost';
import Precio from '@/app/components/Autos/Precio';
import PanelComentarios from '@/app/components/Autos/PanelComentarios';
import SolicitudReserva from '@/app/components/Autos/PanelSolicitud/solicitudReserva';
import Estrellas from '@/app/components/Autos/Estrellas';
import { useEffect, useState } from 'react';
import { Auto, Comentario } from '@/app/types/auto';

interface Props {
  auto: Auto;
}

export default function DetalleCocheCliente({ auto }: Props) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [mostrarPanel, setMostrarPanel] = useState(false);
  const [mostrarSolicitudResercva, setMostrarModalSolicitud] = useState(false);
  const [botonBloqueado, setBotonBloqueado] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  useEffect(() => {
    import('@/libs/autoServices').then(({ getComentariosDeAuto }) => {
      getComentariosDeAuto(auto.idAuto)
        .then((data) => setComentarios(data.data))
        .catch((err) => {
          console.error('Error al obtener comentarios:', err);
          setComentarios([]);
        });
    });
  }, [auto.idAuto]);

  // Efecto para manejar el contador de tiempo
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    
    if (botonBloqueado && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante((prev) => {
          if (prev <= 1) {
            setBotonBloqueado(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalo) {
        clearInterval(intervalo);
      }
    };
  }, [botonBloqueado, tiempoRestante]);

  const handleConfirmarSolicitud = () => {
    // Aquí puedes agregar la lógica para enviar la solicitud
    console.log('Solicitud confirmada');
    
    // Bloquear el botón por 10 minutos (600 segundos)
    setBotonBloqueado(true);
    setTiempoRestante(600);
    
    // Cerrar el modal de solicitud
    setMostrarModalSolicitud(false);
  };

  const handleEnviarSolicitud = () => {
    if (!botonBloqueado) {
      setMostrarModalSolicitud(true);
    }
  };

  const comentariosValidos = comentarios.filter(c => c.calificacion > 0 && c.contenido?.trim() !== '');
  const promedio = comentariosValidos.length > 0
    ? comentariosValidos.reduce((acc, c) => acc + c.calificacion, 0) / comentariosValidos.length
    : 0;

  return (
    <>
      <SolicitudReserva
        mostrar={mostrarSolicitudResercva}
        onClose={() => setMostrarModalSolicitud(false)}
        auto={auto}
        onSolicitudConfirmada={handleConfirmarSolicitud}
      />

      <PanelComentarios
        mostrar={mostrarPanel}
        onClose={() => setMostrarPanel(false)}
        comentarios={comentarios}
        marca={auto.marca}
        modelo={auto.modelo}
      />

      <div className="w-full bg-white px-4 sm:px-6 md:px-8 lg:px-10 xl:px-16 pb-10">
        <div className="max-w-[1550px] mx-auto">
          <h1 className="mt-6 text-4xl text-[#11295B] font-bold text-left mb-6 pl-2 sm:pl-4">
            {auto.marca} - {auto.modelo}
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 w-full">
            {/* Galería + detalles */}
            <div className="flex-1 min-w-0 max-w-full">
              <GaleriaImagenes imagenes={auto.imagenes} marca={auto.marca} modelo={auto.modelo} />

              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-bold text-lg text-[#11295B]">Calificación</span>
                  <span className="text-lg text-[#11295B] font-bold">
                    {promedio.toFixed(1)}
                  </span>
                  <div className="scale-100">
                    <Estrellas promedio={promedio} />
                  </div>
                </div>

                <button
                  className="bg-[#fca311] text-white px-5 py-2.5 rounded-full text-base font-semibold transition hover:bg-[#e69500] active:bg-[#cc8400]"
                  onClick={() => setMostrarPanel(true)}
                >
                  Ver Reseñas
                </button>
              </div>

              <div className="bg-white mt-5">
                <h3 className="text-[#11295B] text-xl font-semibold">Detalles</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-4 mt-3">
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Año:</strong>
                    <span className="font-normal text-black">{auto.año}</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Placa:</strong>
                    <span className="font-normal text-black">{auto.placa.replace('-', '\u2011')}</span>
                  </div>
                  <div className="flex gap-2 text-base items-center">
                    <strong className="font-bold text-black">Color:</strong>
                    <span className="font-normal text-black">{auto.color}</span>
                  </div>
                </div>

                <h4 className="text-[#11295B] text-lg font-semibold mt-4">Descripción</h4>
                <p className="font-normal text-black">{auto.descripcion}</p>
              </div>
            </div>

            {/* Características */}
            <div className="flex-1 min-w-[200px] max-w-full">
              <div className="bg-white p-5 w-full">
                <h2 className="text-[#11295B] text-xl font-bold mb-4">Características Principales</h2>
                <Caracteristicas auto={auto} />
              </div>
            </div>

            {/* Info host + precio */}
            <div className="flex-1 min-w-[250px] max-w-full flex flex-col gap-6">
              <InfoHost usuario={auto.propietario} marca={auto.marca}
                modelo={auto.modelo} />
              <Precio precioPorDia={auto.precioRentaDiario} />
              <div className="w-full flex justify-center">
                <div className="flex flex-col items-center">
                  <button
                    className={`px-2.5 py-2.5 rounded-full text-base font-semibold transition max-w-[250px] h-[50px] ${
                      botonBloqueado
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-[#fca311] hover:bg-[#e69500] active:bg-[#cc8400] cursor-pointer'
                    } text-white`}
                    onClick={handleEnviarSolicitud}
                    disabled={botonBloqueado}
                  >
                    {botonBloqueado ? 'Solicitud enviada' : 'Enviar solicitud'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}