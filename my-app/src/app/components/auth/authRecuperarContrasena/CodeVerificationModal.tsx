'use client';

import { useState, useRef } from 'react';

const CodeVerificationModal = ({
  onClose,
  onCodeVerificationSubmit,
  onBlocked,
}: {
  onClose: () => void;
  onCodeVerificationSubmit: (code: string) => void;
  onBlocked?: () => void;
}) => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setCode(value);
    setErrorMessage('');
  };

  const handleFocus = () => {
    inputRef.current?.focus();
  };

  const handleConfirm = async () => {
    if (code.length !== 6) {
      setErrorMessage('El código debe tener 6 dígitos.');
      return;
    }

    console.log('🚀 Enviando al backend:', { code });

    try {
      const response = await fetch('http://localhost:3001/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      

      const data = await response.json();

    if (!response.ok) {
      // The request failed
      if (response.status === 400 && data.message.includes('Usuario bloqueado temporalmente')) {
        // Handle the specific lockout error
        setErrorMessage('Has sido bloqueado temporalmente. Intenta nuevamente más tarde.');
        onBlocked?.();
      } else {
        // Handle other errors
        //alert(`Error: ${data.message || 'Unknown error occurred.'}`);
        setErrorMessage(data.message || 'Codigo incorrecto. Por favor intenta nuevamente.');

      }
      return;
    }

    // Success path
    console.log('Code verified successfully:', data);
    onCodeVerificationSubmit(code); // Pass the code to the next step
    //alert('Código verificado correctamente');
    } catch (error) {
      console.error('Network or unexpected error:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Error de comunicación con el servidor. Inténtalo de nuevo más tarde.');
      }
    }
  };

  return (
    <div className="fixed w-full h-full flex justify-center items-center z-[9999] left-0 top-0 bg-black/50 font-sans">
      <div className="w-[33rem] bg-white p-10 rounded-[35px] shadow-[0_0px_20px_rgba(0,0,0,0.72)]">

        <h1 className="text-center text-[#11295B] text-[1.44rem] font-medium leading-normal mb-4 drop-shadow-md">
          Recupera tu contraseña de <br />
          <span className="text-[#FCA311] font-black text-[2.074rem] drop-shadow-sm">
            REDIBO
          </span>
        </h1>

        <p className="text-center text-base text-black mb-6">
          Redibo envió un código de verificación a tu correo. Ingresa el código por favor
        </p>

        <h5 className="text-base text-[#023197] mb-4 text-left">
          Código de verificación
        </h5>

        <div
          className="relative w-full max-w-[450px] cursor-text bg-white mx-0 my-4 pb-6 p-3 rounded-lg border-2 border-solid border-black"
          onClick={handleFocus}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="numeric"
            className="absolute opacity-0 pointer-events-auto w-full h-full z-[1]"
            value={code}
            onChange={handleChange}
          />
          <div className="flex gap-2.5 justify-start z-0">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="flex flex-col items-center w-[30px]" key={i}>
                <span className="text-[22px] font-bold h-6 text-black">
                  {code[i] || ' '}
                </span>
                <span className="text-[22px] text-[#aaa] leading-[0]">__</span>
              </div>
            ))}
          </div>
        </div>

        {errorMessage && (
          <div className="text-red-600 text-center mb-4 font-semibold">
            {errorMessage}
          </div>
        )}

        <button
          className="w-full bg-[rgba(252,163,17,0.5)] hover:bg-[#FCA311] text-white p-4 rounded-[40px] transition-colors disabled:opacity-50"
          onClick={handleConfirm}
          disabled={code.length !== 6}
        >
          Verificar código
        </button>

        <button
          className="text-[#11295B] underline cursor-pointer w-full mt-4"
          onClick={onClose}
        >
          Atrás
        </button>
      </div>
    </div>
  );
};

export default CodeVerificationModal;
