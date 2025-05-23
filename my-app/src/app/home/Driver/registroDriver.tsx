'use client';
import React, { useEffect, useState, useRef } from 'react';
import NavbarPerfilUsuario from '@/app/components/navbar/NavbarPerfilUsuario';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import User from '@/app/components/Icons/User';
import Phone from '@/app/components/Icons/Phone';
import LicenciaConductor from '@/app/components/Icons/LicenciaConductor';
import Categoria from '@/app/components/Icons/Categoria';
import Calendar from '@/app/components/Icons/Calendar';
import Sexo from '@/app/components/Icons/Sexo';
import { useUser } from '@/hooks/useUser';



const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "redibo_driver"); 

  try {
    const response = await fetch("https://api.cloudinary.com/v1_1/do94h9rbw/image/upload", {
      method: "POST",
      body: formData
    });

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error al subir a Cloudinary", error);
    return null;
  }
};


export default function registroDriver() {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [anverso, setAnverso] = useState<File | null>(null);
  const [reverso, setReverso] = useState<File | null>(null);
  const [perfil, setPerfil] = useState<File | null>(null);
  const [errorPerfil, setErrorPerfil] = useState<string | null>(null);
  const [nombreUsuario, setNombreUsuario] = useState<string>('');
  const [sexo, setSexo] = useState<string>('');
  const [telefonoUsuario, setTelefonoUsuario] = useState<string>('');
  const [NroLicencia, setNroLicencia] = useState<string>('');
  const [categoriaLicencia, setCategoriaLicencia] = useState<string>('');
  const [fechaVencimiento, setFechaVencimientoState] = useState<string>('');
  const [fechaEmision, setFechaEmisionState] = useState<string>('');

  const [errorSexo, setErrorSexo] = useState(false);
  const [mensajeErrorSexo, setMensajeErrorSexo] = useState('');
  const [errorTelefono, setErrorTelefono] = useState(false);
  const [mensajeErrorTelefono, setMensajeErrorTelefono] = useState('');
  const [errorLicencia, setErrorLicencia] = useState(false);
  const [mensajeErrorLicencia, setMensajeErrorLicencia] = useState('');
  const [errorCategoria, setErrorCategoria] = useState(false);
  const [mensajeErrorCategoria, setMensajeErrorCategoria] = useState('');
  const [errorFechaEmision, setErrorFechaEmision] = useState(false);
  const [mensajeErrorFechaEmision, setMensajeErrorFechaEmision] = useState('');
  const [errorFechaVencimiento, setErrorFechaVencimiento] = useState(false);
  const [mensajeErrorFechaVencimiento, setMensajeErrorFechaVencimiento] = useState('');
  const [errorAnverso, setErrorAnverso] = useState<string | null>(null);
  const [errorReverso, setErrorReverso] = useState<string | null>(null);


  const router = useRouter();

  const [mensajeErrorAnverso, setMensajeErrorAnverso] = useState('');
  const [mensajeErrorReverso, setMensajeErrorReverso] = useState('');

  const anversoRef = useRef<HTMLInputElement>(null);
  const reversoRef = useRef<HTMLInputElement>(null);
  const perfilRef = useRef<HTMLInputElement>(null);

  const user = useUser();
  //const [telefonoUsuario, setTelefonoUsuario] = useState('');


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsError(true);
    } else {
      setNombreUsuario(user?.nombre_completo || '');
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user?.telefono) {
      setTelefonoUsuario(String(user.telefono)); // fuerza a texto
    }
  }, [user]);

  

  useEffect(() => {
    const savedData = localStorage.getItem("registroDriverPaso1");

    if (savedData) {
      const parsed = JSON.parse(savedData);
      setSexo(parsed.sexo || '');
      setTelefonoUsuario(parsed.telefono || '');
      setNroLicencia(parsed.nro_licencia || '');
      setCategoriaLicencia(parsed.categoria || '');
      setFechaEmisionState(parsed.fecha_emision || '');
      setFechaVencimientoState(parsed.fecha_vencimiento || '');
    }
  }, [user]);


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsError(true);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleDragOver = (e: DragEvent) => e.preventDefault();
    const handleDrop = (e: DragEvent) => e.preventDefault();
  
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);
  
    return () => {
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);
  

  const validateFile = (file: File, tipo: 'anverso' | 'reverso' | 'perfil') => {
    return new Promise<{ valido: boolean; mensaje?: string }>((resolve) => {
      const validType = file.type === 'image/png';
      if (!validType) {
        resolve({ valido: false, mensaje: 'Solo se permiten imágenes en formato PNG.' });
        return;
      }
  
      const img = new Image();
      img.onload = () => {
        if (img.width < 500 || img.height < 500) {
          resolve({ valido: false, mensaje: 'La imagen es ilegible. Por favor, envíe una foto clara de su licencia.' });
        } else {
          resolve({ valido: true });
        }
      };
      img.onerror = () => {
        resolve({ valido: false, mensaje: 'No se pudo cargar la imagen.' });
      };
  
      img.src = URL.createObjectURL(file);
    });
  };
  

 const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    tipo: 'anverso' | 'reverso' | 'perfil'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validación si ya hay una imagen en ese campo
    if (tipo === 'anverso' && anverso) {
      setErrorAnverso('Ya se ha cargado una imagen. Elimina la actual para subir otra.');
      return;
    }
    if (tipo === 'reverso' && reverso) {
      setErrorReverso('Ya se ha cargado una imagen. Elimina la actual para subir otra.');
      return;
    }
    if (tipo === 'perfil' && perfil) {
      setErrorPerfil('Ya se ha cargado una imagen. Elimina la actual para subir otra.');
      return;
    }

    // Validación formato de imagen
    if (file.type !== 'image/png') {
      const errorMsg = 'Solo se permiten imágenes en formato PNG';
      if (tipo === 'anverso') {
        setErrorAnverso(errorMsg);
        setAnverso(null);
      } else if (tipo === 'reverso') {
        setErrorReverso(errorMsg);
        setReverso(null);
      } else if (tipo === 'perfil') {
        setErrorPerfil(errorMsg);
        setPerfil(null);
      }
      return;
    }

    // Validación de tamaño
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      const errorMsg = 'La imagen no debe superar los 5MB';
      if (tipo === 'anverso') {
        setErrorAnverso(errorMsg);
        setAnverso(null);
      } else if (tipo === 'reverso') {
        setErrorReverso(errorMsg);
        setReverso(null);
      } else if (tipo === 'perfil') {
        setErrorPerfil(errorMsg);
        setPerfil(null);
      }
      return;
    }

    // Validación de resolución
    const img = new Image();
    img.onload = () => {
      if (img.width < 500 || img.height < 500) {
        const errorMsg = 'La imagen es ilegible. Por favor, sube una imagen de al menos 500x500 píxeles.';
        if (tipo === 'anverso') {
          setErrorAnverso(errorMsg);
          setAnverso(null);
        } else if (tipo === 'reverso') {
          setErrorReverso(errorMsg);
          setReverso(null);
        } else if (tipo === 'perfil') {
          setErrorPerfil(errorMsg);
          setPerfil(null);
        }
      } else {
        if (tipo === 'anverso') {
          setAnverso(file);
          setErrorAnverso(null);
        } else if (tipo === 'reverso') {
          setReverso(file);
          setErrorReverso(null);
        } else if (tipo === 'perfil') {
          setPerfil(file);
          setErrorPerfil(null);
        }
      }
    };

    img.onerror = () => {
      const errorMsg = 'No se pudo leer la imagen. Intenta con otra.';
      if (tipo === 'anverso') {
        setErrorAnverso(errorMsg);
        setAnverso(null);
      } else if (tipo === 'reverso') {
        setErrorReverso(errorMsg);
        setReverso(null);
      } else if (tipo === 'perfil') {
        setErrorPerfil(errorMsg);
        setPerfil(null);
      }
    };

    img.src = URL.createObjectURL(file);
  };

  

  
const removeFile = (tipo: 'anverso' | 'reverso' | 'perfil') => {
  if (tipo === 'anverso') setAnverso(null);
  if (tipo === 'reverso') setReverso(null);
  if (tipo === 'perfil') setPerfil(null);
};


  const renderImagePreview = (file: File | null | undefined, tipo: 'anverso' | 'reverso' | 'perfil') => {
  if (!file) return null;
  if (!(file instanceof File)) {
    console.error(`❌ El archivo para "${tipo}" no es válido:`, file);
    return null;
  }

  const src = URL.createObjectURL(file);
  return (
    <div className="relative w-40 h-28 mt-2">
      <img src={src} alt={tipo} className="object-cover w-full h-full rounded" />
      <button
        onClick={() => removeFile(tipo)}
        className="absolute -top-2 -right-2 bg-[#11295B] text-white rounded-full w-5 h-5 flex items-center justify-center"
      >
        <X size={12} />
      </button>
    </div>
  );
};




  const validarTelefono = (telefono: string): boolean => {
    const regex = /^[67]\d{7}$/; 
    return regex.test(telefono);
  };
  

  const validarNroLicencia = (nroLicencia: string): boolean => {
    const regex = /^[A-Z0-9]{5,10}$/;
    return regex.test(nroLicencia);
  }

  {/*const validarFechaEmision = (fecha: string): boolean => {
    if (fecha > new Date()) {
      return;
  };*/}
  
  const validarFechaEmision = (fecha: string): boolean => {
    const fechaSeleccionada = new Date(fecha);
    const hoy = new Date();
    const fechaMinima = new Date();
    fechaMinima.setFullYear(hoy.getFullYear() - 5);

    return fechaSeleccionada >= fechaMinima && fechaSeleccionada <= hoy;
    };

    const validarFechaVencimiento = (fecha: string): boolean => {
      const fechaActual = new Date();
      const fechaSeleccionada = new Date(fecha);
      return fechaSeleccionada >= fechaActual;
    }

    if (isLoading) return <div>Cargando...</div>;
    if (isError) return <div>Error: No tienes permiso para acceder a esta página.</div>;

    function setFechaEmision(value: string): void {
      throw new Error('Function not implemented.');
    }

    function setFechaVencimiento(value: string): void {
      throw new Error('Function not implemented.');
    }




    const validarCampos = () => {
    let valido = true;

    if (!sexo) {
      setErrorSexo(true);
      setMensajeErrorSexo('Seleccione una opción');
      valido = false;
    } else {
      setErrorSexo(false);
      setMensajeErrorSexo('');
    }    
    
    if (!telefonoUsuario) {
      setErrorTelefono(true);
      setMensajeErrorTelefono('Este campo no puede estar vacío');
      valido = false;
    } else if (!/^[67]/.test(telefonoUsuario)) {
      setErrorTelefono(true);
      setMensajeErrorTelefono('El número debe comenzar con 6 o 7');
      valido = false;
    } else if (!/^\d{8}$/.test(telefonoUsuario)) {
      setErrorTelefono(true);
      setMensajeErrorTelefono('El número debe tener exactamente 8 dígitos');
      valido = false;
    } else {
      setErrorTelefono(false);
      setMensajeErrorTelefono('');
    }

    if (!NroLicencia) {
      setErrorLicencia(true);
      setMensajeErrorLicencia('Este campo no puede estar vacío');
      valido = false;
    } else if (NroLicencia.length < 6) {
      setErrorLicencia(true);
      setMensajeErrorLicencia('Debe tener mínimo 6 dígitos');
      valido = false;
    } else if (!validarNroLicencia(NroLicencia)) {
      setErrorLicencia(true);
      setMensajeErrorLicencia('Debe tener hasta 8 caracteres alfanuméricos');
      valido = false;
    } else {
      setErrorLicencia(false);
      setMensajeErrorLicencia('');
    }
  

    if (!categoriaLicencia) {
      setErrorCategoria(true);
      setMensajeErrorCategoria('Seleccione una categoría de licencia');
      valido = false;
    } else {
      setErrorCategoria(false);
      setMensajeErrorCategoria('');
    }    

    if (!fechaEmision) {
      setErrorFechaEmision(true);
      setMensajeErrorFechaEmision('Seleccione una fecha');
      valido = false;
    } else {
      const añoEmision = new Date(fechaEmision).getFullYear();
      if (añoEmision > 9999) {
        setErrorFechaEmision(true);
        setMensajeErrorFechaEmision('El año no puede exceder 9999');
        valido = false;
      } else if (!validarFechaEmision(fechaEmision)) {
        setErrorFechaEmision(true);
        setMensajeErrorFechaEmision('La fecha no puede ser posterior a hoy');
        valido = false;
      } else {
        setErrorFechaEmision(false);
        setMensajeErrorFechaEmision('');
      }
    }



    if (!fechaVencimiento) {
      setErrorFechaVencimiento(true);
      setMensajeErrorFechaVencimiento('Seleccione una fecha');
      valido = false;
    } else {
      const añoVencimiento = new Date(fechaVencimiento).getFullYear();
      const hoy = new Date();

      if (añoVencimiento > 9999) {
        setErrorFechaVencimiento(true);
        setMensajeErrorFechaVencimiento('El año no puede exceder 9999');
        valido = false;
      } else if (!validarFechaVencimiento(fechaVencimiento)) {
        setErrorFechaVencimiento(true);
        setMensajeErrorFechaVencimiento('La fecha debe ser posterior a hoy');
        valido = false;
      } else if (fechaEmision) {
        const emision = new Date(fechaEmision);
        const vencimiento = new Date(fechaVencimiento);
        const cincoAniosDespues = new Date(emision);
        cincoAniosDespues.setFullYear(emision.getFullYear() + 5);

        if (vencimiento > cincoAniosDespues) {
          setErrorFechaVencimiento(true);
          setMensajeErrorFechaVencimiento('La vigencia máxima permitida es de 5 años');
          valido = false;
        } else {
          setErrorFechaVencimiento(false);
          setMensajeErrorFechaVencimiento('');
        }
      } else {
        setErrorFechaVencimiento(false);
        setMensajeErrorFechaVencimiento('');
      }
    }



    if (!anverso) {
      setErrorAnverso('Debe subir la imagen del anverso de la licencia');
      valido = false;
    } else {
      setErrorAnverso(null);
    }
    
    if (!reverso) {
      setErrorReverso('Debe subir la imagen del reverso de la licencia');
      valido = false;
    } else {
      setErrorReverso(null);
    }    

    return valido;
  };


  {/*const handleSubmit = () => {
    const esValido = validarCampos();

    if (!esValido) {
      console.log("Hay errores en el formulario");
      return;
    }

    // Aquí iría la lógica para continuar, guardar datos o avanzar a otro paso
    console.log("Formulario válido. Listo para enviar.");
  };*/}
    const handleSubmit = async () => {
      const esValido = validarCampos();
      if (!esValido || !anverso || !reverso) {
        return;
      }

      const urlAnverso = await uploadImageToCloudinary(anverso);
      const urlReverso = await uploadImageToCloudinary(reverso);

      if (!urlAnverso || !urlReverso) {
        return;
      }

      const data = {
        sexo,
        telefono: telefonoUsuario,
        nro_licencia: NroLicencia,
        categoria: categoriaLicencia,
        fecha_emision: fechaEmision,
        fecha_vencimiento: fechaVencimiento,
        anversoUrl: urlAnverso,
        reversoUrl: urlReverso
      };

      if (user?.email) {
        localStorage.setItem("registroDriverPaso1", JSON.stringify(data));
      }


      router.push("/home/Driver/seleccionarRenter");
    };

    const limitarAñoMaximo = (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const value = input.value;

      const partes = value.split("-");
      if (partes.length === 3) {
        const año = partes[0];
        if (año.length > 4 || parseInt(año) > 2099) {
          input.value = "0000-01-01"; 
          const changeEvent = new Event('input', { bubbles: true });
          input.dispatchEvent(changeEvent);
        }
      }
    };



  return (
    <div className="bg-[var(--blanco)] min-h-screen flex flex-col"> 
      <div className="fixed top-0 w-full z-50 bg-white shadow-none border-b border-gray-200">
        <NavbarPerfilUsuario />
      </div>

      <div className="mt-28 px-8 w-full flex justify-center">
        <div className="max-w-[1300px] w-full">
          <h2 className="text-[1.8rem] font-bold mb-4 text-[#11295B] text-center">REGISTRO COMO DRIVER</h2>
          <p className="text-base text-[#333] leading-relaxed text-left max-w-[1100px] mx-auto">
            Conviértete en driver y ayuda a otros usuarios a llegar a sus destinos. Regístrate y activa tu disponibilidad para empezar a recibir solicitudes de viaje.
            <br />
            En este paso te pediremos una foto de perfil, datos personales para que los usuarios se relacionen con tu perfil, también añadirás fotos de tu licencia de conducir. Finalmente tendrás las opciones para elegir un método de pago.
          </p>
        </div>
      </div>


      <div className="mt-7 w-full flex justify-center">
        <div className="p-8 w-full max-w-[1300px] flex gap-8">
          

          {/* Columna izquierda - Datos personales */}
          <div className="w-1/2 space-y-4">
            <h2 className="text-2xl font-bold text-[#11295B] mb-6">DATOS PERSONALES Y DE LICENCIA</h2>

            {/* Fila 1: Nombre y sexo */}
            <div className="flex w-full gap-4">
              <div className="w-2/3 relative">
                <div className="absolute left-4 top-4">
                  <User className="w-6 h-6 text-[#11295B]" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={nombreUsuario}
                  placeholder="Nombre del usuario"
                  readOnly
                  className="w-full pl-12 pr-4 pt-6 pb-2 rounded-lg border border-[#11295B] text-[#11295B] placeholder:text-[#11295B]/50 focus:outline-none focus:ring-1 focus:ring-[#11295B]"
                />
                <span className="absolute left-12 top-[0.4rem] text-xs text-[#11295B] font-bold  px-1">
                  Nombre completo
                </span>
              </div>

              {/* Sexo */}
              <div className="w-1/3 relative">
                <div className="absolute left-4 top-4">
                  <Sexo className={`w-6 h-6 ${errorSexo ? 'text-red-500' : 'text-[#11295B]'}`} />
                </div>
                <span className={`absolute left-12 top-[0.4rem] text-xs font-bold px-1 z-10 ${errorSexo ? 'text-red-500' : 'text-[#11295B]'}`}>
                  Sexo
                </span>

                <select
                  id="sexo"
                  name="sexo"
                  value={sexo}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSexo(value);

                    if (!value) {
                      setErrorSexo(true);
                      setMensajeErrorSexo('Seleccione una opción');
                    } else {
                      setErrorSexo(false);
                      setMensajeErrorSexo('');
                    }
                  }}
                  className={`w-full pt-6 pb-2 pl-12 pr-3 rounded-lg border focus:outline-none focus:ring-1 ${
                    errorSexo
                      ? 'border-red-500 text-red-500 focus:ring-red-500'
                      : 'border-[#11295B] text-[#11295B] focus:ring-[#11295B]'
                  }`}
                  required
                >
                  <option value="" disabled hidden>Seleccionar</option>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                </select>

                {errorSexo && mensajeErrorSexo && (
                  <p className="text-sm text-red-500 mt-1">{mensajeErrorSexo}</p>
                )}
              </div>

            </div>



            <div className="relative w-full mt-4">
              <div className="absolute left-4 top-4">
                <Phone className={`w-6 h-6 ${errorTelefono ? 'text-red-500' : 'text-[#11295B]'}`} />
              </div>

              {user?.telefono !== undefined && user?.telefono !== null ? (
                //Teléfono ya registrado, solo lo muestra. Esta desactivado, sin fondo gris
                <>
                  <input
                    type="text"
                    value={String(user.telefono)}
                    disabled
                    className="w-full pl-12 pr-4 pt-6 pb-2 rounded-lg border border-[#11295B] text-[#11295B] placeholder:text-[#11295B]/50"
                  />
                  <span className="absolute left-12 top-[0.4rem] text-xs font-bold px-1 text-[#11295B]">
                    Teléfono
                  </span>
                </>
              ) : (
                //No hay teléfono, input editable con validaciones
                <>
                  <input
                    type="text"
                    id="telefono"
                    name="telefono"
                    value={telefonoUsuario}
                    placeholder="77777777"
                    onChange={(e) => {
                      const input = e.target.value;

                        if (!/^\d*$/.test(input)) return;
                        if (input.length > 8) return;

                      setTelefonoUsuario(input);

                      if (input === '') {
                        setErrorTelefono(true);
                        setMensajeErrorTelefono('Este campo no puede estar vacío');
                      } else if (!/^[67]/.test(input)) {
                        setErrorTelefono(true);
                        setMensajeErrorTelefono('El número debe comenzar con 6 o 7');
                      } else if (input.length < 8) {
                        setErrorTelefono(true);
                        setMensajeErrorTelefono('El número debe tener exactamente 8 dígitos');
                      } else {
                        setErrorTelefono(false);
                        setMensajeErrorTelefono('');
                      }
                    }}
                    className={`w-full pl-12 pr-4 pt-6 pb-2 rounded-lg border focus:outline-none focus:ring-1 ${
                      errorTelefono
                        ? 'border-red-500 text-red-500 placeholder:text-red-400 focus:ring-red-500'
                        : 'border-[#11295B] text-[#11295B] placeholder:text-[#11295B]/50 focus:ring-[#11295B]'
                    }`}
                  />
                  {errorTelefono && (
                    <p className="text-sm text-red-500 mt-1">{mensajeErrorTelefono}</p>
                  )}
                  <span className={`absolute left-12 top-[0.4rem] text-xs font-bold px-1 ${
                    errorTelefono ? 'text-red-500' : 'text-[#11295B]'
                  }`}>
                    Teléfono
                  </span>
                </>
              )}
            </div>





            <div className="relative w-full mt-4">
              <div className="absolute left-4 top-4">
              <LicenciaConductor className={`w-6 h-6 ${errorLicencia ? 'text-red-500' : 'text-[#11295B]'}`} />
              </div>
              <input
                type="text"
                id="NroLicencia"
                name="NroLicencia"
                value={NroLicencia}
                placeholder="00000000"
                onChange={(e) => {
                  const input = e.target.value;

                  if (!/^\d*$/.test(input)) return;

                  if (input.length > 9) return;

                  setNroLicencia(input);

                  if (input === '') {
                    setErrorLicencia(true);
                    setMensajeErrorLicencia('Este campo no puede estar vacío');
                  } else if (input.length < 6) {
                    setErrorLicencia(true);
                    setMensajeErrorLicencia('Debe tener mínimo 6 dígitos');
                  } else if (input.length > 9) {
                    setErrorLicencia(true);
                    setMensajeErrorLicencia('No debe superar los 9 dígitos');
                  } else {
                    setErrorLicencia(false);
                    setMensajeErrorLicencia('');
                  }
                }}
                className={`w-full pl-12 pr-4 pt-6 pb-2 rounded-lg border focus:outline-none focus:ring-1 ${
                  errorLicencia
                    ? 'border-red-500 text-red-500 placeholder:text-red-400 focus:ring-red-500'
                    : 'border-[#11295B] text-[#11295B] placeholder:text-[#11295B]/50 focus:ring-[#11295B]'
                }`}
              />
              {errorLicencia && mensajeErrorLicencia && (
                <p className="text-sm text-red-500 mt-1">{mensajeErrorLicencia}</p>
              )}
              <span className={`absolute left-12 top-[0.4rem] text-xs font-bold px-1 ${errorLicencia ? 'text-red-500' : 'text-[#11295B]'}`}>
                Nro de licencia
              </span>
            </div>



            <div className="relative w-full mt-4">
              <div className="absolute left-4 top-4">
                <Categoria className={`w-6 h-6 ${errorCategoria ? 'text-red-500' : 'text-[#11295B]'}`} />
              </div>
              <span className={`absolute left-12 top-[0.4rem] text-xs font-bold px-1 z-10 ${errorCategoria ? 'text-red-500' : 'text-[#11295B]'}`}>
                Categoría
              </span>
              <select
                id="categoria"
                name="categoria"
                value={categoriaLicencia}
                onChange={(e) => {
                  const valor = e.target.value;
                  setCategoriaLicencia(valor);

                  if (valor === '') {
                    setErrorCategoria(true);
                    setMensajeErrorCategoria('Seleccione una categoría válida');
                  } else {
                    setErrorCategoria(false);
                    setMensajeErrorCategoria('');
                  }
                }}
                className={`w-full pt-6 pb-2 pl-12 pr-3 rounded-lg border focus:outline-none focus:ring-1 ${
                  errorCategoria
                    ? 'border-red-500 text-red-500 focus:ring-red-500'
                    : 'border-[#11295B] text-[#11295B] focus:ring-[#11295B]'
                }`}
                required
              >
                <option value="" disabled hidden>Seleccionar</option>
                <option value="Particular P">Particular(P)</option>
                <option value="Profesional A">Profesional A</option>
                <option value="Profesional B">Profesional B</option>
                <option value="Profesional C">Profesional C</option>
                <option value="Motorista M">Motorista (M)</option>
                <option value="Especial F">Especial (F)</option>
              </select>

              {errorCategoria && mensajeErrorCategoria && (
                <p className="text-sm text-red-500 mt-1">{mensajeErrorCategoria}</p>
              )}
            </div>



            {/* Última fila */}
            <div className="flex w-full mt-4 gap-4">
              {/* Fecha de emisión */}
              <div className="w-1/2 relative">
                <div className="absolute left-4 top-4">
                  <Calendar className={`w-6 h-6 ${errorFechaEmision ? 'text-red-500' : 'text-[#11295B]'}`} />
                </div>
                <input
                  type="date"
                  min="1900-01-01"
                  max="2099-12-31"
                  onInput={limitarAñoMaximo}
                  id="fechaEmision"
                  value={fechaEmision}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFechaEmisionState(value);

                    const esValida = validarFechaEmision(value);
                    const esMayorQueVencimiento = fechaVencimiento && new Date(value) > new Date(fechaVencimiento);

                    if (!esValida) {
                      const fechaSeleccionada = new Date(value);
                      const hoy = new Date();
                      const hace5Anios = new Date();
                      hace5Anios.setFullYear(hoy.getFullYear() - 5);

                      if (fechaSeleccionada < hace5Anios) {
                        setErrorFechaEmision(true);
                        setMensajeErrorFechaEmision('La fecha no puede ser anterior a hace 5 años');
                      } else if (fechaSeleccionada > hoy) {
                        setErrorFechaEmision(true);
                        setMensajeErrorFechaEmision('La fecha no puede ser posterior a hoy');
                      } else {
                        setErrorFechaEmision(true);
                        setMensajeErrorFechaEmision('Fecha inválida');
                      }
                    } else {
                      setErrorFechaEmision(false);
                      setMensajeErrorFechaEmision('');
                    }
                  }}
                  className={`w-full pl-12 pr-4 pt-6 pb-2 rounded-lg border ${
                    errorFechaEmision
                      ? 'border-red-500 text-red-500 placeholder:text-red-400 focus:ring-red-500'
                      : 'border-[#11295B] text-[#11295B] placeholder:text-[#11295B]/50 focus:ring-[#11295B]'
                  } focus:outline-none focus:ring-1`}
                />
                {errorFechaEmision && mensajeErrorFechaEmision && (
                  <p className="text-sm text-red-500 mt-1">{mensajeErrorFechaEmision}</p>
                )}
                <span className={`absolute left-12 top-[0.4rem] text-xs font-bold px-1 z-10 ${errorFechaEmision ? 'text-red-500' : 'text-[#11295B]'}`}>
                  Fecha de emisión
                </span>
              </div>



              {/* Fecha de vencimiento */}
              <div className="w-1/2 relative">
                <div className="absolute left-4 top-4">
                  <Calendar className={`w-6 h-6 ${errorFechaVencimiento ? 'text-red-500' : 'text-[#11295B]'}`} />
                </div>
                <input
                  type="date"
                  min="1900-01-01"
                  max="2099-12-31"
                  onInput={limitarAñoMaximo}
                  id="fechaVencimiento"
                  name="fechaVencimiento"
                  value={fechaVencimiento}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFechaVencimientoState(value);

                    if (!value) {
                      setErrorFechaVencimiento(true);
                      setMensajeErrorFechaVencimiento('Seleccione una fecha');
                      return;
                    }

                    const vencimiento = new Date(value);
                    const hoy = new Date();
                    const emision = fechaEmision ? new Date(fechaEmision) : null;

                    if (vencimiento < hoy) {
                      setErrorFechaVencimiento(true);
                      setMensajeErrorFechaVencimiento('La fecha debe ser posterior a hoy');
                      return;
                    }

                    if (emision && vencimiento < emision) {
                      setErrorFechaVencimiento(true);
                      setMensajeErrorFechaVencimiento('No puede ser menor que la fecha de emisión');
                      return;
                    }

                    if (emision) {
                      const cincoAnios = new Date(emision);
                      cincoAnios.setFullYear(cincoAnios.getFullYear() + 5);

                      if (vencimiento > cincoAnios) {
                        setErrorFechaVencimiento(true);
                        setMensajeErrorFechaVencimiento('La vigencia máxima permitida es de 5 años');
                        return;
                      }
                    }

                    setErrorFechaVencimiento(false);
                    setMensajeErrorFechaVencimiento('');
                  }}
                  className={`w-full pl-12 pr-4 pt-6 pb-2 rounded-lg border ${
                    errorFechaVencimiento
                      ? 'border-red-500 text-red-500 placeholder:text-red-400 focus:ring-red-500'
                      : 'border-[#11295B] text-[#11295B] placeholder:text-[#11295B]/50 focus:ring-[#11295B]'
                  } focus:outline-none focus:ring-1`}
                />
                {errorFechaVencimiento && mensajeErrorFechaVencimiento && (
                  <p className="text-sm text-red-500 mt-1">{mensajeErrorFechaVencimiento}</p>
                )}
                <span className={`absolute left-12 top-[0.4rem] text-xs font-bold px-1 z-10 ${errorFechaVencimiento ? 'text-red-500' : 'text-[#11295B]'}`}>
                  Fecha de vencimiento
                </span>
              </div>
            </div>
          </div>


          {/* Columna derecha - Imágenes */}
          <div className="w-1/2 space-y-6">
            <h2 className="text-2xl font-bold text-[#11295B] mb-2">DATOS PERSONALES Y DE LICENCIA</h2>

             {/* Imagen anverso */}
              <div className="bg-gray-100 p-4 rounded-xl">
                <label className="font-semibold text-[#11295B]">Imagen anverso de la Licencia</label>
                <p className="text-sm text-gray-600">Toma la foto en un lugar bien iluminado</p>
                <div
                  className="mt-2 border border-dashed border-gray-400 bg-gray-200 rounded text-center cursor-pointer hover:bg-gray-300 flex items-center justify-center h-20"
                  onClick={() => anversoRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (!file) return;

                    if (file.type !== "image/png") {
                      setErrorAnverso("Solo se permiten imágenes en formato PNG.");
                      setAnverso(null);
                      return;
                    }

                    const fakeEvent = {
                      target: { files: [file] }
                    } as unknown as React.ChangeEvent<HTMLInputElement>;

                    handleFileChange(fakeEvent, "anverso");
                  }}

                >
                  <span className="text-[#11295B] font-semibold z-10 relative">
                    {anverso ? 'Cambiar imagen' : 'Subir imagen / Arrastrar aquí'}
                  </span>
                </div>

                <input
                  ref={anversoRef}
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'anverso')}
                />
                {renderImagePreview(anverso, 'anverso')}
                {mensajeErrorAnverso && (
                  <p className="text-sm text-red-500 mt-2">{mensajeErrorAnverso}</p>
                )}

                {errorAnverso && (
                  <p className="text-sm text-red-500 mt-1">{errorAnverso}</p>
                )}
              </div>

              {/* Imagen reverso */}
              <div className="bg-gray-100 p-4 rounded-xl">
                <label className="font-semibold text-[#11295B]">Imagen reverso de la Licencia</label>
                <p className="text-sm text-gray-600">Toma la foto en un lugar bien iluminado</p>
                <div
                  className="mt-2 border border-dashed border-gray-400 bg-gray-200 rounded text-center cursor-pointer hover:bg-gray-300 flex items-center justify-center h-20"
                  onClick={() => reversoRef.current?.click()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (!file) return;

                    if (file.type !== "image/png") {
                      setErrorReverso("Solo se permiten imágenes en formato PNG.");
                      setReverso(null);
                      return;
                    }

                    const fakeEvent = {
                      target: { files: [file] }
                    } as unknown as React.ChangeEvent<HTMLInputElement>;

                    handleFileChange(fakeEvent, "reverso");
                  }}

                  onDragOver={(e) => e.preventDefault()}
                >
                  <span className="text-[#11295B] font-semibold z-10 relative">
                    {reverso ? 'Cambiar imagen' : 'Subir imagen / Arrastrar aquí'}
                  </span>
                </div>

                <input
                  ref={reversoRef}
                  type="file"
                  accept="image/png"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, 'reverso')}
                />
                {renderImagePreview(reverso, 'reverso')}
                {mensajeErrorReverso && (
                  <p className="text-sm text-red-500 mt-2">{mensajeErrorReverso}</p>
                )}

                {errorReverso && (
                  <p className="text-sm text-red-500 mt-1">{errorReverso}</p>
                )}
              </div>

            
            <div className="flex justify-end mt-12 pr-6">
            


              <div className="flex justify-end gap-8 mt-1 px-6">
                <button
                  onClick={() => {
                    localStorage.removeItem("registroDriverPaso1");
                    router.push('/home/homePage');
                  }}
                  className="px-6 py-2 bg-[#E0E0E0] text-[#11295B] rounded-full text-sm font-semibold hover:bg-[#d6d6d6] transition"
                >
                  Atrás
                </button>

                <button
                  onClick={handleSubmit}
                  className="px-6 py-2 bg-[#FFA800] text-white rounded-full text-sm font-semibold hover:bg-[#e19900] transition"
                >
                  Continuar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
  );
}
