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

// Componente de icono de edición
const EditIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" stroke="#11295B" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

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

  // Estados para el modo edición
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    nombreCompleto: string;
    sexo: string;
    telefono: string;
    licencia: string;
    tipoLicencia: string;
    fechaEmision: string;
    fechaExpiracion: string;
  }>({
    nombreCompleto: "",
    sexo: "",
    telefono: "",
    licencia: "",
    tipoLicencia: "",
    fechaEmision: "",
    fechaExpiracion: "",
  });

  const [showRentersModal, setShowRentersModal] = useState(false);
  const [filaActiva, setFilaActiva] = useState<number | null>(null);
  const [sortField, setSortField] = useState<"fecha" | "nombre">("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Datos de prueba
  const renters = [
    { fecha_suscripcion: '2025-05-10', nombre: 'Maite', telefono: '777777777', email: 'suarezmaite355@gmail.com' },
    { fecha_suscripcion: '2025-05-11', nombre: 'Rodrigo', telefono: '787878787', email: 'aaa@gmail.com' },
  ];

  // Ordenamiento
  const rentersOrdenados = [...renters].sort((a, b) => {
    if (sortField === "fecha") {
      const dateA = new Date(a.fecha_suscripcion);
      const dateB = new Date(b.fecha_suscripcion);
      return sortOrder === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    } else {
      const nameA = a.nombre.toLowerCase();
      const nameB = b.nombre.toLowerCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

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
          // Inicializar datos del formulario de edición
          setEditFormData({
            nombreCompleto: data.usuario.nombreCompleto || "",
            sexo: data.sexo || "",
            telefono: data.telefono || "",
            licencia: data.licencia || "",
            tipoLicencia: data.tipoLicencia || "",
            fechaEmision: data.fechaEmision?.split("T")[0] || "",
            fechaExpiracion: data.fechaExpiracion?.split("T")[0] || "",
          });
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

  // Función para activar modo edición
  const handleEditProfile = () => {
    setIsEditing(true);
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    setIsEditing(false);
    // Restaurar datos originales
    if (driverData) {
      setEditFormData({
        nombreCompleto: driverData.usuario.nombreCompleto || "",
        sexo: driverData.sexo || "",
        telefono: driverData.telefono || "",
        licencia: driverData.licencia || "",
        tipoLicencia: driverData.tipoLicencia || "",
        fechaEmision: driverData.fechaEmision?.split("T")[0] || "",
        fechaExpiracion: driverData.fechaExpiracion?.split("T")[0] || "",
      });
    }
  };

  // Función para guardar cambios
  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No se encontró el token de autenticación.");
        return;
      }

      const res = await fetch("http://localhost:3001/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editFormData),
      });

      if (!res.ok) {
        throw new Error("Error al actualizar el perfil");
      }

      const updatedData = await res.json();
      setDriverData(updatedData);
      setIsEditing(false);
      alert("Perfil actualizado exitosamente");
    } catch (err) {
      console.error("Error al guardar cambios:", err);
      alert("Error al guardar los cambios");
    }
  };

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
            <main className="min-h-screen bg-white text-gray-900 flex justify-center px-4 sm:px-6 lg:px-6 py-6">
              <div className="flex flex-col md:flex-row w-full max-w-5xl items-start gap-10 mt-1">
      
              {/* Imagen de perfil y botones*/}
              <div className="w-full md:w-[160px] flex flex-col items-center gap-4">
                <div className="border-2 border-gray-300 rounded-2xl overflow-hidden w-[120px] h-[120px]">
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PerfilIcon className="w-full h-full text-gray-500 p-4" />
                  )}
                </div>

                {/* Botón Editar Perfil */}
                {!isEditing && (
                  <button
                    onClick={handleEditProfile}
                    className="bg-[#FFB703] hover:bg-[#ffa200] text-white font-semibold px-4 py-2 rounded-full shadow-md text-center transition-all duration-300 w-[140px]"
                  >
                    Editar perfil
                  </button>
                )}

                {/* Botón Lista de Renters */}
                <button
                  onClick={() => setShowRentersModal(true)}
                  className="bg-[#FFB703] hover:bg-[#ffa200] text-white font-semibold px-4 py-2 rounded-full shadow-md text-center transition-all duration-300 w-[140px]"
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

                      {/* Tabla */}
                      <div className="overflow-hidden rounded-[15px] border-4 border-[#11295B]">
                        <table className="min-w-full text-center border-collapse">
                          <thead>
                            <tr className="bg-[#11295B] text-white">
                              <th className="px-4 py-2 rounded-tl-[10px]">
                                <button
                                  onClick={() => {
                                    if (sortField === "fecha") {
                                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                      setSortField("fecha");
                                      setSortOrder("asc");
                                    }
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  Fecha Suscripción
                                  <span>{sortField === "fecha" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
                                </button>
                              </th>
                              <th className="px-4 py-2">
                                <button
                                  onClick={() => {
                                    if (sortField === "nombre") {
                                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                                    } else {
                                      setSortField("nombre");
                                      setSortOrder("asc");
                                    }
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  Nombre Completo
                                  <span>{sortField === "nombre" ? (sortOrder === "asc" ? "▲" : "▼") : ""}</span>
                                </button>
                              </th>
                              <th className="px-4 py-2">Teléfono</th>
                              <th className="px-4 py-2 rounded-tr-[10px]">Correo Electrónico</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rentersOrdenados.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="py-4 text-gray-500">Sin registros</td>
                              </tr>
                            ) : (
                              rentersOrdenados.map((renter, idx) => (
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
                        value={isEditing ? editFormData.nombreCompleto : (driverData.usuario.nombreCompleto || "")}
                        onChange={(e) => handleInputChange('nombreCompleto', e.target.value)}
                        className={`w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                          isEditing ? 'bg-white' : 'bg-gray-100'
                        }`}
                        readOnly={!isEditing}
                      />
                      <UserIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    </div>
                  </div>
                  <div className="w-48">
                    <label className="text-sm font-semibold" htmlFor="sexo">
                      Sexo
                    </label>
                    <div className="relative">
                      {isEditing ? (
                        <select
                          id="sexo"
                          value={editFormData.sexo}
                          onChange={(e) => handleInputChange('sexo', e.target.value)}
                          className="w-full py-2 px-4 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-white"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Femenino">Femenino</option>
                          <option value="Otro">Otro</option>
                        </select>
                      ) : (
                        <input
                          id="sexo"
                          type="text"
                          value={driverData.sexo || ""}
                          className="w-full py-2 px-4 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-gray-100"
                          readOnly
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Teléfono */}
                <div>
                  <label className="text-sm font-semibold">Teléfono</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={isEditing ? editFormData.telefono : (user.telefono || "")}
                      onChange={(e) => handleInputChange('telefono', e.target.value)}
                      className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                        isEditing ? 'bg-white' : 'bg-gray-100'
                      }`}
                      readOnly={!isEditing}
                    />
                    <PhoneIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    {isEditing && (
                      <div className="absolute right-2 top-2.5">
                        <EditIcon className="w-5 h-5" />
                      </div>
                    )}
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
                        value={isEditing ? editFormData.licencia : (driverData.licencia || "")}
                        onChange={(e) => handleInputChange('licencia', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                          isEditing ? 'bg-white' : 'bg-gray-100'
                        }`}
                        readOnly={!isEditing}
                      />
                      <LicenciaConductorIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                      {isEditing && (
                        <div className="absolute right-2 top-2.5">
                          <EditIcon className="w-5 h-5" />
                        </div>
                      )}
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
                    {isEditing ? (
                      <>
                        <select
                          value={editFormData.tipoLicencia}
                          onChange={(e) => handleInputChange('tipoLicencia', e.target.value)}
                          className="w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-white"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Profesional A">Profesional A</option>
                          <option value="Profesional B">Profesional B</option>
                          <option value="Profesional C">Profesional C</option>
                          <option value="Particular A">Particular A</option>
                          <option value="Particular B">Particular B</option>
                        </select>
                        <CategoriaIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                        <div className="absolute right-2 top-2.5">
                          <EditIcon className="w-5 h-5" />
                        </div>
                      </>
                    ) : (
                      <>
                        <input
                          type="text"
                          value={driverData.tipoLicencia || ""}
                          className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-gray-100"
                          readOnly
                        />
                        <CategoriaIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                      </>
                    )}
                  </div>
                </div>

                {/* Fechas */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="text-sm font-semibold">Fecha de Emisión</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={isEditing ? editFormData.fechaEmision : (driverData.fechaEmision?.split("T")[0] || "")}
                        onChange={(e) => handleInputChange('fechaEmision', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                          isEditing ? 'bg-white' : 'bg-gray-100'
                        }`}
                        readOnly={!isEditing}
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                      {isEditing && (
                        <div className="absolute right-2 top-2.5">
                          <EditIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-semibold">Fecha de Vencimiento</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={isEditing ? editFormData.fechaExpiracion : (driverData.fechaExpiracion?.split("T")[0] || "")}
                        onChange={(e) => handleInputChange('fechaExpiracion', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                          isEditing ? 'bg-white' : 'bg-gray-100'
                        }`}
                        readOnly={!isEditing}
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                      {isEditing && (
                        <div className="absolute right-2 top-2.5">
                          <EditIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Botones Guardar/Cancelar cuando está en modo edición */}
                {isEditing && (
                  <div className="flex gap-4 justify-center mt-6">
                    <button
                      onClick={handleSaveChanges}
                      className="bg-[#FFB703] hover:bg-[#ffa200] text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
                    >
                      Guardar cambios
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-3 rounded-full shadow-md transition-all duration-300"
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </div>
          </main>
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