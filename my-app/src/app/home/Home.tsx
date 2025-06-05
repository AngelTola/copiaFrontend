//home.tsx
"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"; // ✅
import Navbar from "../components/navbar/NavbarPrincipal";
import FiltersBar from "../components/filters/FiltersBar";
import Footer from "../components/footer/Footer";
import PasswordRecoveryModal from "../components/auth/authRecuperarContrasena/PasswordRecoveryModal";
import CodeVerificationModal from "../components/auth/authRecuperarContrasena/CodeVerificationModal";
import NewPasswordModal from "../components/auth/authRecuperarContrasena/NewPasswordModal";
import LoginModal from "../components/auth/authInicioSesion/LoginModal";
import styles from "./Home.module.css";
import RegisterModal from "../components/auth/authregistro/RegisterModal";
import CompleteProfileModal from "@/app/components/auth/authregistro/CompleteProfileModal";
import Carousel from "./carousel/carousel";
import ModalLoginExitoso from '@/app/components/modals/ModalLoginExitoso';

export default function HomePage() {

  const searchParams = useSearchParams();
const [showCompleteProfileModal, setShowCompleteProfileModal] =
    useState(false);
  const [hasRedirected, setHasRedirected] = useState(false); // 👈 Evita doble redirect

  const [activeModal, setActiveModal] = useState<"login" | "register" | null>(
    null
  );
  const [modalState, setModalState] = useState<
    "passwordRecovery" | "codeVerification" | "newPassword" | null
  >(null);
  const [showToast, setShowToast] = useState(false);
  const [showToast2, setShowToast2] = useState(false); // Para el mensaje de usuario bloqueado
  
  const handleLoginSubmit = () => {
    setModalState("passwordRecovery");
  };

  const handlePasswordRecoverySubmit = () => {
    setModalState("codeVerification");
  };

  const handleCodeVerificationSubmit = () => {
    setModalState("newPassword");
  };

  const handleClose = () => {
    setModalState(null); // Cierra cualquier modal de recuperación
    setActiveModal("login"); // Abre el login modal
  };

  const handleBackToPasswordRecovery = () => {
    setModalState("passwordRecovery"); // Regresa al PasswordRecoveryModal desde el CodeVerificationModal
  };

  useEffect(() => {
     /* const params = new URLSearchParams(window.location.search); */
    const autoLogin = searchParams.get("googleAutoLogin");
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const googleComplete = searchParams.get("googleComplete");
    const shouldOpen = localStorage.getItem("openCompleteProfileModal");

    if (autoLogin === "true" && token && email && !hasRedirected) {
      console.log("🌐 Detectado login automático en /home. Redirigiendo...");

      localStorage.setItem("token", token);
      localStorage.setItem("google_email", email);

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("googleAutoLogin");
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("email");
      window.history.replaceState({}, "", cleanUrl.toString());

      setHasRedirected(true);
      window.location.href = "/home/homePage"; // ✅ solo desde aquí
    }

    if (googleComplete === "true" && shouldOpen === "true") {
      if (token && email) {
        localStorage.setItem("token", token);
        localStorage.setItem("google_email", email);
      }
      console.log("🧩 Mostrar CompleteProfileModal desde /home");
      setShowCompleteProfileModal(true);
      localStorage.removeItem("openCompleteProfileModal");

      const cleanUrl = new URL(window.location.href);
      cleanUrl.searchParams.delete("googleComplete");
      cleanUrl.searchParams.delete("token");
      cleanUrl.searchParams.delete("email");
      window.history.replaceState({}, "", cleanUrl.toString());
    }

  }, [searchParams, hasRedirected]);

  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);

  useEffect(() => {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      setShowLoginSuccessModal(true);
      localStorage.removeItem('loginSuccess');
    }
  }, []);
  return (
    
    <div className={styles.container}>
      <header className={styles.headerTop}>
        <Navbar 
          onLoginClick={() => setActiveModal("login")}
          onRegisterClick={() => setActiveModal("register")}
        />
      </header>

      <header className={styles.headerFilters}>
        <FiltersBar />
      </header>

      <main className={styles.body}>
        <div className={styles.scrollContent}>
          <Carousel />
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      {/* Mostrar los modales según el estado */}
      {/*{modalState === 'login' && (
        <LoginModal onClose={handleClose} onLoginSubmit={handleLoginSubmit} />
      )}*/}
      {modalState === "passwordRecovery" && (
        <PasswordRecoveryModal
          onClose={handleClose}
          onPasswordRecoverySubmit={handlePasswordRecoverySubmit}
        />
      )}
      {modalState === "codeVerification" && (
        <CodeVerificationModal
        onClose={handleBackToPasswordRecovery}
        onCodeVerificationSubmit={handleCodeVerificationSubmit}
        onBlocked={() => {
          setModalState(null);
          setActiveModal("login"); // Redirige al Login al finalizar
          setShowToast2(true); // muestra el pop-up

            // Ocultar el toast automáticamente después de 3 segundos
            setTimeout(() => setShowToast2(false), 10000);
        }} // ✅ Redirige al login si el backend dice "bloqueado"
      />
      )}
      {modalState === "newPassword" && (
        <NewPasswordModal
          onClose={handleClose} // Redirige al Login al cancelar o finalizar
          code="exampleCode" // Replace "exampleCode" with the actual code value
          onNewPasswordSubmit={() => {
            setModalState(null);
            setActiveModal("login"); // Redirige al Login al finalizar
            setShowToast(true); // muestra el pop-up

            // Ocultar el toast automáticamente después de 3 segundos
            setTimeout(() => setShowToast(false), 10000);
          }} 
          
        />
      )}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          ¡Contraseña actualizada correctamente!
        </div>
      )}
      {showToast2 && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          Usuario bloqueado temporalmente. Intenta nuevamente más tarde.
        </div>
      )}
      {showLoginSuccessModal && (
              <ModalLoginExitoso onClose={() => setShowLoginSuccessModal(false)} />
            )}

      {showLoginSuccessModal && (
        <ModalLoginExitoso onClose={() => setShowLoginSuccessModal(false)} />
      )}

      {activeModal === 'login' && (
        <LoginModal onClose={() => setActiveModal(null)} onRegisterClick={() => setActiveModal('register')}
      onPasswordRecoveryClick={handleLoginSubmit} // 👈 Aquí usas la función
      />
      )}

 {activeModal === "register" && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal("login")}
        />
      )}

      {showCompleteProfileModal && (
        <CompleteProfileModal
          onComplete={(data) => {
            console.log("✅ Perfil completado:", data);
          }}
          onSuccess={() => {
            console.log(
              "✅ Perfil actualizado, redirigiendo automáticamente..."
            );
            setShowCompleteProfileModal(false);

            // Redirección automática
            setTimeout(() => {
              window.location.href = "/home/homePage";
            }, 500); // pequeño delay opcional
          }}
          onClose={() => setShowCompleteProfileModal(false)}
        />
      )}
    </div>
  );
}
