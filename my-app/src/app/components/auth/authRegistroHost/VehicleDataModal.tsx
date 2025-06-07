"use client";

import React, { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { MdOutline18UpRating, MdAssuredWorkload } from "react-icons/md";
import Image from "next/image";
interface Props {
  onNext: (data: {
    placa: string;
    soat: string;
    imagenes: File[];
    idAuto: number;
  }) => void;
  onClose: () => void;
}

const VehicleDataModal: React.FC<Props> = ({ onNext, onClose }) => {
  const [placa, setPlaca] = useState("");
  const [soat, setSoat] = useState("");
  const [imagenes, setImagenes] = useState<File[]>([]);
  const [errors, setErrors] = useState<{
    placa?: string;
    soat?: string;
    imagenes?: string;
  }>({});
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Función validadora mejorada para placas bolivianas: 4 dígitos seguidos de 3 letras
  const validarPlaca = (valor: string) => {
    const match = valor.match(/^(\d{4})([A-Z]{3})$/);
    if (!match) return false;
    const numero = parseInt(match[1], 10);
    return numero >= 0 && numero <= 9999;
  };

  // Validar SOAT: exactamente 8 caracteres numéricos
  const validarSOAT = (valor: string) => /^\d{8}$/.test(valor);

  const camposValidos = () =>
    validarPlaca(placa) &&
    validarSOAT(soat) &&
    imagenes.length >= 3 &&
    imagenes.length <= 6 &&
    imagenes.every((file) => ["image/jpeg", "image/png"].includes(file.type));

  const validarYActualizarPlaca = (valor: string) => {
    // Limitar a máximo 7 caracteres
    const valorLimitado = valor.slice(0, 7);
    setPlaca(valorLimitado);
    
    // Formatear errores específicos basados en el patrón correcto
    if (valorLimitado.length === 7) {
      if (!validarPlaca(valorLimitado)) {
        setErrors((prev) => ({
          ...prev,
          placa: "Formato inválido. Debe ser 4 dígitos seguidos de 3 letras (ej. 1234ABC)",
        }));
      } else {
        setErrors((prev) => ({ ...prev, placa: undefined }));
      }
    } else if (valorLimitado.length > 0) {
      setErrors((prev) => ({
        ...prev,
        placa: "La placa debe tener exactamente 7 caracteres (4 números + 3 letras)",
      }));
    } else {
      setErrors((prev) => ({ ...prev, placa: undefined }));
    }
  };

  const validarYActualizarSOAT = (valor: string) => {
    // Limitar a máximo 8 caracteres
    const valorLimitado = valor.slice(0, 8);
    setSoat(valorLimitado);
    
    if (valorLimitado.length === 8) {
      setErrors((prev) => ({
        ...prev,
        soat: validarSOAT(valorLimitado) ? undefined : "Formato inválido. Solo se permiten números.",
      }));
    } else if (valorLimitado.length > 0) {
      setErrors((prev) => ({
        ...prev,
        soat: "El número de seguro debe tener exactamente 8 dígitos",
      }));
    } else {
      setErrors((prev) => ({ ...prev, soat: undefined }));
    }
  };

  const agregarImagenes = (files: File[]) => {
    const validFiles = files.filter(
      (file) =>
        ["image/jpeg", "image/png"].includes(file.type) &&
        file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== files.length) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Solo se permiten imágenes JPG/PNG de hasta 5MB"
      }));
    }

    const totalImagenes = [...imagenes, ...validFiles];

    if (totalImagenes.length > 6) {
      setErrors((prev) => ({
        ...prev,
        imagenes: "Solo puedes subir hasta 6 imágenes del auto",
      }));
      return;
    }

    setImagenes(totalImagenes);

    setErrors((prev) => ({
      ...prev,
      imagenes:
        totalImagenes.length < 3
          ? "Debes subir al menos 3 imágenes del auto (frontal, lateral y trasera)"
          : undefined,
    }));
  };

  const handleImagenesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      agregarImagenes(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      agregarImagenes(Array.from(e.dataTransfer.files));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const nuevasImagenes = imagenes.filter((_, i) => i !== index);
    setImagenes(nuevasImagenes);

    setErrors((prev) => ({
      ...prev,
      imagenes:
        nuevasImagenes.length < 3
          ? "Debes subir al menos 3 imágenes del auto (frontal, lateral y trasera)"
          : undefined,
    }));
  };

  const handleSubmit = () => {
    const nuevosErrores: typeof errors = {};

    if (!validarPlaca(placa)) {
      nuevosErrores.placa = "Formato inválido. Debe ser 4 dígitos seguidos de 3 letras (ej. 1234ABC)";
    }
    if (!validarSOAT(soat)) {
      nuevosErrores.soat = "Formato inválido. El número de seguro debe tener exactamente 8 dígitos";
    }
    if (imagenes.length < 3 || imagenes.length > 6) {
      nuevosErrores.imagenes = "Debes subir entre 3 y 6 imágenes";
    }

    setErrors(nuevosErrores);

    if (Object.keys(nuevosErrores).length > 0) return;

    onNext({
      placa, soat, imagenes,
      idAuto: 0
    });
  };

  // Función para manejar los cambios en el campo de placa con formato específico
  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value.toUpperCase();
    
    // Permitir solo números en los primeros 4 caracteres
    if (valor.length <= 4) {
      if (/^\d*$/.test(valor)) {
        validarYActualizarPlaca(valor);
      }
    } 
    // Permitir solo letras en los siguientes 3 caracteres
    else if (valor.length <= 7) {
      const numeros = valor.substring(0, 4);
      const letras = valor.substring(4).replace(/[^A-Z]/g, '');
      validarYActualizarPlaca(numeros + letras);
    }
  };
  
  // Función para manejar los cambios en el campo de SOAT permitiendo solo números
  const handleSoatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    const valorFiltrado = valor.replace(/\D/g, ''); // Solo permite dígitos
    validarYActualizarSOAT(valorFiltrado);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white text-[#11295B] p-10 rounded-3xl shadow-2xl max-w-xl w-full relative">
        <button onClick={onClose} className="absolute right-6 top-6 text-2xl text-[#11295B]">
          <X />
        </button>

        <h2 className="text-lg font-semibold text-center text-[#11295B]">Bienvenido a</h2>
        <h1 className="text-3xl font-bold text-center text-[#FCA311] drop-shadow-sm mb-2">REDIBO</h1>
        <h3 className="text-xl text-center font-semibold text-[#11295B] mb-1">REGISTRARSE COMO HOST</h3>
        <p className="text-center text-sm text-gray-600 mb-6">Ingresa datos de tu vehículo</p>

        {/* Campo Placa */}
        <div className="mb-4">
          <div className="relative flex items-center">
            <MdOutline18UpRating className="absolute left-3 w-6 h-6" />
            <input
              type="text"
              placeholder="Placa (ej. 1234ABC)"
              value={placa}
              onChange={handlePlacaChange}
              maxLength={7}
              className={`pl-12 w-full border-2 rounded-lg px-4 py-3 outline-none text-lg placeholder:text-[#11295B]/50 font-semibold ${
                errors.placa ? "border-red-500 text-red-500 placeholder-red-400" : "border-[#11295B]"
              }`}
            />
          </div>
          {errors.placa && <p className="text-sm text-red-500 mt-1">{errors.placa}</p>}
          {!errors.placa && placa.length > 0 && placa.length < 7 && (
            <p className="text-sm text-amber-500 mt-1">
              La placa debe tener exactamente 7 caracteres ({7 - placa.length} restantes)
            </p>
          )}
        </div>

        {/* Campo SOAT */}
        <div className="mb-4">
          <div className="relative flex items-center">
            <MdAssuredWorkload className="absolute left-3 w-6 h-6" />
            <input
              type="text"
              inputMode="numeric" 
              pattern="[0-9]*"
              placeholder="Número de seguro (8 dígitos)"
              value={soat}
              onChange={handleSoatChange}
              maxLength={8}
              className={`pl-12 w-full border-2 rounded-lg px-4 py-3 outline-none text-lg placeholder:text-[#11295B]/50 font-semibold ${
                errors.soat ? "border-red-500 text-red-500 placeholder-red-400" : "border-[#11295B]"
              }`}
            />
          </div>
          {errors.soat && <p className="text-sm text-red-500 mt-1">{errors.soat}</p>}
          {!errors.soat && soat.length > 0 && soat.length < 8 && (
            <p className="text-sm text-amber-500 mt-1">
              El número de seguro debe tener exactamente 8 dígitos ({8 - soat.length} restantes)
            </p>
          )}
        </div>

        {/* Campo Imágenes */}
        <div className={`mb-4 bg-gray-100 rounded-xl p-4 ${errors.imagenes ? "border-2 border-red-500" : ""}`}>
          <label className="block font-semibold mb-1 text-[#11295B]">Imágenes del auto</label>
          <p className="text-sm text-gray-600 mb-2">Asegúrate de tomar las fotos en un lugar bien iluminado</p>

          <div
            className={`border border-dashed rounded p-4 text-center cursor-pointer transition-all duration-200 ${
              isDragging ? "bg-gray-300" : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto mb-2 w-6 h-6" />
            <p className="font-medium">Subir imágenes del vehículo</p>
            <p className="text-xs text-gray-500">Haz clic o arrastra aquí tus imágenes</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg, image/png"
            onChange={handleImagenesChange}
            className="hidden"
          />

          {errors.imagenes ? (
            <p className="text-sm text-red-500 mt-2">{errors.imagenes}</p>
          ) : (
            <p className="text-xs text-gray-500 mt-2">*Mínimo 3 fotos del vehículo: frontal, lateral y trasera</p>
          )}

          {/* Vista previa */}
          {imagenes.length > 0 && (
            <div className="flex flex-wrap mt-3 gap-3">
              {imagenes.map((img, idx) => {
                const src = URL.createObjectURL(img);
                return (
                  <div key={`${idx}-${img.name}`} className="relative w-20 h-20">
                    <Image
                      src={src}
                      alt={`imagen-${idx}`}
                      width={200} // puedes ajustar esto según tu diseño
                      height={200} // ajusta también según necesidad
                      onClick={() => setPreviewImg(src)}
                      className="object-cover w-full h-full rounded border border-gray-300 cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(idx);
                      }}
                      title="Eliminar imagen"
                      className="absolute -top-2 -right-2 bg-[#11295B] text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={handleSubmit}
          className={`w-full text-white py-3 rounded-xl font-semibold text-lg mt-2 transition-all duration-200 ${
            camposValidos()
              ? "bg-[#FCA311] hover:bg-[#e29510]"
              : "bg-[#FCA311]/60 cursor-not-allowed"
          }`}
          disabled={!camposValidos()}
        >
          Siguiente
        </button>
      </div>

      {/* Modal de Previsualización */}
      {previewImg && (
        <div
          className="fixed inset-0 bg-black/60 z-[10000] flex items-center justify-center"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative max-w-3xl w-full mx-4">
            <Image
              src={previewImg}
              alt="Previsualización"
              width={600} // Ajusta según tu diseño
              height={400} // Ajusta según proporciones reales
              className="w-full h-auto rounded-xl shadow-xl"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPreviewImg(null);
              }}
              title="Cerrar imagen"
              className="absolute top-2 right-2 text-white text-xl bg-[#11295B]/70 hover:bg-[#11295B] rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleDataModal;