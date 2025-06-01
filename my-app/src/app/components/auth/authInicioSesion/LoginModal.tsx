'use client';
//LoginModal.tsx
////////////back///////////
import { useState } from 'react';
import { login } from '@/libs/authServices'; // Importa tu servicio
import { useRouter } from 'next/navigation';
import ModalInicioSesion2FA from '@/app/components/modals/ModalInicioSesion';
///////////////////////////
export default function LoginModal({ onClose, onRegisterClick, onPasswordRecoveryClick}: { 
  onClose: () => void; 
  onRegisterClick: () => void; 
  onPasswordRecoveryClick: () => void;
}) {
  const handleGoogleLogin = () => {
    try {
      setLoading(true);
      console.log("🚀 Iniciando registro con Google");

      localStorage.setItem("openCompleteProfileModal", "true"); // 👈 NO abrir modal de perfil
      localStorage.setItem("welcomeMessage", "¡Bienvenido de nuevo!");
      // Pequeño delay para que el spinner alcance a mostrarse
      setTimeout(() => {
        console.log("➡️ Redirigiendo a Google OAuth");
        window.location.href =
          "http://localhost:3001/api/auth/google";
      }, 300); // 300ms = 0.3 segundos
    } catch (error) {
      console.error("❌ Error en registro con Google", error);
      setLoading(false);
    }
  };
  
  ////////////Back//////////////
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  //Correo dominio//
  const [errorBeforeAt, setErrorBeforeAt] = useState('');//Validacion que contenga texto antes del @

  const [errorTextAfterAt, setErrorTextAfterAt] = useState('');//Validacion que contenga dominio despues del @

  const [errorAtSymbol, setErrorAtSymbol] = useState(''); //Validacion del @

  const [errorEmailLength, setErrorEmailLength] = useState('');

  const [errorDomain, setErrorDomain] = useState('');

  const [error, setError] = useState('');

  const [errorPasswordLength, setErrorPasswordLength] = useState('');

  //Efecto de boton cuando no escribes en los inputs correo y contraseña
  const isButtonDisabled = !email || !password;
  const [hasLoginError, setHasLoginError] = useState(false);

  //Efecto de boton de activar o desactivar poder ver la contraseña
  const [showPassword, setShowPassword] = useState(false);

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const router = useRouter();

  const handleLogin = async () => {
    setError('');
    setErrorPasswordLength('');
    //añadi recien 
    setErrorBeforeAt('');
    setErrorTextAfterAt('');
    setError('');
    setErrorPasswordLength('');
    setErrorDomain('');
    setErrorAtSymbol('');
    

    
    //Dominio
    setErrorDomain('');
    const allowedDomains = [
      '@gmail.com', 
      '@outlook.com', 
      '@hotmail.com', 
      '@live.com', 
      '@yahoo.com', 
      '@icloud.com', 
      '@proton.me'
    ];

    //validar el signo @
    if (!email.includes('@')) {
      setErrorAtSymbol('Incluye un signo @ en el correo electrónico.');
      setHasLoginError(true);
      return;
    }

    // Validar que contenga texto antes del @
    const atIndex = email.indexOf('@');
    if (atIndex <= 0) {
      setErrorBeforeAt('Ingresa nombre de usuario antes del signo @');
      setHasLoginError(true);
      return;
    }
    // Validar que contenga texto después del @
    const textAfterAt = email.substring(atIndex + 1);

    if (textAfterAt.trim() === '') {
      setErrorTextAfterAt('Ingresa un dominio después del signo @');
      setHasLoginError(true);
      return;
    }


    
    const emailDomain = email.substring(email.indexOf('@'));
  
    if (!allowedDomains.includes(emailDomain)) {
      setErrorDomain('Introduzca un dominio correcto.');
      setHasLoginError(true);
      return; // ⚠️ No intentar loguear si el dominio es incorrecto
  }
  // Validar longitud
  if (password.length < 8 || password.length > 25) {
    setErrorPasswordLength('La cantidad mínima es de 8 caracteres y el máximo es de 25 caracteres.');
    setHasLoginError(true);
    return; // si no cumple longitud, NO INTENTAR loguear
  }

    try {
      const result = await login(email, password);
      console.log('Respuesta del login:', result);

      // Verificar si requiere 2FA
      if (result.requires2FA) {
        // AQUÍ VA EL CÓDIGO PARA ENVIAR EL 2FA
        try {
          await fetch('http://localhost:3001/api/2fa/enviar', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${result.tempToken}`,
            },
          });
        } catch (error) {
          console.error('Error al enviar código 2FA:', error);
        }
        
        // Guardar datos temporales
        setTempToken(result.tempToken);
        setUserEmail(email);
        setShow2FAModal(true);
        // NO cerrar el modal de login ni redirigir aún
        return;
      }

      // Login exitoso sin 2FA
      localStorage.setItem('token', result.token);
      localStorage.setItem('nombreCompleto', result.user.nombreCompleto);
      localStorage.setItem('loginSuccess', 'true');
      
      setError('');
      setHasLoginError(false);
      router.push('/home/homePage');
      
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Los datos no son válidos.');
      setHasLoginError(true);
    }
    
  };
  const handle2FASuccess = () => {
    localStorage.setItem('loginSuccess', 'true');
    localStorage.setItem('token', localStorage.getItem('token') || ''); // Asegurar que el token esté guardado
    setShow2FAModal(false);
    onClose();
    
    // Forzar recarga para que se ejecute el useEffect en HomePage
    window.location.href = '/home/homePage';
  };
  /////////////////////////////////


  return (
    <>
    <div className="fixed inset-0 flex justify-center items-center z-[9999] bg-black/20">
      <div className="w-full h-full  
      p-10 bg-[var(--blanco)] 
      sm:h-auto sm:w-[34rem] sm:rounded-[35px] sm:shadow-[0_0px_20px_rgba(0,0,0,0.72)]">
        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="ml-auto block w-fit h-[30px] cursor-pointer text-[var(--azul-oscuro)] font-[var(--tamaño-black)]"
          onClick={onClose}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>

        <h1 className="text-center text-[var(--azul-oscuro)] text-[1.44rem] font-medium leading-normal mb-4" style={{ fontFamily: 'var(--fuente-principal)', textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>
          Bienvenido a <br />
          <span className="text-[var(--naranja)] font-[var(--tamaño-black)] text-[2.488rem]" style={{ fontFamily: 'var(--fuente-principal)', textShadow: '1px 2px 2px rgba(0,0,0,0.3)' }}>
            REDIBO
          </span>
          <br />
          <span className="text-[var(--azul-oscuro)] font-[var(--tamaño-regular)] text-[2.074rem] uppercase" style={{ fontFamily: 'var(--fuente-principal)', textShadow: '2px 2px 4px rgba(0,0,0,0.4)' }}>
            Iniciar sesión
          </span>
        </h1>
        <div className="flex justify-center mb-6 font-bold">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-64 flex py-2 shadow-[2px_2px_4px_rgba(0,0,0,0.4)] border-2 border-[var(--negro)] rounded-lg cursor-pointer 
        transition-all duration-150
        active:scale-95 active:shadow-inner
        hover:shadow-md"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48" 
          width="24px" 
          height="24px"
          className='mx-3'>
          <path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
          <path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
          <path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
          <path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <h4 className='text-[var(--azul-oscuro)] ms-10'>
            Iniciar sesión
          </h4>
        </button>
        </div>
        {/*borde correo*/}
        <div className={`flex shadow-[2px_2px_4px_rgba(0,0,0,0.4)] mt-0 rounded-lg border-2 border-solid ${hasLoginError ? 'border-[var(--rojo)]' : 'border-[var(--negro)]'}`}>
          {/*icono correo*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'} w-[30px] h-[30px] ml-4 mr-0 my-4`}
          >
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
          <div className="flex flex-col w-full">
            {/*text correo*/}
            <h4 className={`${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'} text-[0.8rem] font-[var(--tamaña-bold)] indent-[1rem] mt-2`} style={{ fontFamily: 'var(--fuente-principal)' }}>
              Correo
            </h4>
            {/*input correo*/}
            <input
              type="text"
              placeholder="Ingrese correo electrónico"
              className={`w-full h-4 p-4 rounded-lg ${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'}`}
              ////////////////back////////////////
              value = {email}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 70) {
                  setEmail(value);
                  setErrorEmailLength('');
                } else {
                  setErrorEmailLength('La cantidad máxima es de 70 caracteres');
                }
              }}
              
              //////////////////////////////////////
              style={{ fontFamily: 'var(--fuente-principal)', fontWeight: 'var(--tamaña-bold)', outline: 'none' }}
            />
          </div>
        </div>

        {errorDomain && (<p className="text-[var(--rojo)] text-center text-[0.8rem] font-[var(--tamaña-bold)] mt-1">{errorDomain}</p>)}
        {errorAtSymbol && (<p className="text-[var(--rojo)] text-center text-[0.8rem] font-[var(--tamaña-bold)] mt-1">{errorAtSymbol}</p>)}
        {errorBeforeAt && (<p className="text-[var(--rojo)] text-center text-[0.8rem] font-[var(--tamaña-bold)] mt-1">{errorBeforeAt}</p>)}
        {errorTextAfterAt && (<p className="text-[var(--rojo)] text-center text-[0.8rem] font-[var(--tamaña-bold)] mt-1">{errorTextAfterAt}</p>)}
        {errorEmailLength && (<p className="text-[var(--rojo)] text-center text-[0.8rem] font-[var(--tamaña-bold)] mt-1">{errorEmailLength}</p>)}

        {/*borde contraseña*/}
        <div className={`flex shadow-[2px_2px_4px_rgba(0,0,0,0.4)] mt-6 rounded-lg border-2 border-solid ${hasLoginError ? 'border-[var(--rojo)]' : 'border-[var(--negro)]'}`}>
          {/*icono correo*/}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={`${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'} w-[30px] h-[30px] ml-4 mr-0 my-4`}
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.75 1.5a6.75 6.75 0 0 0-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 0 0-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 0 0 .75-.75v-1.5h1.5A.75.75 0 0 0 9 19.5V18h1.5a.75.75 0 0 0 .53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1 0 15.75 1.5Zm0 3a.75.75 0 0 0 0 1.5A2.25 2.25 0 0 1 18 8.25a.75.75 0 0 0 1.5 0 3.75 3.75 0 0 0-3.75-3.75Z"
            />
          </svg>
          <div className="flex flex-col w-full">
            <h4 className={`${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'} text-[0.8rem] font-[var(--tamaña-bold)] indent-[1rem] mt-2`} style={{ fontFamily: 'var(--fuente-principal)' }}>
              Contraseña
            </h4>
            <input
              type={showPassword ? 'text' : 'password'}
              
              placeholder="Ingrese contraseña"
              className={`w-full h-4 p-4 rounded-lg  ${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'}`}
              ////////////////back////////////////
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 25) {
                  setPassword(value);
                  setErrorPasswordLength('');
                } else {
                  setErrorPasswordLength('La cantidad mínima es de 8 caracteres y el máximo es de 25 caracteres.');
                }
                
              }}
              ////////////////////////////////////
              style={{ fontFamily: 'var(--fuente-principal)', fontWeight: 'var(--tamaña-bold)', outline: 'none' }}
            />
          </div>

          {password ? ( showPassword ? (
              // OJO TACHADO (activo)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick={() => setShowPassword(false)}
                className={`w-[30px] h-[30px] ml-0 mr-4 my-4 text-[var(--azul-oscuro)] cursor-pointer hover:scale-110 transition-all duration-200 ${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'}`}
              >
                <path d="M1.5 12s3.75-6.75 10.5-6.75S22.5 12 22.5 12s-3.75 6.75-10.5 6.75S1.5 12 1.5 12z" />
                <circle cx="12" cy="12" r="5" className="text-[var(--blanco)]"/>
                <circle cx="12" cy="12" r="3" className={`text-[var(--azul-oscuro)] ${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'}`}/>
                <line x1="6" y1="18" x2="18" y2="6" stroke="currentColor" strokeWidth="2" className={`text-[var(--azul-oscuro)] ${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'} `} />
              </svg>
            ) : (
              // OJO NORMAL (activo)
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                onClick={() => setShowPassword(true)}
                className={`w-[30px] h-[30px] ml-0 mr-4 my-4 text-[var(--azul-oscuro)] cursor-pointer hover:scale-110 transition-all duration-200 ${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'}`}
              >
                <path d="M1.5 12s3.75-6.75 10.5-6.75S22.5 12 22.5 12s-3.75 6.75-10.5 6.75S1.5 12 1.5 12z" />
                <circle cx="12" cy="12" r="5" className="text-[var(--blanco)]"/>
                <circle cx="12" cy="12" r="3" className={`text-[var(--azul-oscuro)] ${hasLoginError ? 'text-[var(--rojo)]' : 'text-[var(--azul-oscuro)]'}`}/>
              </svg>
            )
          ) : (
            // OJO DESACTIVADO (sin texto)
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className={`w-[30px] h-[30px] ml-0 mr-4 my-4 ${hasLoginError ? 'text-[rgba(248,89,89,0.5)]' : 'text-[var(--azul-opaco)]'} cursor-not-allowed transition-all duration-200`}
            >
              <path d="M1.5 12s3.75-6.75 10.5-6.75S22.5 12 22.5 12s-3.75 6.75-10.5 6.75S1.5 12 1.5 12z" />
              <circle cx="12" cy="12" r="5" className="text-[var(--blanco)]"/>
              <circle cx="12" cy="12" r="3" className={`${hasLoginError ? 'text-[rgba(248,89,89,0.5)]' : 'text-[var(--azul-opaco)]'}`}/>
            </svg>
          )}
  
        </div>
        {errorPasswordLength && (<p className="text-[var(--rojo)] text-center text-[0.8rem] font-[var(--tamaña-bold)] mt-1">{errorPasswordLength}</p>)}
        
        <button 
          ////////////////back///////////////
          onClick={handleLogin}

          //Llamada al boton
          disabled={isButtonDisabled}
          
          ////////////////back////////////////
          className={`w-full 
          ${isButtonDisabled 
            ? 'bg-[rgba(252,163,17,0.5)] cursor-not-allowed' 
            : 'bg-[var(--naranja)] hover:scale-95 hover:bg-[var(--naranja)]'}
          shadow-[0_0px_4px_rgba(0,0,0,0.25)] 
          text-[var(--blanco)] cursor-pointer 
          mt-6 mb-0 p-4 rounded-[40px] 
          border-none font-[var(--tamaña-bold)]
          transition-all duration-300 ease-in-out`} 
          style={{ fontFamily: 'var(--fuente-principal)' }}>
          Iniciar sesión
        </button>

        {error && <p className="text-[var(--rojo)] text-center text-[0.8rem] font-[var(--tamaña-bold)] mt-1">{error}</p>}
        
        <button
          className="text-[var(--azul-oscuro)] underline cursor-pointer w-full transition-colors duration-200 my-4 border-none"
          onClick={() => {
            onClose(); // Cierra el modal de login
            setTimeout(() => {
              onPasswordRecoveryClick(); // Activa el modal de recuperación
            }, 100); // Pequeño delay
          }}

          style={{ background: 'none', fontFamily: 'var(--fuente-principal)' }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--naranja)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--azul-oscuro)')}
        >
          Recuperar Contraseña
        </button>
        
        <h5 className="text-center text-[var(--azul-oscuro)]" style={{ fontFamily: 'var(--fuente-principal)' }}>
          ¿No tienes una cuenta?{' '}
          <button
            className="underline cursor-pointer transition-colors duration-200"
            onClick={() => {
              onClose(); // Cierra el modal de registro
              setTimeout(() => {
              onRegisterClick(); // Abre el de login
             }, 100); // Breve delay
           }}

            style={{ fontFamily: 'var(--fuente-principal)', color: 'var(--azul-oscuro)' }}
            onMouseOver={(e) => (e.currentTarget.style.color = 'var(--naranja)')}
            onMouseOut={(e) => (e.currentTarget.style.color = 'var(--azul-oscuro)')}
          >
            Registrarse
          </button>
        </h5>
      </div>
      
     </div>
      {/* Modal 2FA - AQUÍ VA DESPUÉS DE CERRAR EL DIV PRINCIPAL */}
      {show2FAModal && (
        <ModalInicioSesion2FA 
          onClose={() => setShow2FAModal(false)}
          tempToken={tempToken}
          email={userEmail}
          onSuccess={handle2FASuccess}
        />
      )}
    </>
  );
}
