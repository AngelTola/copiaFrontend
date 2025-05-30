'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { useSearchParams } from "next/navigation";

import NavbarInicioSesion from '@/app/components/navbar/NavbarInicioSesion';
import FiltersBar from '@/app/components/filters/FiltersBar';
import Footer from '@/app/components/footer/FooterLogin';
import LoginModal from '@/app/components/auth/authInicioSesion/LoginModal';
import RegisterModal from '@/app/components/auth/authregistro/RegisterModal';
import VehicleDataModal from '@/app/components/auth/authRegistroHost/VehicleDataModal';
import PaymentModal from '@/app/components/auth/authRegistroHost/PaymentModal';
import CompleteProfileModal from '@/app/components/auth/authRegistroHost/CompleteProfileModal';
import ModalLoginExitoso from '@/app/components/modals/ModalLoginExitoso';


export default function MainHome() {
  const [activeModal, setActiveModal] = useState<'login' | 'register' | 'vehicleData' | 'paymentData' | 'completeProfile' | 'succesModal' | null>(null);

  const [showLoginSuccessModal, setShowLoginSuccessModal] = useState(false);

  const [vehicleData, setVehicleData] = useState<{
    placa: string;
    soat: string;
    imagenes: File[];
    idAuto: number;
  } | null>(null);

  const [paymentData, setPaymentData] = useState<{
    tipo: "card" | "QR" | "cash";
    cardNumber?: string;
    expiration?: string;
    cvv?: string;
    cardHolder?: string;
    qrImage?: File | null;
    efectivoDetalle?: string;
  } | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const router = useRouter();
  const user = useUser();

   useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [user, router]);
  
  useEffect(() => {
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      setShowLoginSuccessModal(true);
      localStorage.removeItem('loginSuccess');
    }
  }, []);

  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleVehicleDataSubmit = (data: {
    placa: string;
    soat: string;
    imagenes: File[];
    idAuto: number;
  }) => {
    setVehicleData(data);
    setActiveModal("paymentData");
  };

  const handlePaymentDataSubmit = (data: {
  tipo: "card" | "QR" | "cash";
  cardNumber?: string;
  expiration?: string;
  cvv?: string;
  cardHolder?: string;
  qrImage?: File | null;
  efectivoDetalle?: string;
}) => {
  setPaymentData(data);
  setActiveModal('completeProfile');
};

  const handleRegistrationComplete = () => {
    setActiveModal(null);
    displayToast('¡Tu registro como host fue completado exitosamente!');
  };

  const searchParams = useSearchParams();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const registroExitoso = searchParams.get("registroExitoso");
    if (registroExitoso === "1") {
      setShowSuccessModal(true);

      // Quitar el query param sin recargar la página
      const newUrl = window.location.pathname;
      window.history.replaceState(null, "", newUrl);
    }
  }, [searchParams]);

  
  return (
    <div className="flex flex-col min-h-screen bg-[var(--background-principal)]">
      <header className="border-t border-b border-[rgba(215, 30, 30, 0.1)] shadow-[0_2px_6px_rgba(0,0,0,0.1)]">
        <NavbarInicioSesion onBecomeHost={() => setActiveModal('vehicleData')} onBecomeDriver={function (): void {
          throw new Error('Function not implemented.');
        } } />
      </header>

      <header className="/* headerFilters */">
        <FiltersBar />
      </header>

      <main className="flex-grow p-8">
        <div className="/* scrollContent */">
          <p>Contenido principal del usuario (tarjetas, información, etc.).</p>
        </div>
      </main>

      <footer>
        <Footer />
      </footer>

      {activeModal === 'login' && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onRegisterClick={() => setActiveModal('register')}
          onPasswordRecoveryClick={() => console.log('Recuperar contraseña')}
        />
      )}

      {activeModal === 'register' && (
        <RegisterModal
          onClose={() => setActiveModal(null)}
          onLoginClick={() => setActiveModal('login')}
        />
      )}

      {activeModal === 'vehicleData' && (
        <VehicleDataModal
          onNext={handleVehicleDataSubmit}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'paymentData' && vehicleData && (
        <PaymentModal
          onNext={handlePaymentDataSubmit}
          onClose={async () => {
            if (vehicleData?.idAuto) {
              const token = localStorage.getItem("token");
              await fetch(`http://localhost:3001/api/autos/eliminar-vehiculo/${vehicleData.idAuto}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              });
            }
            setActiveModal(null);
          }}
        />
      )}

      {activeModal === 'completeProfile' && vehicleData && paymentData && (
        <CompleteProfileModal
          vehicleData={vehicleData}
          paymentData={paymentData}
          onComplete={handleRegistrationComplete}
          onClose={() => setActiveModal('paymentData')}
        />
      )}

      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          {toastMessage}
        </div>
      )}

      {showSuccessModal && (
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.2)] flex items-center justify-center z-50"
          onClick={() => setShowSuccessModal(false)} // cerrar al hacer clic afuera
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-[90%] max-w-md rounded-2xl shadow-lg px-8 py-6 text-center relative"
          >
            {/* Botón de cerrar (X) */}
            <button
              onClick={() => setShowSuccessModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              &times;
            </button>

            {/* Icono de check */}
            <div className="flex justify-center items-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Mensaje de éxito */}
            <h2 className="text-xl font-bold text-green-600 mb-1">¡Registro completado!</h2>
            <p className="text-gray-700">Tu registro como driver se completó exitosamente.</p>
          </div>
        </div>
      )}



      
      {showLoginSuccessModal && (
        <ModalLoginExitoso onClose={() => setShowLoginSuccessModal(false)} />
      )}
    </div>
  );
}
