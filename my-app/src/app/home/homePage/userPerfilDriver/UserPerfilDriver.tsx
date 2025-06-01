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

// Tipo para errores de validación
type ValidationErrors = {
  telefono?: string;
  licencia?: string;
  tipoLicencia?: string;
  fechaEmision?: string;
  fechaExpiracion?: string;
  anversoUrl?: string;
  reversoUrl?: string;
};

export default function UserPerfilDriver() {
  const [showGallery, setShowGallery] = useState(false);
  const [zoomUrl, setZoomUrl] = useState<string | null>(null);
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = useUser();
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  // AGREGAR ESTOS NUEVOS ESTADOS:
  const [anversoFile, setAnversoFile] = useState<File | null>(null);
  const [reversoFile, setReversoFile] = useState<File | null>(null);
  const [anversoPreview, setAnversoPreview] = useState<string | null>(null);
  const [reversoPreview, setReversoPreview] = useState<string | null>(null);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Estados para el modo edición - AHORA incluye tipoLicencia (categoría)
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<{
    telefono: string;
    licencia: string;
    tipoLicencia: string; // Agregado campo categoría
    fechaEmision: string;
    fechaExpiracion: string;
  }>({
    telefono: "",
    licencia: "",
    tipoLicencia: "", // Agregado campo categoría
    fechaEmision: "",
    fechaExpiracion: "",
  });

  // Estados para validaciones
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [showTooltip, setShowTooltip] = useState<{[key: string]: boolean}>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modal ListarRenters
  const [showRentersModal, setShowRentersModal] = useState(false);
  const [filaActiva, setFilaActiva] = useState<number | null>(null);
  const [sortField, setSortField] = useState<"fecha" | "nombre">("fecha");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5;
  

  // Categorías válidas para licencia
  const categoriasValidas = ['M', 'P', 'T', 'A', 'B', 'C'];

  // Función para validar teléfono
  const validateTelefono = (telefono: string): string | null => {
    if (!telefono) return "El teléfono es obligatorio";
    if (!/^\d+$/.test(telefono)) return "El teléfono solo debe contener números";
    if (telefono.length < 8) return "El teléfono debe tener al menos 8 dígitos";
    if (telefono.length > 8) return "El teléfono no debe tener más de 8 dígitos";
    if (!telefono.startsWith('6') && !telefono.startsWith('7')) {
      return "El número debe empezar con 6 o 7";
    }
    return null;
  };

  // Función para validar licencia
  const validateLicencia = (licencia: string): string | null => {
    if (!licencia) return "El número de licencia es obligatorio";
    if (!/^\d+$/.test(licencia)) return "La licencia solo debe contener números";
    if (licencia.length < 6) return "La licencia debe tener al menos 6 dígitos";
    if (licencia.length > 9) return "La licencia no debe tener más de 9 dígitos";
    return null;
  };
  // Función para validar resolución de imagen
const validateImageResolution = (file: File): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img.width >= 500 && img.height >= 500);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    
    img.src = url;
  });
};

// Función para validar formato de imagen
const validateImageFormat = (file: File): boolean => {
  return file.type === 'image/png';
};

// Función para manejar selección de archivos
const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, tipo: 'anverso' | 'reverso') => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Validar formato
  if (!validateImageFormat(file)) {
    alert('Solo se permiten archivos PNG');
    event.target.value = '';
    return;
  }

  // Validar resolución
  const hasValidResolution = await validateImageResolution(file);
  if (!hasValidResolution) {
    alert('La imagen es ilegible. Por favor, envíe una foto clara de su licencia.');
    event.target.value = '';
    return;
  }

  // Crear preview
  const previewUrl = URL.createObjectURL(file);
  
  if (tipo === 'anverso') {
    setAnversoFile(file);
    setAnversoPreview(previewUrl);
  } else {
    setReversoFile(file);
    setReversoPreview(previewUrl);
  }

  setHasUnsavedChanges(true);
};

// Función para eliminar imagen
const handleRemoveImage = (tipo: 'anverso' | 'reverso') => {
  if (tipo === 'anverso') {
    if (anversoPreview) URL.revokeObjectURL(anversoPreview);
    setAnversoFile(null);
    setAnversoPreview(null);
  } else {
    if (reversoPreview) URL.revokeObjectURL(reversoPreview);
    setReversoFile(null);
    setReversoPreview(null);
  }
  setHasUnsavedChanges(true);
};
  // Función para validar categoría
  const validateCategoria = (categoria: string): string | null => {
    if (!categoria) return "La categoría es obligatoria";
    if (!categoriasValidas.includes(categoria.toUpperCase())) {
      return "La categoría debe ser: M, P, T, A, B o C";
    }
    return null;
  };

  // Función para validar fechas
  const validateFechas = (fechaEmision: string, fechaExpiracion: string): { fechaEmision?: string; fechaExpiracion?: string } => {
    const errors: { fechaEmision?: string; fechaExpiracion?: string } = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (!fechaEmision) {
      errors.fechaEmision = "La fecha de emisión es obligatoria";
    } else {
      const fechaEm = new Date(fechaEmision);
      if (isNaN(fechaEm.getTime())) {
        errors.fechaEmision = "Fecha de emisión inválida";
      } else if (fechaEm > hoy) {
        errors.fechaEmision = "La fecha de emisión no puede ser mayor a la fecha actual";
      }
    }

    if (!fechaExpiracion) {
      errors.fechaExpiracion = "La fecha de vencimiento es obligatoria";
    } else {
      const fechaExp = new Date(fechaExpiracion);
      if (isNaN(fechaExp.getTime())) {
        errors.fechaExpiracion = "Fecha de vencimiento inválida";
      } else if (fechaExp < hoy) {
        errors.fechaExpiracion = "La fecha de vencimiento no puede ser menor a la fecha actual";
      }
    }

    if (fechaEmision && fechaExpiracion && !errors.fechaEmision && !errors.fechaExpiracion) {
      const fechaEm = new Date(fechaEmision);
      const fechaExp = new Date(fechaExpiracion);
      if (fechaEm >= fechaExp) {
        errors.fechaEmision = "La fecha de emisión debe ser menor a la fecha de vencimiento";
      }
    }

    return errors;
  };

  // Función para validar imágenes
  const validateImages = (): { anversoUrl?: string; reversoUrl?: string } => {
    const errors: { anversoUrl?: string; reversoUrl?: string } = {};
    
    if (!driverData?.anversoUrl) {
      errors.anversoUrl = "La imagen del anverso de la licencia es obligatoria";
    }
    
    if (!driverData?.reversoUrl) {
      errors.reversoUrl = "La imagen del reverso de la licencia es obligatoria";
    }

    return errors;
  };

  // Función para validar todos los campos
  const validateAllFields = (): boolean => {
    const errors: ValidationErrors = {};

    // Validar teléfono
    const telefonoError = validateTelefono(editFormData.telefono);
    if (telefonoError) errors.telefono = telefonoError;

    // Validar licencia
    const licenciaError = validateLicencia(editFormData.licencia);
    if (licenciaError) errors.licencia = licenciaError;

    // Validar categoría
    const categoriaError = validateCategoria(editFormData.tipoLicencia);
    if (categoriaError) errors.tipoLicencia = categoriaError;

    // Validar fechas
    const fechasErrors = validateFechas(editFormData.fechaEmision, editFormData.fechaExpiracion);
    Object.assign(errors, fechasErrors);

    // Validar imágenes
    const imageErrors = validateImages();
    Object.assign(errors, imageErrors);

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Función para verificar si el botón guardar debe estar habilitado
  const isFormValid = (): boolean => {
    return Object.keys(validationErrors).length === 0 && 
           !!editFormData.telefono && 
           !!editFormData.licencia && 
           !!editFormData.tipoLicencia && 
           !!editFormData.fechaEmision && 
           !!editFormData.fechaExpiracion &&
           !!driverData?.anversoUrl &&
           !!driverData?.reversoUrl;
  };

  type Renter = {
  fecha_suscripcion: string;
  nombre: string;
  telefono: string;
  email: string;
};

const [renters, setRenters] = useState<Renter[]>([]);

  useEffect(() => {
  const fetchRenters = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("⚠️ No se encontró token en localStorage");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/driver/renters", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("❌ Error al traer renters:", response.statusText);
        return;
      }

      const data = await response.json();
      console.log("📥 Renters recibidos desde el backend:", data);

      setRenters(data);
    } catch (error) {
      console.error("❌ Error al conectar con el backend:", error);
    }
  };

  fetchRenters();
}, []);




  // Ordenamiento
  const rentersOrdenados = [...renters].sort((a, b) => {
    if (sortField === "fecha") {
      const dateA = new Date(a.fecha_suscripcion);
      const dateB = new Date(b.fecha_suscripcion);
      return sortOrder === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    } else {
      const nameA = a.nombre.toLowerCase();
      const nameB = b.nombre.toLowerCase();
      if (nameA < nameB) return sortOrder === "asc" ? -1 : 1;
      if (nameA > nameB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  const indexUltimo = paginaActual * itemsPorPagina;
  const indexPrimero = indexUltimo - itemsPorPagina;
  const rentersPaginados = rentersOrdenados.slice(indexPrimero, indexUltimo);

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
          // Inicializar TODOS los datos editables incluyendo tipoLicencia
          setEditFormData({
            telefono: data.telefono || "",
            licencia: data.licencia || "",
            tipoLicencia: data.tipoLicencia || "", // Agregado campo categoría
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
    setHasUnsavedChanges(false);
    setValidationErrors({});
  };

  // Función para cancelar edición
  const handleCancelEdit = () => {
    if (hasUnsavedChanges) {
      const confirmCancel = window.confirm(
        "Tienes cambios sin guardar. ¿Deseas descartarlos?"
      );
      if (!confirmCancel) return;
    }

    setIsEditing(false);
    setHasUnsavedChanges(false);
    setValidationErrors({});
    // Restaurar datos originales INCLUYENDO tipoLicencia
    if (driverData) {
      setEditFormData({
        telefono: driverData.telefono || "",
        licencia: driverData.licencia || "",
        tipoLicencia: driverData.tipoLicencia || "", // Agregado campo categoría
        fechaEmision: driverData.fechaEmision?.split("T")[0] || "",
        fechaExpiracion: driverData.fechaExpiracion?.split("T")[0] || "",
      });
    }
  };

  // Función para guardar cambios
  const handleSaveChanges = async () => {
  if (!validateAllFields()) {
    alert("Por favor, corrige los errores antes de guardar");
    return;
  }

  setUploadingImages(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    // Crear FormData para enviar archivos
    const formData = new FormData();
    formData.append('telefono', editFormData.telefono);
    formData.append('licencia', editFormData.licencia);
    formData.append('tipoLicencia', editFormData.tipoLicencia);
    formData.append('fechaEmision', editFormData.fechaEmision);
    formData.append('fechaExpiracion', editFormData.fechaExpiracion);

    // Agregar archivos si existen
    if (anversoFile) {
      formData.append('anverso', anversoFile);
    }
    if (reversoFile) {
      formData.append('reverso', reversoFile);
    }

    const res = await fetch("http://localhost:3001/api/profile", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        // NO incluir Content-Type para FormData
      },
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Error al actualizar el perfil");
    }

    const updatedData = await res.json();
    setDriverData(updatedData);
    
    // Limpiar archivos temporales
    if (anversoPreview) URL.revokeObjectURL(anversoPreview);
    if (reversoPreview) URL.revokeObjectURL(reversoPreview);
    setAnversoFile(null);
    setReversoFile(null);
    setAnversoPreview(null);
    setReversoPreview(null);
    
    setIsEditing(false);
    setHasUnsavedChanges(false);
    setValidationErrors({});
    alert("Perfil actualizado exitosamente");
  } catch (err) {
    console.error("Error al guardar cambios:", err);
    alert("Error al guardar los cambios");
  } finally {
    setUploadingImages(false);
  }
};

      

  // Función para manejar cambios en el formulario
  const handleInputChange = (field: string, value: string) => {
    setEditFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);

    // Validación en tiempo real
    const newErrors = { ...validationErrors };
    
    switch (field) {
      case 'telefono':
        const telefonoError = validateTelefono(value);
        if (telefonoError) {
          newErrors.telefono = telefonoError;
        } else {
          delete newErrors.telefono;
        }
        break;
      case 'licencia':
        const licenciaError = validateLicencia(value);
        if (licenciaError) {
          newErrors.licencia = licenciaError;
        } else {
          delete newErrors.licencia;
        }
        break;
      case 'tipoLicencia':
        const categoriaError = validateCategoria(value);
        if (categoriaError) {
          newErrors.tipoLicencia = categoriaError;
        } else {
          delete newErrors.tipoLicencia;
        }
        break;
      case 'fechaEmision':
      case 'fechaExpiracion':
        const fechasErrors = validateFechas(
          field === 'fechaEmision' ? value : editFormData.fechaEmision,
          field === 'fechaExpiracion' ? value : editFormData.fechaExpiracion
        );
        if (fechasErrors.fechaEmision) {
          newErrors.fechaEmision = fechasErrors.fechaEmision;
        } else {
          delete newErrors.fechaEmision;
        }
        if (fechasErrors.fechaExpiracion) {
          newErrors.fechaExpiracion = fechasErrors.fechaExpiracion;
        } else {
          delete newErrors.fechaExpiracion;
        }
        break;
    }

    setValidationErrors(newErrors);
  };

  // Función para mostrar tooltip
  const handleMouseEnter = (field: string) => {
    if (!isEditing && (field === 'nombre' || field === 'sexo' || field === 'fotoPerfil')) {
      setShowTooltip(prev => ({ ...prev, [field]: true }));
    }
  };

  const handleMouseLeave = (field: string) => {
    setShowTooltip(prev => ({ ...prev, [field]: false }));
     };

          if (!user) return null;

  const OrdenIconos = ({ activo, orden }: { activo: boolean; orden: "asc" | "desc" }) => (
    <span className="ml-1 text-xs">
      <span className={activo && orden === "asc" ? "text-white" : "text-gray-300"}>▲</span>
      <span className={activo && orden === "desc" ? "text-white" : "text-gray-300"}>▼</span>
    </span>
  );

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
                <div 
                  className="border-2 border-gray-300 rounded-2xl overflow-hidden w-[120px] h-[120px] relative"
                  onMouseEnter={() => handleMouseEnter('fotoPerfil')}
                  onMouseLeave={() => handleMouseLeave('fotoPerfil')}
                >
                  {imagePreviewUrl ? (
                    <img
                      src={imagePreviewUrl}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PerfilIcon className="w-full h-full text-gray-500 p-4" />
                  )}
                  {showTooltip.fotoPerfil && (
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                      Este campo no es editable desde aquí. Para modificarlo, vaya a la sección 'Editar perfil personal'.
                    </div>
                  )}
                </div>

                {/* Botón Editar Perfil - Solo visible cuando NO está editando */}
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
                      <div className="overflow-x-auto rounded-[15px] border-4 border-[#11295B]">
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
                                  <OrdenIconos activo={sortField === "fecha"} orden={sortOrder} />
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
                                  <OrdenIconos activo={sortField === "nombre"} orden={sortOrder} />
                                </button>
                              </th>
                              
                              <th className="px-4 py-2">Teléfono</th>
                              <th className="px-4 py-2 rounded-tr-[10px]">Correo Electrónico</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rentersPaginados.map((renter, idx) => (
                              <tr
                                key={idx}
                                onClick={() => setFilaActiva(idx)}
                                className={`border-t border-gray-300 hover:bg-gray-100 transition-colors cursor-pointer ${
                                  filaActiva === idx ? 'bg-yellow-100' : ''
                                }`}
                              >
                                <td className="px-4 py-2">{renter.fecha_suscripcion?.split("T")[0]}</td>
                                <td className="px-4 py-2">{renter.nombre}</td>
                                <td className="px-4 py-2">{renter.telefono}</td>
                                <td className="px-4 py-2">{renter.email}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 flex justify-center items-center space-x-2 text-[#11295B] font-semibold">
                        <button
                          disabled={paginaActual === 1}
                          onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                          className="hover:underline"
                        >
                          &laquo;
                        </button>
                        {Array.from({ length: Math.ceil(rentersOrdenados.length / itemsPorPagina) }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setPaginaActual(i + 1)}
                            className={`${paginaActual === i + 1 ? "underline" : ""}`}
                          >
                            {i + 1}
                          </button>
                        ))}
                        <button
                          disabled={paginaActual === Math.ceil(rentersOrdenados.length / itemsPorPagina)}
                          onClick={() => setPaginaActual((prev) => Math.min(prev + 1, Math.ceil(rentersOrdenados.length / itemsPorPagina)))}
                          className="hover:underline"
                        >
                          &raquo;
                        </button>
                      </div>

                    </div>
                  </div>
                )}

              </div>

              {/* Formulario */}
              <div className="flex flex-col gap-6 w-full max-w-3xl ml-10">
                {/* Nombre y sexo - NO EDITABLES */}
                <div className="flex gap-4">
                  <div className="w-full relative">
                    <label className="text-sm font-semibold" htmlFor="nombre">
                      Nombre Completo:
                    </label>
                    <div 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter('nombre')}
                      onMouseLeave={() => handleMouseLeave('nombre')}
                    >
                      <input
                        id="nombre"
                        type="text"
                        value={driverData.usuario.nombreCompleto || ""}
                        className="w-full pl-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-gray-100"
                        readOnly
                      />
                      <UserIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                      {showTooltip.nombre && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          Este campo no es editable desde aquí. 
                          <br />
                          <button 
                            className="text-yellow-300 underline hover:text-yellow-100"
                            onClick={() => {/* Aquí iría la navegación al perfil personal */}}
                          >
                            Editar desde perfil personal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-48 relative">
                    <label className="text-sm font-semibold" htmlFor="sexo">
                      Sexo
                    </label>
                    <div 
                      className="relative"
                      onMouseEnter={() => handleMouseEnter('sexo')}
                      onMouseLeave={() => handleMouseLeave('sexo')}
                    >
                      <input
                        id="sexo"
                        type="text"
                        value={driverData.sexo || ""}
                        className="w-full py-2 px-4 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-gray-100"
                        readOnly
                      />
                      {showTooltip.sexo && (
                        <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          Este campo no es editable desde aquí. 
                          <br />
                          <button 
                            className="text-yellow-300 underline hover:text-yellow-100"
                            onClick={() => {/* Aquí iría la navegación al perfil personal */}}
                          >
                            Editar desde perfil personal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Teléfono - EDITABLE */}
                <div>
                  <label className="text-sm font-semibold">
                    Teléfono <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={isEditing ? editFormData.telefono : (driverData.telefono || "")}
                      onChange={(e) => {
                        // Solo permitir números
                        const value = e.target.value.replace(/\D/g, '');
                        // Limitar a 8 caracteres
                        if (value.length <= 8) {
                          handleInputChange('telefono', value);
                        }
                      }}
                      className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                        isEditing ? 'bg-white' : 'bg-gray-100'
                      } ${validationErrors.telefono ? 'border-red-500' : ''}`}
                      readOnly={!isEditing}
                      placeholder={isEditing ? "Ej: 77777777" : ""}
                    />
                    <PhoneIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    {isEditing && (
                      <div className="absolute right-2 top-2.5">
                        <EditIcon className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                  {validationErrors.telefono && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.telefono}</p>
                  )}
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


                {/* Categoría - EDITABLE */}
                <div>
                  <label className="text-sm font-semibold">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    {isEditing ? (
                      <select
                        value={editFormData.tipoLicencia}
                        onChange={(e) => handleInputChange('tipoLicencia', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-white appearance-none cursor-pointer ${
                          validationErrors.tipoLicencia ? 'border-red-500' : ''
                        }`}
                      >
                        <option value="">Seleccionar</option>
                        <option value="P">Particular (P)</option>
                        <option value="A">Profesional A</option>
                        <option value="B">Profesional B</option>
                        <option value="C">Profesional C</option>
                        <option value="M">Motorista (M)</option>
                        <option value="F">Especial (F)</option>
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={driverData.tipoLicencia ? 
                          (driverData.tipoLicencia === 'P' ? 'Particular (P)' :
                           driverData.tipoLicencia === 'A' ? 'Profesional A' :
                           driverData.tipoLicencia === 'B' ? 'Profesional B' :
                           driverData.tipoLicencia === 'C' ? 'Profesional C' :
                           driverData.tipoLicencia === 'M' ? 'Motorista (M)' :
                           driverData.tipoLicencia === 'F' ? 'Especial (F)' :
                           driverData.tipoLicencia) : ""
                        }
                        className="w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold bg-gray-100"
                        readOnly
                      />
                    )}
                    <CategoriaIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                    {isEditing && (
                      <>
                        <div className="absolute right-8 top-2.5">
                          <EditIcon className="w-5 h-5" />
                        </div>
                        {/* Flecha del select personalizada */}
                        <div className="absolute right-2 top-3 pointer-events-none">
                          <svg className="w-4 h-4 text-[#11295B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                  {validationErrors.tipoLicencia && (
                    <p className="text-red-500 text-sm mt-1">{validationErrors.tipoLicencia}</p>
                  )}
                </div>

                {/* Fechas de emisión y expiración - EDITABLES */}
                <div className="flex gap-4">
                  <div className="w-full">
                    <label className="text-sm font-semibold">
                      Fecha de Emisión <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={isEditing ? editFormData.fechaEmision : (driverData.fechaEmision?.split("T")[0] || "")}
                        onChange={(e) => handleInputChange('fechaEmision', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                          isEditing ? 'bg-white' : 'bg-gray-100'
                        } ${validationErrors.fechaEmision ? 'border-red-500' : ''}`}
                        readOnly={!isEditing}
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                      {isEditing && (
                        <div className="absolute right-2 top-2.5">
                          <EditIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    {validationErrors.fechaEmision && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.fechaEmision}</p>
                    )}
                  </div>
                  <div className="w-full">
                    <label className="text-sm font-semibold">
                      Fecha de Vencimiento <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={isEditing ? editFormData.fechaExpiracion : (driverData.fechaExpiracion?.split("T")[0] || "")}
                        onChange={(e) => handleInputChange('fechaExpiracion', e.target.value)}
                        className={`w-full pl-10 pr-10 py-2 border-2 border-black rounded shadow-[0_4px_2px_-2px_rgba(0,0,0,0.6)] text-[#11295B] font-semibold ${
                          isEditing ? 'bg-white' : 'bg-gray-100'
                        } ${validationErrors.fechaExpiracion ? 'border-red-500' : ''}`}
                        readOnly={!isEditing}
                      />
                      <CalendarIcon className="absolute left-2 top-2.5 w-5 h-5 text-[#11295B]" />
                      {isEditing && (
                        <div className="absolute right-2 top-2.5">
                          <EditIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    {validationErrors.fechaExpiracion && (
                      <p className="text-red-500 text-sm mt-1">{validationErrors.fechaExpiracion}</p>
                    )}
                  </div>
                </div>

                {/* Botones de acción - Solo visibles en modo edición */}
                {isEditing && (
                  <div className="flex gap-4 justify-center mt-6">
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-6 py-2 rounded shadow-md transition-all duration-300"
                    >
                      Cancelar
                    </button>
                    <button
                       onClick={handleSaveChanges}
                       disabled={!isFormValid() || uploadingImages}
                       className={`font-semibold px-6 py-2 rounded shadow-md transition-all duration-300 ${
                       isFormValid() && !uploadingImages
                         ? 'bg-green-500 hover:bg-green-600 text-white cursor-pointer'
                         : 'bg-gray-300 text-gray-500 cursor-not-allowed'
  }`}
>
                        {uploadingImages ? 'Guardando...' : 'Guardar Cambios'}
                       </button>
                  </div>
                )}

                {/* Validación de imágenes - Solo mostrar en modo edición si faltan imágenes */}
                {isEditing && (validationErrors.anversoUrl || validationErrors.reversoUrl) && (
                  <div className="bg-red-50 border border-red-200 rounded p-4 mt-4">
                    <h4 className="text-red-800 font-semibold mb-2">Imágenes Requeridas:</h4>
                    {validationErrors.anversoUrl && (
                      <p className="text-red-600 text-sm">• {validationErrors.anversoUrl}</p>
                    )}
                    {validationErrors.reversoUrl && (
                      <p className="text-red-600 text-sm">• {validationErrors.reversoUrl}</p>
                    )}
                    <p className="text-red-600 text-sm mt-2">
                      Use el botón "Galería" para subir las imágenes de su licencia.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
        )
      )}
    </main>

     // ... resto del código hasta el modal de galería

      {/* Modal Galería */}
      {showGallery && driverData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-[80%] max-w-4xl">
            <h2 className="text-xl font-bold mb-4 text-[#11295B]">
              Galería de Licencia
            </h2>
            
            {/* Solo mostrar controles de subida en modo edición */}
            {isEditing && (
              <div className="mb-6 p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-3">Subir nuevas imágenes (solo PNG, mín. 500x500px):</h3>
                <div className="flex gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Anverso:</label>
                    <input
                      type="file"
                      accept=".png"
                      onChange={(e) => handleFileSelect(e, 'anverso')}
                      className="text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Reverso:</label>
                    <input
                      type="file"
                      accept=".png"
                      onChange={(e) => handleFileSelect(e, 'reverso')}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-around gap-4">
              {/* Anverso */}
              <div className="text-center">
                <h4 className="font-semibold mb-2">Anverso</h4>
                {(anversoPreview || driverData.anversoUrl) ? (
                  <div className="relative">
                    <img
                      src={anversoPreview || driverData.anversoUrl}
                      alt="Anverso Licencia"
                      className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                      onClick={() => setZoomUrl(anversoPreview || driverData.anversoUrl)}
                    />
                    {isEditing && anversoPreview && (
                      <button
                        onClick={() => handleRemoveImage('anverso')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-60 h-60 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl rounded">
                    IMG
                  </div>
                )}
              </div>

              {/* Reverso */}
              <div className="text-center">
                <h4 className="font-semibold mb-2">Reverso</h4>
                {(reversoPreview || driverData.reversoUrl) ? (
                  <div className="relative">
                    <img
                      src={reversoPreview || driverData.reversoUrl}
                      alt="Reverso Licencia"
                      className="w-60 h-60 object-contain rounded shadow cursor-pointer"
                      onClick={() => setZoomUrl(reversoPreview || driverData.reversoUrl)}
                    />
                    {isEditing && reversoPreview && (
                      <button
                        onClick={() => handleRemoveImage('reverso')}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-60 h-60 bg-gray-200 flex items-center justify-center text-gray-400 text-4xl rounded">
                    IMG
                  </div>
                )}
              </div>
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

      {/* Modal de Zoom (si tienes esta funcionalidad) */}
      {zoomUrl && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setZoomUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={zoomUrl}
              alt="Zoom"
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setZoomUrl(null)}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}