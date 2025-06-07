"use client";

import React, { useState, useRef, useEffect } from "react";
import { X, CreditCard, QrCode, DollarSign } from "lucide-react";
import Image from "next/image";
interface Props {
  onClose: () => Promise<void>;
  onNext: (data: {
    tipo: "card" | "QR" | "cash";
    cardNumber?: string;
    expiration?: string;
    cvv?: string;
    cardHolder?: string;
    qrImage?: File | null;
    efectivoDetalle?: string;
  }) => void;
}

export default function PaymentRegistrationModal({ onClose, onNext }: Props) {
  const [selectedOption, setSelectedOption] = useState<"card" | "QR" | "cash" | null>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [qrImage, setQrImage] = useState<File | null>(null);
  const [cashDetail, setCashDetail] = useState("");
  const [previewImg, setPreviewImg] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  //const currentYear = new Date().getFullYear();

  // Validación en tiempo real para cada campo cuando cambia
  useEffect(() => {
    if (selectedOption === "card" && touched.cardNumber) {
      validateCardNumber(cardNumber);
    }
  }, [cardNumber, touched.cardNumber, selectedOption]);

  useEffect(() => {
    if (selectedOption === "card" && touched.expiryDate) {
      validateExpiryDate(expiryDate);
    }
  }, [expiryDate, touched.expiryDate, selectedOption]);

  useEffect(() => {
    if (selectedOption === "card" && touched.cvv) {
      validateCVV(cvv);
    }
  }, [cvv, touched.cvv, selectedOption]);

  useEffect(() => {
    if (selectedOption === "card" && touched.cardHolder) {
      validateCardHolder(cardHolder);
    }
  }, [cardHolder, touched.cardHolder, selectedOption]);

  // Funciones de validación individuales
  const validateCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, "");
    if (!cleanValue) {
      setErrors(prev => ({ ...prev, cardNumber: "Número de TARJETA_DEBITO requerido" }));
      return false;
    } else if (!/^\d+$/.test(cleanValue)) {
      setErrors(prev => ({ ...prev, cardNumber: "Solo números permitidos" }));
      return false;
    } else if (cleanValue.length !== 16) {
      setErrors(prev => ({ ...prev, cardNumber: "Debe tener 16 dígitos" }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, cardNumber: "" }));
      return true;
    }
  };

  const validateExpiryDate = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, expiryDate: "Fecha requerida" }));
      return false;
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) {
      setErrors(prev => ({ ...prev, expiryDate: "Fecha inválida (MM/YY)" }));
      return false;
    } else {
      // Validar que la fecha esté en el rango válido 2025-2050
      const [month, year] = value.split('/');
      const expYear = 2000 + parseInt(year);
      
      // Solo permitir años entre 2025 y 2050
      if (expYear < 2025 || expYear > 2050) {
        setErrors(prev => ({ ...prev, expiryDate: "El año debe estar entre 2025 y 2050" }));
        return false;
      }
      
      // Si el año es 2025, verificar que el mes no haya pasado ya
      if (expYear === 2025) {
        const currentMonth = new Date().getMonth() + 1; // getMonth() es 0-indexed
        if (parseInt(month) < currentMonth) {
          setErrors(prev => ({ ...prev, expiryDate: "Tarjeta expirada" }));
          return false;
        }
      }
      
      setErrors(prev => ({ ...prev, expiryDate: "" }));
      return true;
    }
  };

  const validateCVV = (value: string) => {
    if (!value) {
      setErrors(prev => ({ ...prev, cvv: "CVV requerido" }));
      return false;
    } else if (!/^\d+$/.test(value)) {
      setErrors(prev => ({ ...prev, cvv: "Solo números permitidos" }));
      return false;
    } else if (value.length !== 3) { // Exactamente 3 dígitos para Bolivia
      setErrors(prev => ({ ...prev, cvv: "CVV debe ser de 3 dígitos" }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, cvv: "" }));
      return true;
    }
  };

  const validateCardHolder = (value: string) => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, cardHolder: "Nombre del titular requerido" }));
      return false;
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
      setErrors(prev => ({ ...prev, cardHolder: "Solo caracteres alfabéticos permitidos" }));
      return false;
    } else if (/\s{2,}/.test(value)) {
      setErrors(prev => ({ ...prev, cardHolder: "No se puede poner doble espacio" }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, cardHolder: "" }));
      return true;
    }
  };

  // Manejo de TARJETA_DEBITO de crédito con formato automático
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Permitir solo números y limitar a 19 caracteres (16 números + 3 espacios)
    if (value === "" || /^[\d\s]+$/.test(value) && value.length <= 19) {
      // Formatear el número con espacios cada 4 dígitos
      const formattedValue = value
        .replace(/\s/g, '') // Eliminar espacios existentes
        .match(/.{1,4}/g)?.join(' ') || value; // Agregar espacios cada 4 dígitos
      
      setCardNumber(formattedValue);
      
      // Validación en tiempo real mientras escribe
      if (touched.cardNumber) {
        validateCardNumber(formattedValue);
      }
    }
  };

  // Manejo de fecha de expiración con formato automático
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Solo permitir números y / y limitar a 5 caracteres (MM/YY)
    if (value === "" || /^[\d/]+$/.test(value) && value.length <= 5) {
      // Añadir la / automáticamente después de 2 dígitos
      if (value.length === 2 && !value.includes('/') && expiryDate.length < value.length) {
        setExpiryDate(value + '/');
      } else if (value.length === 2 && value.includes('/')) {
        setExpiryDate(value.replace('/', ''));
      } else {
        setExpiryDate(value);
      }
      
      // Validación en tiempo real mientras escribe
      if (touched.expiryDate && value.length === 5) {
        validateExpiryDate(value);
      }
    }
  };

  // Manejo de CVV con restricciones
  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Solo permitir números y limitar a exactamente 3 dígitos para Bolivia
    if (value === "" || (/^\d+$/.test(value) && value.length <= 3)) {
      setCvv(value);
      
      // Validación en tiempo real mientras escribe
      if (touched.cvv) {
        validateCVV(value);
      }
    }
  };

  // Manejo del nombre del titular
  const handleCardHolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Reemplazar múltiples espacios consecutivos con un solo espacio
    value = value.replace(/\s{2,}/g, " ");
    
    // Permitir solo letras, espacios y limitar a un máximo de 30 caracteres
    if (/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value) && value.length <= 30) {
      setCardHolder(value);
    }
    
    // Validación en tiempo real mientras escribe
    if (touched.cardHolder) {
      validateCardHolder(value);
    }
  };

  // Marcar campo como tocado cuando el usuario interactúa con él
  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validar al perder el foco
    switch (field) {
      case 'cardNumber':
        validateCardNumber(cardNumber);
        break;
      case 'expiryDate':
        validateExpiryDate(expiryDate);
        break;
      case 'cvv':
        validateCVV(cvv);
        break;
      case 'cardHolder':
        validateCardHolder(cardHolder);
        break;
      case 'cashDetail':
        if (!cashDetail.trim()) {
          setErrors(prev => ({ ...prev, cashDetail: "Debes proporcionar una descripción para el EFECTIVO" }));
        } else {
          setErrors(prev => ({ ...prev, cashDetail: "" }));
        }
        break;
    }
  };

  // Validación completa antes de enviar
  const validate = () => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    if (!termsAccepted) {
      newErrors.terms = "Debes aceptar los términos";
      isValid = false;
    }

    if (!selectedOption) {
      newErrors.method = "Selecciona una forma de pago";
      isValid = false;
    }

    if (selectedOption === "card") {
      // Marcar todos los campos como tocados para mostrar todos los errores
      setTouched({
        cardNumber: true,
        expiryDate: true,
        cvv: true,
        cardHolder: true
      });
      
      const isCardNumberValid = validateCardNumber(cardNumber);
      const isExpiryDateValid = validateExpiryDate(expiryDate);
      const isCVVValid = validateCVV(cvv);
      const isCardHolderValid = validateCardHolder(cardHolder);
      
      isValid = isCardNumberValid && isExpiryDateValid && isCVVValid && isCardHolderValid && termsAccepted;
    } else if (selectedOption === "QR") {
      if (!qrImage) {
        setErrors(prev => ({ ...prev, qrImage: "Debes subir una imagen QR" }));
        isValid = false;
      } else if (!/\.(jpg|jpeg|png)$/i.test(qrImage.name)) {
        setErrors(prev => ({ ...prev, qrImage: "Formato inválido. Solo .jpg, .jpeg o .png" }));
        isValid = false;
      }
    } else if (selectedOption === "cash") {
      if (!cashDetail.trim()) {
        setErrors(prev => ({ ...prev, cashDetail: "Debes proporcionar una descripción para el EFECTIVO" }));
        isValid = false;
      }
    }
    
    // Actualizar errors con newErrors si hay nuevos errores
    if (Object.keys(newErrors).length > 0) {
      setErrors(prev => ({ ...prev, ...newErrors }));
    }
    
    return isValid;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    if (selectedOption === "card") {
      onNext({
        tipo: "card",
        cardNumber,
        expiration: expiryDate,
        cvv,
        cardHolder,
      });
    } else if (selectedOption === "QR") {
      onNext({
        tipo: "QR",
        qrImage,
      });
    } else if (selectedOption === "cash") {
      onNext({
        tipo: "cash",
        efectivoDetalle: cashDetail,
      });
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validar extensión del archivo
      if (!/\.(jpg|jpeg|png)$/i.test(file.name)) {
        setErrors(prev => ({ ...prev, qrImage: "Formato inválido. Solo .jpg, .jpeg o .png" }));
        return;
      }
      
      setQrImage(file);
      setPreviewImg(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, qrImage: "" }));
    }
  };
  
  const handleDeleteImage = () => {
    setQrImage(null);
    setPreviewImg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Forzar reset para permitir re-subir la misma imagen
    }
  };
    
  const handleQrImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar extensión del archivo
      if (!/\.(jpg|jpeg|png)$/i.test(file.name)) {
        setErrors(prev => ({ ...prev, qrImage: "Formato inválido. Solo .jpg, .jpeg o .png" }));
        return;
      }
      
      setQrImage(file);
      setPreviewImg(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, qrImage: "" }));
    }
  };

  const handleCancel = async () => {
    setSelectedOption(null);
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setCardHolder("");
    setQrImage(null);
    setPreviewImg(null);
    setCashDetail("");
    setErrors({});
    setTouched({});
    setTermsAccepted(false);
    await onClose(); // Esto eliminará el vehículo si el usuario cancela
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-xl w-full relative text-[#11295B]">
        <button onClick={handleCancel} className="absolute right-6 top-6 hover:text-red-500 transition">
          <X size={24} />
        </button>

        <h2 className="text-lg font-semibold text-center">Bienvenido a</h2>
        <h1 className="text-3xl font-bold text-center text-[#FCA311] mb-1">REDIBO</h1>
        <h3 className="text-xl font-semibold text-center mb-2">FORMAS DE PAGO</h3>
        <p className="text-center text-sm text-gray-600 mb-6">Elige cómo recibir el pago de tus rentas</p>

        <div className="space-y-6">
          {/* TARJETA */}
          <div className={`rounded-xl shadow-md border-[1.5px] ${selectedOption === "card" ? "border-[#11295B]" : "border-gray-300"}`}>
            <div className="flex items-center pl-4 py-3 border-b cursor-pointer" onClick={() => setSelectedOption("card")}> 
              <input type="radio" checked={selectedOption === "card"} readOnly className="mr-2 accent-[#11295B]" />
              <label className="text-sm font-medium flex items-center"><CreditCard size={16} className="mr-1" /> Número de TARJETA_DEBITO</label>
            </div>
            {selectedOption === "card" && (
              <div className="p-4 space-y-3">
                <div>
                  <input 
                    value={cardNumber} 
                    onChange={handleCardNumberChange}
                    onBlur={() => handleBlur('cardNumber')} 
                    placeholder="1111 2222 3333 4444" 
                    className={`w-full border-[1.5px] rounded-lg px-4 py-3 text-sm outline-none ${errors.cardNumber ? "border-[#DC2626] text-[#DC2626] placeholder-[#DC2626]" : "border-[#11295B]"}`} 
                  />
                  {touched.cardNumber && errors.cardNumber && (
                    <p className="text-xs text-[#DC2626] mt-1">{errors.cardNumber}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <input 
                      value={expiryDate} 
                      onChange={handleExpiryDateChange}
                      onBlur={() => handleBlur('expiryDate')} 
                      placeholder="MM/YY" 
                      className={`w-full border-[1.5px] rounded-lg px-4 py-3 text-sm outline-none ${errors.expiryDate ? "border-[#DC2626] text-[#DC2626] placeholder-[#DC2626]" : "border-[#11295B]"}`} 
                    />
                    {touched.expiryDate && errors.expiryDate && (
                      <p className="text-xs text-[#DC2626] mt-1">{errors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div>
                    <input 
                      value={cvv} 
                      onChange={handleCVVChange}
                      onBlur={() => handleBlur('cvv')} 
                      placeholder="CVV" 
                      className={`w-full border-[1.5px] rounded-lg px-4 py-3 text-sm outline-none ${errors.cvv ? "border-[#DC2626] text-[#DC2626] placeholder-[#DC2626]" : "border-[#11295B]"}`} 
                    />
                    {touched.cvv && errors.cvv && (
                      <p className="text-xs text-[#DC2626] mt-1">{errors.cvv}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <input 
                    value={cardHolder} 
                    onChange={handleCardHolderChange}
                    onBlur={() => handleBlur('cardHolder')} 
                    placeholder="Nombre del titular" 
                    className={`w-full border-[1.5px] rounded-lg px-4 py-3 text-sm outline-none ${errors.cardHolder ? "border-[#DC2626] text-[#DC2626] placeholder-[#DC2626]" : "border-[#11295B]"}`} 
                  />
                  {touched.cardHolder && errors.cardHolder && (
                    <p className="text-xs text-[#DC2626] mt-1">{errors.cardHolder}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* QR */}
          <div className={`rounded-xl shadow-md border-[1.5px] ${selectedOption === "QR" ? "border-[#11295B]" : "border-gray-300"}`}>
            <div
              className="flex items-center pl-4 py-3 border-b cursor-pointer"
              onClick={() => setSelectedOption("QR")}
            >
              <input type="radio" checked={selectedOption === "QR"} readOnly className="mr-2 accent-[#11295B]" />
              <label className="text-sm font-medium flex items-center">
                <QrCode size={16} className="mr-1" /> Imagen de QR
              </label>
            </div>

            {selectedOption === "QR" && (
              <div className="p-4">
                <label className="block font-semibold mb-1 text-[#11295B]">Imagen QR</label>
                <p className="text-sm text-gray-600 mb-2">Asegúrate que el código sea legible</p>

                <div
                  className={`relative w-32 h-24 border-[1.5px] border-dashed rounded-xl text-center flex items-center justify-center cursor-pointer transition-all duration-200 ${
                    errors.qrImage ? "border-[#DC2626]" : "border-[#11295B] hover:bg-gray-100"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  {previewImg ? (
                    <>
                      <Image
                        src={previewImg}
                        alt="QR"
                        width={500} // puedes ajustar según el tamaño deseado
                        height={500}
                        className="w-full h-full object-contain rounded"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteImage();
                        }}
                        className="absolute top-1 right-1 bg-[#11295B] p-1 rounded-full hover:bg-[#11295B]"
                        title="Eliminar imagen"
                      >
                        <X size={14} className="text-white" />
                      </button>
                    </>
                  ) : (
                    <QrCode size={24} className="text-gray-400" />
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleQrImageChange}
                  className="hidden"
                />

                {errors.qrImage ? (
                  <p className="text-sm text-[#DC2626] text-center mt-2">{errors.qrImage}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">*Solo formatos .jpg, .jpeg o .png</p>
                )}
              </div>
            )}
          </div>

          {/* EFECTIVO */}
          <div className={`rounded-xl shadow-md border-[1.5px] ${selectedOption === "cash" ? "border-[#11295B]" : "border-gray-300"}`}>
            <div className="flex items-center pl-4 py-3 border-b cursor-pointer" onClick={() => setSelectedOption("cash")}> 
              <input type="radio" checked={selectedOption === "cash"} readOnly className="mr-2 accent-[#11295B]" />
              <label className="text-sm font-medium flex items-center"><DollarSign size={16} className="mr-1" /> Dinero EFECTIVO</label>
            </div>
            {selectedOption === "cash" && (
              <div className="p-4">
                <textarea 
                  value={cashDetail} 
                  onChange={(e) => setCashDetail(e.target.value)}
                  onBlur={() => handleBlur('cashDetail')} 
                  placeholder="Descripción" 
                  className={`w-full h-24 border-[1.5px] rounded-lg px-4 py-3 text-sm outline-none resize-none ${errors.cashDetail ? "border-[#DC2626] text-[#DC2626] placeholder-[#DC2626]" : "border-[#11295B]"}`}
                />
                {touched.cashDetail && errors.cashDetail && (
                  <p className="text-sm text-[#DC2626] mt-2">{errors.cashDetail}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* TÉRMINOS */}
        <div className="flex items-start mt-6">
          <input 
            type="checkbox" 
            checked={termsAccepted} 
            onChange={() => setTermsAccepted(!termsAccepted)} 
            className="mt-1 mr-2 accent-[#FCA311]" 
          />
          <label className="text-xs text-gray-600">He leído y acepto los <span className="text-[#FCA311] font-medium">Términos y condiciones</span>.</label>
        </div>
        {errors.terms && <p className="text-sm text-[#DC2626] text-center mt-2">{errors.terms}</p>}
        {errors.method && <p className="text-sm text-[#DC2626] text-center mt-2">{errors.method}</p>}

        <div className="flex justify-between mt-8">
          <button 
            onClick={handleCancel} 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-8 rounded-full"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit} 
            className="bg-[#FCA311] hover:bg-[#e29510] text-white font-semibold py-2 px-8 rounded-full"
          >
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
}