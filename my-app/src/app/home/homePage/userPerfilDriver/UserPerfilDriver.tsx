"use client";

import React, { useState, useEffect } from "react";
import NavbarPerfilUsuario from "@/app/components/navbar/NavbarPerfilUsuario";
import PerfilIcon from "@/app/components/Icons/Perfil";
import UserIcon from "@/app/components/Icons/User";
import PhoneIcon from "@/app/components/Icons/Phone";
import LicenciaConductorIcon from "@/app/components/Icons/LicenciaConductor";
import CategoriaIcon from "@/app/components/Icons/Categoria";
import CalendarIcon from "@/app/components/Icons/Calendar";
import { SolarGalleryOutline } from "@/app/components/Icons/Gallery";
import { useUser } from '@/hooks/useUser';

// Tipo para los datos del driver
type DriverData = {
  usuario: {
    nombreCompleto: string;
    fotoPerfil?: string;
  };
  sexo: string;
  telefono: string;
  licencia: string;
  tipoLicencia: string;
  fechaEmision: string;
  fechaExpiracion: string;
  anversoUrl: string;
  reversoUrl: string;
};

export default function UserPerfilDriver() {
  const [showGallery, setShowGallery] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [showRentersModal, setShowRentersModal] = useState(false);
  const [filaActiva, setFilaActiva] = useState<number | null>(null);


  const renters = [
  { fecha_suscripcion: '2025-05-10', nombre: 'Maite', telefono: '777777777', email: 'suarezmaite355@gmail.com' },
  { fecha_suscripcion: '2025-05-11', nombre: 'Rodrigo', telefono: '787878787', email: 'aaa@gmail.com' },
];

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No se encontró el token de autenticación.");
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:3001/api/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Aún no te has registrado como conductor.");
          } else {
            setError("Error al cargar los datos del perfil del conductor.");
          }
          setDriverData(null);
        } else {
          const data = await res.json();
          setDriverData(data);
        }
      } catch (err) {
        console.error("Error al cargar perfil del driver:", err);
        setError("Error inesperado al conectar con el servidor.");
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  useEffect(() => {
    if (user?.fotoPerfil) {
      setImagePreviewUrl(`http://localhost:3001${user.fotoPerfil}`);
      console.log('✅ Foto cargada:', `http://localhost:3001${user.fotoPerfil}`);
    }
  }, [user]);
  if (!user) return null;

  return (
    <>
      <NavbarPerfilUsuario />

      <main className="min-h-screen bg-white text-[#11295B] px-10 py-10">
        <h1 className="text-center text-2xl font-bold mb-10">
          INFORMACION PERSONAL CONDUCTOR
        </h1>

        {loading ? (
          <p className="text-center text-lg">Cargando datos...</p>
        ) : error ? (
          <p className="text-center text-red-500 text-lg">{error}</p>
        ) : (
          driverData && (
            <div className="flex flex-col md:flex-row justify-start gap-10">
             
              {/* Imagen de perfil y botón Listar Rentes */}
              <div className="flex flex-col items-center justify-center gap-4 ml-4">
                <div className="bg-gray-100 border border-black rounded-2xl flex items-center justify-center w-[160px] h-[160px] overflow-hidden">
                  {driverData.usuario.foto_perfil ? (
                    <img
                      src={`http://localhost:3001/uploads/${driverData.usuario.foto_perfil}`}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PerfilIcon className="w-24 h-24 text-black" />
                  )}
                </div>

                {/* Botón con ancho fijo */}
                <button
                    onClick={() => setShowRentersModal(true)}
                    className="bg-[#FFB703] hover:bg-[#ffa200] hover:shadow-lg text-white font-semibold px-6 py-2 rounded-full shadow-md w-[160px] text-center transition-all duration-300"
                >
                  Lista de Renters
                </button>
                  {showRentersModal && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
                      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-4xl p-6 border border-gray-300 relative">

                        {/* Botón para cerrar */}
                        <button
                          onClick={() => setShowRentersModal(false)}
                          className="absolute top-4 right-4 text-[#11295B] hover:text-red-600 text-2xl font-bold transition-transform duration-300 hover:rotate-90"
                        >
                          ×
                        </button>

                        <h2 className="text-2xl font-bold text-center mb-6 text-[#11295B]">
                          Renters donde soy Driver
                        </h2>

                        {/* Tabla para los datos*/}
                        <div className="overflow-hidden rounded-[15px] border-4 border-[#11295B]">                  
                          <table className="min-w-full text-center border-collapse">
                            <thead>
                              <tr className="bg-[#11295B] text-white">
                                <th className="px-4 py-2 rounded-tl-[10px]">Fecha Suscripción</th>
                                <th className="px-4 py-2">Nombre Completo</th>
                                <th className="px-4 py-2">Teléfono</th>
                                <th className="px-4 py-2 rounded-tr-[10px]">Correo Electrónico</th>
                              </tr>
                            </thead>
                            <tbody>
                              {renters.length === 0 ? (
                                <tr>
                                  <td colSpan={4} className="py-4 text-gray-500">Sin registros</td>
                                </tr>
                              ) : (
                                renters.map((renter, idx) => (
                                  <tr
                                    key={idx}
                                    onClick={() => setFilaActiva(idx)}
                                    className={`border-t border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer ${
                                      filaActiva === idx ? 'bg-yellow-100' : ''
                                    }`}
                                   >
                                    <td className="px-4 py-2">{renter.fecha_suscripcion}</td>
                                    <td className="px-4 py-2">{renter.nombre}</td>
                                    <td className="px-4 py-2">{renter.telefono}</td>
                                    <td className="px-4 py-2">{renter.email}</td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>                  
                        </div>


                        {/* Paginación */}
                        <div className="mt-4 flex justify-center items-center space-x-2 text-[#11295B] font-semibold">
                          <button className="hover:underline">&laquo;</button>
                          <button className="underline">1</button>
                          <button>2</button>
                          <button>3</button>
                          <button className="hover:underline">&raquo;</button>
                        </div>
                      </div>
                    </div>
                    
                  )}
              </div>


              {/* Formulario */}
              <div className="flex flex-col gap-6 w-full max-w-3xl ml-10">
                {/* Nombre y sexo */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="text-sm font-semibold" htmlFor="nombre">
                      Nombre Completo:
                    </label>
                    <div className="relative">
                      <input
                        id="nombre"
                        type="text"
                        value={driverData.usuario.nombreCompleto || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <UserIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                  <div className="w-48">
                    <label className="text-sm font-semibold" htmlFor="sexo">
                      Sexo
                    </label>
                    <input
                      id="sexo"
                      type="text"
                      value={driverData.sexo || ""}
                      className="w-full py-2 px-4 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                      readOnly
                    />
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-semibold">Teléfono</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={user.telefono || ""}
                      className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                      readOnly
                    />
                    <PhoneIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  </div>
                </div>
                

                {/* Licencia de Conducir + botón galería */}
                <div className="flex gap-2 items-end">
                  <div className="w-full">
                    <label className="text-sm font-semibold">
                      Licencia de Conducir
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={driverData.licencia || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <LicenciaConductorIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                  <button
                    onClick={() => setShowGallery(true)}
                    className="p-2 border-2 border-black rounded hover:bg-gray-100"
                  >
                    <SolarGalleryOutline className="w-6 h-6 text-[#11295B]" />
                  </button>
                </div>

                {/* Categoría */}
                <div>
                  <label className="text-sm font-semibold">Categoría</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={driverData.tipoLicencia || ""}
                      className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                      readOnly
                    />
                    <CategoriaIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                  </div>
                </div>

                {/* Fechas */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="text-sm font-semibold">Fecha de Emisión</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={driverData.fechaEmision?.split("T")[0] || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-semibold">Fecha de Vencimiento</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={driverData.fechaExpiracion?.split("T")[0] || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold"
                        readOnly
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Modal Galería */}
        {showGallery && driverData && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[80%] max-w-4xl">
              <h2 className="text-xl font-bold mb-4 text-[#11295B]">
                Galería de Licencia
              </h2>
              <div className="flex justify-around">
                {driverData.anversoUrl ? (
                  <img
                    src={driverData.anversoUrl}
                    alt="Anverso Licencia"
                    className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                    onClick={() => setZoomUrl(driverData.anversoUrl)}
                  />
                ) : (
                  <div className="w-60 h-60 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
                    IMG
                  </div>
                )}

                {driverData.reversoUrl ? (
                  <img
                    src={driverData.reversoUrl}
                    alt="Reverso Licencia"
                    className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                    onClick={() => setZoomUrl(driverData.reversoUrl)}
                  />
                ) : (
                  <div className="w-60 h-60 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl">
                    IMG
                  </div>
                )}
              </div>
              <div className="text-right mt-4">
                <button
                  className="px-4 py-2 bg-[#11295B] text-white rounded hover:bg-blue-900"
                  onClick={() => setShowGallery(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de zoom de imagen */}
        {zoomUrl && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[9999]"
            onClick={() => setZoomUrl(null)}
          >
            <img
              src={zoomUrl}
              alt="Imagen ampliada"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded shadow-lg"
            />
          </div>
          
        )}
        
      </main>
    </>
  
  );
}

