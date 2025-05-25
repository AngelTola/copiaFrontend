import styles from "./RegisterModal.module.css";
import { useState } from "react";
import CompleteProfileModal from "./CompleteProfileModal"; // ajusta si cambia el path
import { useEffect } from "react";
/* import { useRouter } from 'next/navigation'; */

export default function RegisterModal({
  onClose,
  onLoginClick,
}: {
  onClose: () => void;
  onLoginClick: () => void;
}) {
  const handleGoogleRegister = () => {
    try {
      setLoading(true);
      console.log("🚀 Iniciando registro con Google");
      localStorage.setItem("openCompleteProfileModal", "true");
      localStorage.setItem("welcomeMessage", "¡Bienvenido a Redibo!");
      // Pequeño delay para que el spinner alcance a mostrarse
      setTimeout(() => {
        console.log("➡️ Redirigiendo a Google OAuth");
        window.location.href =
          "https://redibo-back-wtt.vercel.app/api/auth/google";
      }, 300); // 300ms = 0.3 segundos
    } catch (error) {
      console.error("❌ Error en registro con Google", error);
      setLoading(false);
    }
  };

  /* Parte de las const*/
  const [welcome, setWelcome] = useState("");

  const [showWelcome, setShowWelcome] = useState(false);

  const [loading, setLoading] = useState(false);

  const [nameValue, setNameValue] = useState(
    localStorage.getItem("register_name") || ""
  );
  const [emailValue, setEmailValue] = useState(
    localStorage.getItem("register_email") || ""
  );
  const [passwordValue, setPasswordValue] = useState(
    localStorage.getItem("register_password") || ""
  );
  const [confirmPasswordValue, setConfirmPasswordValue] = useState(
    localStorage.getItem("register_confirmPassword") || ""
  );

  const [phoneValue, setPhoneValue] = useState(
    localStorage.getItem("register_phone") || ""
  );

  const [error, setError] = useState("");

  const [nameError, setNameError] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  /* const [password, setPassword] = useState(""); */
  const [birthError, setBirthError] = useState(false);
  const [birthMessage, setBirthMessage] = useState("");
  const [phoneError, setPhoneError] = useState(false);
  const [phoneMessage, setPhoneMessage] = useState("");
  const [termsError, setTermsError] = useState(false);
  /* const router = useRouter(); */
  /*   const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null; */

  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  /* const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false); */

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const getLabelColor = (hasError: boolean) =>
    hasError ? "#E30000" : "var(--azul-oscuro)";

  const validDomains = [
    "@gmail.com",
    "@outlook.com",
    "@hotmail.com",
    "@live.com",
    "@yahoo.com",
    "@icloud.com",
    "@proton.me",
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

  const autoLogin = params.get("googleAutoLogin");
  const googleComplete = params.get("googleComplete");
  const token = params.get("token");
  const email = params.get("email");
  const shouldOpen = localStorage.getItem("openCompleteProfileModal");
  
  console.log("🌐 URL Params:", { autoLogin, googleComplete, token, email, shouldOpen });

  // ✅ CASO 1: login automático → guardar token y redirigir
  /* if (autoLogin && token && email) {
    console.log("🔑 Auto login detectado");
    localStorage.setItem("token", token);
    localStorage.setItem("google_email", email);
    
    // Limpiar URL
    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("googleAutoLogin");
    cleanUrl.searchParams.delete("token");
    cleanUrl.searchParams.delete("email");
    window.history.replaceState({}, "", cleanUrl.toString());

    window.location.href = "/home/homePage";
    router.push("/home/homePage");
      return;
    } */

  // ✅ CASO 2: token manual → solo guardar
  if (token && email) {
    localStorage.setItem("token", token);
    localStorage.setItem("google_email", email);
    console.log("✅ Token y email guardados");

    const cleanUrl = new URL(window.location.href);
    cleanUrl.searchParams.delete("token");
    cleanUrl.searchParams.delete("email");
    window.history.replaceState({}, "", cleanUrl.toString());
  }

  // ✅ CASO 3: modal de perfil
  
  /* if (googleComplete === "true" && shouldOpen === "true") {
      setShowCompleteProfile(true);
      localStorage.removeItem("openCompleteProfileModal");
    console.log("🧩 Mostrar modal CompleteProfileModal");
  } */

  // ✅ CASO 4: error de cuenta ya registrada
  const googleError = params.get("error");
  if (googleError === "alreadyExists" || googleError === "cuentaExistente") {
    console.log("🧩 Cuenta ya existente");
      setError("Esta cuenta ya está registrada. Por favor, inicia sesión.");
      onClose();
    setTimeout(() => onLoginClick(), 100);
  }

  // ✅ Mensaje de bienvenida
  const message = localStorage.getItem("welcomeMessage");
  if (message) {
    setWelcome(message);
    setShowWelcome(true);
    localStorage.removeItem("welcomeMessage");
    setTimeout(() => setShowWelcome(false), 3000);
    }
    // ✅ Limpieza general
    const url = new URL(window.location.href);
    url.searchParams.delete("googleComplete");
    url.searchParams.delete("error");
    window.history.replaceState({}, document.title, url.toString());
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const form = e.target as HTMLFormElement;

    const name = nameValue.trim();
    const email = emailValue.trim();
    const password = passwordValue.trim();
    const confirmPassword = confirmPasswordValue.trim();
    const phone = phoneValue.trim();

    const birthDay = (form.elements.namedItem("birthDay") as HTMLSelectElement)
      .value;
    const birthMonth = (
      form.elements.namedItem("birthMonth") as HTMLSelectElement
    ).value;
    const birthYear = (
      form.elements.namedItem("birthYear") as HTMLSelectElement
    ).value;

    //manejo de errores

    let hasErrors = false;

    //validaciones de nombre de usuario
    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

if (nameValue.trim().length < 3) {
  setNameError(true);
  setNameMessage("El nombre debe tener al menos 3 caracteres");
  hasErrors = true;
} else if (nameValue.trim().length > 50) {
  setNameError(true);
  setNameMessage("El nombre no puede superar los 50 caracteres");
  hasErrors = true;
} else if (!nameRegex.test(nameValue.trim())) {
  setNameError(true);
  setNameMessage("El nombre solo puede contener letras, tildes y espacios. No se permiten números.");
  hasErrors = true;
} else {
  setNameError(false);
  setNameMessage("");
}


    //validaciones de email

    const emailDomain = email.slice(email.indexOf("@"));

    if (!email.includes("@") || !email.includes(".") || email.length < 5) {
      setEmailError(true);
      setEmailMessage("Correo inválido, verifique si contiene '@' y '.'");
      hasErrors = true;
    } else if (email.length > 70) {
      setEmailError(true);
      setEmailMessage("El correo no debe superar los 70 caracteres.");
      hasErrors = true;
    } else if (!validDomains.includes(emailDomain)) {
      setEmailError(true);
      setEmailMessage("El dominio no es válido");
      hasErrors = true;
    } else {
      setEmailError(false);
      setEmailMessage("");
    }

    //validaciones de passwrod

    if (password.trim() === "") {
      setPasswordMessage("La contraseña no puede estar vacía");
      setPasswordError(true);
      hasErrors = true;
    } else if (!/[A-Z]/.test(password)) {
      setPasswordMessage("Debe contener al menos una letra mayúscula");
      setPasswordError(true);
      hasErrors = true;
    } else if (!/[a-z]/.test(password)) {
      setPasswordMessage("Debe contener al menos una letra minúscula");
      setPasswordError(true);
      hasErrors = true;
    } else if (!/[0-9]/.test(password)) {
      setPasswordMessage("Debe contener al menos un número");
      setPasswordError(true);
      hasErrors = true;
    } else if (!/[!@#$%^&*]/.test(password)) {
      setPasswordMessage("Debe tener al menos un carácter especial (!@#$...)");
      setPasswordError(true);
      hasErrors = true;
    } else if (password.includes(" ")) {
      setPasswordMessage("No puede contener espacios");
      setPasswordError(true);
      hasErrors = true;
    } else if (password.length < 8) {
      setPasswordMessage("La contraseña debe tener al menos 8 caracteres");
      setPasswordError(true);
      hasErrors = true;
    } else if (password.length > 25) {
      setPasswordMessage("No puede tener más de 25 caracteres");
      setPasswordError(true);
      hasErrors = true;
    } else {
      setPasswordError(false);
      setPasswordMessage("");
    }

    // validacion de Confirmar contraseña

    if (confirmPassword.trim() === "") {
      setConfirmPasswordError(true);
      setConfirmPasswordMessage("Debes confirmar la contraseña");
      hasErrors = true;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setConfirmPasswordMessage("Las contraseñas deben coincidir");
      hasErrors = true;
    } else {
      setConfirmPasswordError(false);
      setConfirmPasswordMessage("");
    }

    /*validacion de fecha*/
    const today = new Date();
    const selectedDate = new Date(
      Number(birthYear),
      Number(birthMonth) - 1,
      Number(birthDay)
    );

    const ageDiffMs = today.getTime() - selectedDate.getTime();
    const ageDate = new Date(ageDiffMs);
    const age = Math.abs(ageDate.getUTCFullYear() - 1970);

    const invalidBirth =
      !birthDay || !birthMonth || !birthYear || selectedDate > today;

    if (invalidBirth) {
      setBirthError(true);
      setBirthMessage("Debes completar la fecha de nacimiento");
      hasErrors = true;
    } else if (age < 18) {
      setBirthError(true);
      setBirthMessage("Debes tener al menos 18 años para registrarte");
      hasErrors = true;
    } else if (age > 85) {
      setBirthError(true);
      setBirthMessage("La edad máxima permitida es de 85 años");
      hasErrors = true;  
    } else {
      setBirthError(false);
      setBirthMessage("");
    }

    //validacion de telefono
    const cleanPhone = phone.replace(/\D/g, "");

    if (!phone) {
      setPhoneError(false);
      setPhoneMessage("");
    } else if (!/^[67]/.test(cleanPhone)) {
      setPhoneError(true);
      setPhoneMessage("El número debe comenzar con 6 o 7");
      hasErrors = true;
    } else if (!/^\d{8}$/.test(cleanPhone)) {
      setPhoneError(true);
      setPhoneMessage("El número debe tener exactamente 8 dígitos");
      hasErrors = true;
    } else {
      // Si pasa validaciones de formato, ahora verificamos si ya está en uso en BD
      try {
        const phoneCheckResponse = await fetch(
          "https://redibo-back-wtt.vercel.app/api/check-phone",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ telefono: parseInt(cleanPhone) }),
          }
        );

        const phoneCheckData = await phoneCheckResponse.json();

        if (phoneCheckData.exists) {
          setPhoneError(true);
          setPhoneMessage("El número ya está registrado en el sistema.");
          hasErrors = true; //  Muy importante: detener el submit
        } else {
          setPhoneError(false);
          setPhoneMessage("");
        }
      } catch (error) {
        console.error("Error verificando teléfono:", error);
      }
    }

    //validacion de terminos y condiciones
    const terms = (form.elements.namedItem("terms") as HTMLInputElement)
      .checked;

    if (!terms) {
      setTermsError(true);
      hasErrors = true;
    } else {
      setTermsError(false);
    }

    if (hasErrors) return; // Si hay al menos un error, no continúa

    /*conexion con back end*/
    try {
      const fechaNacimiento = new Date(
        Number(birthYear),
        Number(birthMonth) - 1,
        Number(birthDay)
      ).toISOString();

      const user = {
        nombre_completo: name,
        email,
        contraseña: password,
        fecha_nacimiento: fechaNacimiento,
        telefono: phone ? parseInt(cleanPhone) : null,
      };

      const res = await fetch(
        "https://redibo-back-wtt.vercel.app/api/register",
        {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(user),
      });

      if (res.ok) {
        /* alert("¡Usuario registrado con éxito!"); */
        setShowSuccessModal(true); // ✅ Mostrar el modal
        localStorage.removeItem("register_name");
        localStorage.removeItem("register_email");
        localStorage.removeItem("register_password");
        localStorage.removeItem("register_confirmPassword");
        localStorage.removeItem("register_phone");
        form.reset();
        /* onClose(); */
      } else {
        const data = await res.json();
        setError(
          data.message || "Hubo un error al registrar. Intenta nuevamente."
        );
      }
    } catch (error) {
      console.error(error);
      setError("No se pudo conectar al servidor.");
    }

  };

  return (
    <div className={styles.overlay}>
      {showCompleteProfile && (
        <CompleteProfileModal
          onComplete={(data) => {
            console.log("Perfil completado:", data);
          }}
          onSuccess={() => {
            setShowSuccessModal(true);
            setShowCompleteProfile(false);
          }}
          onClose={onClose}
        />
      )}

      {!showCompleteProfile && (
        <>
          <div className={styles.modal}>
            {showWelcome && (
              <div
                className={`${styles.welcomeMessage} ${
                  !showWelcome ? styles.fadeOut : ""
                }`}
              >
                {welcome}
              </div>
            )}

            <h2 className={styles.title}>Registrarse</h2>

            {/* campo registro con google */}
            <div className={styles.googleBtn}>
              <button
                type="button"
                onClick={handleGoogleRegister}
                aria-label="Registrarse con Google"
                disabled={loading}
              >
                <span className={styles.googleIcon}>
                  {loading ? (
                    <div className={styles.spinner} />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="-3 0 262 262"
                      preserveAspectRatio="xMidYMid meet"
                      role="img"
                      aria-hidden="true"
                    >
                      <path
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                        fill="#4285F4"
                      />
                      <path
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                        fill="#34A853"
                      />
                      <path
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
                        fill="#FBBC05"
                      />
                      <path
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                        fill="#EB4335"
                      />
                    </svg>
                  )}
                </span>
                <span className={styles.googleText}>
                  {loading ? "Cargando..." : "Regístrate con Google"}
                </span>
              </button>
            </div>

            {/* separador */}
            <div className={styles.separator}>
              <hr className={styles.line} />
              <span className={styles.circle}>○</span>
              <hr className={styles.line} />
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              {/* campo nombre */}
              <div
                className={`${styles.halfInput} ${
                  nameError ? styles.errorInput : ""
                }`}
              >
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${styles.uIcon} ${
                    nameError ? styles.errorIcon : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M21,20a2,2,0,0,1-2,2H5a2,2,0,0,1-2-2,8,8,0,0,1,1.79-5,2,2,0,0,1,2.67-.39,8.07,8.07,0,0,0,9.07,0,2,2,0,0,1,2.68.39A8,8,0,0,1,21,20Zm-9-6A6,6,0,1,0,6,8,6,6,0,0,0,12,14Z"
                  ></path>
                </svg>

                <div className={styles.halfInput2}>
                  <label
                    htmlFor="name"
                    style={{ color: getLabelColor(passwordError) }}
                  >
                    {nameError ? "Nombre completo" : "Nombre completo"}
                  </label>

                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={nameValue}
                    onChange={(e) => {
                      setNameValue(e.target.value);
                      localStorage.setItem("register_name", e.target.value);
                    }}
                    maxLength={50}
                    placeholder={
                      nameError
                        ? "El campo no puede estar vacío"
                        : "Nombre completo"
                    }
                    className={`${styles.input} ${
                      nameError ? styles.errorInput : ""
                    }`}
                  />
                  {nameError && nameMessage && (
                    <p
                      style={{
                        color: "#E30000",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {nameMessage}
                    </p>
                  )}
                </div>
              </div>

              {/*campo email correo electronico*/}
              <div
                className={`${styles.halfInput} ${
                  emailError ? styles.errorInput : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`${styles.eicon} ${
                    emailError ? styles.errorIcon : ""
                  }`}
                >
                  <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                  <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                </svg>

                <div className={styles.halfInput2}>
                  <label
                    htmlFor="email"
                    style={{ color: getLabelColor(emailError) }}
                  >
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={emailValue}
                    onChange={(e) => {
                      setEmailValue(e.target.value);
                      localStorage.setItem("register_email", e.target.value);
                    }}
                    maxLength={70}
                    placeholder={
                      emailError ? "Correo inválido" : "Correo electrónico"
                    }
                    className={`${styles.input} ${
                      emailError ? styles.errorInput : ""
                    }`}
                  />

                  {emailError && emailMessage && (
                    <p
                      style={{
                        color: "#E30000",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {emailMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* campo password */}
              <div className={styles.passwordRow}>
                <div
                  className={`${styles.halfInputC1} ${
                    passwordError ? styles.errorInput : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`${styles.iconollave} ${
                      passwordError ? styles.errorIcon : ""
                    }`}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14.52 2c1.029 0 2.015 .409 2.742 1.136l3.602 3.602a3.877 3.877 0 0 1 0 5.483l-2.643 2.643a3.88 3.88 0 0 1 -4.941 .452l-.105 -.078l-5.882 5.883a3 3 0 0 1 -1.68 .843l-.22 .027l-.221 .009h-1.172c-1.014 0 -1.867 -.759 -1.991 -1.823l-.009 -.177v-1.172c0 -.704 .248 -1.386 .73 -1.96l.149 -.161l.414 -.414a1 1 0 0 1 .707 -.293h1v-1a1 1 0 0 1 .883 -.993l.117 -.007h1v-1a1 1 0 0 1 .206 -.608l.087 -.1l1.468 -1.469l-.076 -.103a3.9 3.9 0 0 1 -.678 -1.963l-.007 -.236c0 -1.029 .409 -2.015 1.136 -2.742l2.643 -2.643a3.88 3.88 0 0 1 2.741 -1.136m.495 5h-.02a2 2 0 1 0 0 4h.02a2 2 0 1 0 0 -4" />
                  </svg>
                  <div className={styles.passwordInput}>
                    <label
                      htmlFor="password"
                      style={{
                        color: getLabelColor(passwordError),
                      }}
                    >
                      Contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={passwordValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPasswordValue(value);
                        localStorage.setItem("register_password", value);
                      }}
                      placeholder={
                        passwordError ? "contraseña inválida" : "Contraseña"
                      }
                      className={`${styles.input2} ${
                        passwordError ? styles.errorInput : ""
                      }`}
                    />
                    {passwordError && (
                      <p
                        style={{
                          color: "#E30000",
                          fontSize: "0.75rem",
                          marginTop: "0.25rem",
                          marginBottom: "0.25rem",
                        }}
                      >
                        {passwordMessage}
                      </p>
                    )}
                  </div>
                  <svg
                    onClick={() => setShowPassword((prev) => !prev)}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ cursor: "pointer" }}
                    className={`${styles.ojito} ${
                      passwordError ? styles.errorIcon : ""
                    }`}
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fill-rule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>

                {/* campo confirmar contraseña */}
                <div
                  className={`${styles.halfInputC2} ${
                    confirmPasswordError ? styles.errorInput : ""
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className={`${styles.iconollave} ${
                      confirmPasswordError ? styles.errorIcon : ""
                    }`}
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M14.52 2c1.029 0 2.015 .409 2.742 1.136l3.602 3.602a3.877 3.877 0 0 1 0 5.483l-2.643 2.643a3.88 3.88 0 0 1 -4.941 .452l-.105 -.078l-5.882 5.883a3 3 0 0 1 -1.68 .843l-.22 .027l-.221 .009h-1.172c-1.014 0 -1.867 -.759 -1.991 -1.823l-.009 -.177v-1.172c0 -.704 .248 -1.386 .73 -1.96l.149 -.161l.414 -.414a1 1 0 0 1 .707 -.293h1v-1a1 1 0 0 1 .883 -.993l.117 -.007h1v-1a1 1 0 0 1 .206 -.608l.087 -.1l1.468 -1.469l-.076 -.103a3.9 3.9 0 0 1 -.678 -1.963l-.007 -.236c0 -1.029 .409 -2.015 1.136 -2.742l2.643 -2.643a3.88 3.88 0 0 1 2.741 -1.136m.495 5h-.02a2 2 0 1 0 0 4h.02a2 2 0 1 0 0 -4" />
                  </svg>
                  <div className={styles.passwordInput}>
                    <label
                      htmlFor="confirmPassword"
                      style={{
                        color: getLabelColor(passwordError),
                      }}
                    >
                      Confirmar Contraseña
                    </label>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={confirmPasswordValue}
                      onChange={(e) => {
                        setConfirmPasswordValue(e.target.value);
                        localStorage.setItem(
                          "register_confirmPassword",
                          e.target.value
                        );
                      }}
                      placeholder={
                        confirmPasswordError
                          ? "contraseña invalida"
                          : "Confirme su contraseña"
                      }
                      className={`${styles.input2} ${
                        confirmPasswordError ? styles.errorInput : ""
                      }`}
                    />
                    {confirmPasswordError && (
                      <p
                        style={{
                          color: "#E30000",
                          fontSize: "0.75rem",
                          marginTop: "0.25rem",
                        }}
                      >
                        {confirmPasswordMessage}
                      </p>
                    )}
                  </div>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    style={{ cursor: "pointer" }}
                    className={`${styles.ojito} ${
                      confirmPasswordError ? styles.errorIcon : ""
                    }`}
                  >
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                    <path
                      fill-rule="evenodd"
                      d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <div
                className={`${styles.halfInput} ${
                  birthError ? styles.errorInput : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`${styles.cIcon} ${
                    birthError ? styles.errorIcon : ""
                  }`}
                >
                  <path
                    fill-rule="evenodd"
                    d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
                    clip-rule="evenodd"
                  />
                </svg>

                {/* campo fecha de nacimiento */}
                <div className={styles.birthRow}>
                  <label style={{ color: getLabelColor(birthError) }}>
                    Fecha de Nacimiento
                  </label>

                  <div className={styles.birthInputs}>
                    <select
                      name="birthDay"
                      className={`${styles.select} ${
                        birthError ? styles.errorInput : ""
                      }`}
                    >
                      <option value="">DD</option>
                      {[...Array(31)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="birthMonth"
                      className={`${styles.select} ${
                        birthError ? styles.errorInput : ""
                      }`}
                    >
                      <option value="">MM</option>
                      {[...Array(12)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                    <select
                      name="birthYear"
                      className={`${styles.select} ${
                        birthError ? styles.errorInput : ""
                      }`}
                    >
                      <option value="">AAAA</option>
                      {[...Array(100)].map((_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  {birthError && birthMessage && (
                    <p
                      style={{
                        color: "#E30000",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                      }}
                    >
                      {birthMessage}
                    </p>
                  )}
                </div>
              </div>

              {/* campo teléfono */}
              <div
                className={`${styles.halfInput} ${
                  phoneError ? styles.errorInput : ""
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`${styles.tIcon} ${
                    phoneError ? styles.errorIcon : ""
                  }`}
                >
                  <path
                    fillRule="evenodd"
                    d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z"
                    clipRule="evenodd"
                  />
                </svg>

                <div className={styles.phoneWrapper}>
                  <span className={styles.prefix}>+591</span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phoneValue}
                    onChange={(e) => {
                      const newValue = e.target.value;

                      if (!/^\d*$/.test(newValue)) {
                        setPhoneError(true);
                        setPhoneMessage("Solo se permiten números");
                        return; // Bloquea el cambio
                      }

                      // Si es válido:
                      setPhoneValue(newValue);
                      localStorage.setItem("register_phone", newValue);
                      setPhoneError(false);
                      setPhoneMessage("");
                    }}
                    maxLength={8}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={
                      phoneError
                        ? "Número inválido"
                        : "Ingrese número de teléfono"
                    }
                    className={`${styles.input3} ${
                      phoneError ? styles.errorInput : ""
                    }`}
                  />
                </div>

                {phoneError && phoneMessage && (
                  <p
                    style={{
                      color: "#E30000",
                      fontSize: "0.75rem",
                      marginTop: "0.25rem",
                    }}
                  >
                    {phoneMessage}
                  </p>
                )}
              </div>

              {/* campo terminos y condiciones */}
              <div className={styles.terms}>
                <input type="checkbox" id="terms" name="terms" />
                <label htmlFor="terms" className={styles.termsLabel}>
                  <span className={styles.termsText}>
                    He leído y acepto los{" "}
                    <a href="/home/terminos" className={styles.termsLink}>
                      Términos y condiciones
                    </a>{" "}
                    de la página
                  </span>
                </label>
              </div>

              {termsError && (
                <p
                  style={{
                    color: "#E30000",
                    fontSize: "0.75rem",
                    marginTop: "0.2rem",
                  }}
                >
                  Debes aceptar los términos y condiciones para continuar
                </p>
              )}

              {error && (
                <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>
              )}

              {/* boton registrarse */}
              <button type="submit" className={styles.button}>
                Registrarse
              </button>

              {/* campo inicio de sesion */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "0.9rem",
                  marginTop: "1rem",
                  color: "#000000",
                }}
              >
                ¿Ya tienes una cuenta?{" "}
                <a
                  onClick={() => {
                    onClose();
                    setTimeout(() => {
                      onLoginClick();
                    }, 100);
                  }}
                  style={{
                    color: "#FCA311",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Iniciar Sesión
                </a>
              </p>
            </form>
            <button className={styles.close} onClick={onClose}>
              ✕
            </button>
          </div>
        </>
      )}
      {/* Modal de éxito */}
      {showSuccessModal && (
        <div className={styles.successOverlay}>
          <div className={styles.successModal}>
            <h3>✅ Registro exitoso</h3>
            <p>¡Bienvenido a Redibo!</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                onClose(); // Cierra el modal de registro
                setTimeout(() =>  window.location.href = "/", 100); 
                /* onClose(); */
              }}
              className={styles.successButton}
            >
              Continuar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
