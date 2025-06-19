'use client';

import { useState } from 'react';

const validDomains = ['@gmail.com', '@hotmail.com', '@outlook.com', '@yahoo.com']; // <-- Aquí defines los dominios válidos

const PasswordRecoveryModal = ({
  onClose,
  onPasswordRecoverySubmit,
}: {
  onClose: () => void;
  onPasswordRecoverySubmit: (email: string) => void;
}) => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isValidEmail, setIsValidEmail] = useState(false);

  const validateEmail = (input: string) => {
    setEmail(input);
    
    const emailDomain = input.slice(input.indexOf("@"));

    if (input.trim() === "") {
      setErrorMessage("El correo no puede estar vacío.");
      setIsValidEmail(false);
    } else if (!input.includes("@") || !input.includes(".") || input.length < 5) {
      setErrorMessage("Correo inválido, verifique si contiene '@' y '.'");
      setIsValidEmail(false);
    } else if (input.length == 70) {
      setErrorMessage("El correo no debe superar los 70 caracteres.");
      setIsValidEmail(false);
    } else if (!validDomains.includes(emailDomain)) {
      setErrorMessage("El dominio no es válido.");
      setIsValidEmail(false);
    } else {
      setErrorMessage('');
      setIsValidEmail(true);
    }
  };

  const handlePasswordRecovery = async () => {
    if (!isValidEmail || !email) {
      setErrorMessage('Por favor, ingrese un correo válido.');
      return;
    }

    try {
      const response = await fetch('https://copia-backend.vercel.app/api/recover-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Error desconocido');

      console.log('📧 Correo validado y pasando al siguiente paso:', email);
      onPasswordRecoverySubmit(email);

    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Error al recuperar la contraseña');
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 font-sans">
      <div className="flex flex-col justify-center bg-[var(--blanco)] p-10 h-full w-[33rem] shadow-[0_4px_12px_rgba(0,0,0,0.72)] lg:shadow-[0_4px_12px_rgba(0,0,0,0.72)] lg:rounded-[35px] lg:p-10 lg:h-auto">
        <h2 className="text-center text-[var(--azul-oscuro)] text-[1.44rem] text-shadow-[0px_0px_4px_rgba(0,0,0,0.4)] font-bold leading-normal mb-4 drop-shadow-md">
          Recupera tu contraseña de <br />
          <span className="text-[#FCA311] font-black text-[2.074rem] drop-shadow-sm">
            REDIBO
          </span>
        </h2>

        <p className="text-center text-[var(--azul-oscuro)] font-bold text-sm mb-6">
          Ingresa el correo con el que te registraste en REDIBO.
        </p>

        <div className="relative">
          <input
            className="w-full pl-12 pr-4 border-2 border-black p-4 shadow-[2px_2px_4px_rgba(0,0,0,0.4)] rounded-lg text-[0.95rem] font-bold text-[#11295B] placeholder:text-[#11295B]/50 focus:outline-none focus:ring-2 focus:ring-[#f752521a] font-sans"
            type="email"
            placeholder="usuario@dominio.com"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            required
            maxLength={70}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-[#11295B]"
          >
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
        </div>

        {errorMessage && (
          <div className="text-[#F85959] text-sm mt-2 font-semibold">
            {errorMessage}
          </div>
        )}

        <button
          className={`w-full mt-6 font-semibold py-3 px-4 rounded-lg transition-colors ${
            !isValidEmail
              ? 'bg-[rgba(252,163,17,0.5)] text-white cursor-not-allowed'
              : 'bg-[#FCA311] hover:bg-[#fca211cb]'
          }`}
          onClick={handlePasswordRecovery}
          disabled={!isValidEmail}
        >
          Siguiente
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

export default PasswordRecoveryModal;