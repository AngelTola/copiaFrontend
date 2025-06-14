"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/hooks/useUser';
import { NotificacionesCampana } from '@/app/home/NotificacionesCampana';
import Link from 'next/link';
import Image from "next/image";

// Importar todos los modales necesarios
import VehicleDataModal from '@/app/components/auth/authRegistroHost/VehicleDataModal';
import PaymentModal from '@/app/components/auth/authRegistroHost/PaymentModal';
import CompleteProfileModal from '@/app/components/auth/authRegistroHost/CompleteProfileModal';

export default function NavbarSimple() {
  const user = useUser();
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Estados para manejar los modales
  const [activeModal, setActiveModal] = useState<'vehicleData' | 'paymentData' | 'completeProfile' | null>(null);
  
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

  useEffect(() => {
    if (user?.fotoPerfil) {
      setProfilePhotoUrl(user.fotoPerfil);
    } else {
      setProfilePhotoUrl(null);
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  // Función para mostrar toast
  const displayToast = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Función para manejar "Quiero ser Host"
  const handleBecomeHost = () => {
    setIsMenuOpen(false); // Cerrar el menú
    setActiveModal('vehicleData');
  };

  // Función para manejar "Quiero ser Conductor"
  const handleBecomeDriver = () => {
    setIsMenuOpen(false); // Cerrar el menú
    router.push('/home/homePage/Driver');
  };

  // Manejar envío de datos del vehículo
  const handleVehicleDataSubmit = (data: {
    placa: string;
    soat: string;
    imagenes: File[];
    idAuto: number;
  }) => {
    setVehicleData(data);
    setActiveModal("paymentData");
  };

  // Manejar envío de datos de pago
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

  // Manejar completar registro
  const handleRegistrationComplete = () => {
    setActiveModal(null);
    displayToast('¡Tu registro como host fue completado exitosamente!');
  };

  return (
    <>
      <div className="px-6 md:px-20 lg:px-40 py-4 border-b border-[rgba(0,0,0,0.05)] font-[var(--fuente-principal)] bg-[var(--blanco)]">
        <nav className="flex justify-between items-center">
          <Link href="/home/homePage">
            <h1 className="text-3xl md:text-4xl text-[var(--naranja)] font-[var(--tamaño-black)] drop-shadow-[var(--sombra)]">
              REDIBO
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            {/* Campana de notificaciones */}
            <NotificacionesCampana />
            
            {/* Perfil de usuario */}
            <div className="relative z-[1000] flex justify-center gap-0 bg-[var(--naranja)] rounded-[20px] shadow-[var(--sombra)] overflow-visible">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="flex items-center md:flex-none pl-4 md:pl-4 py-2 font-[var(--tamaña-bold)] text-[var(--blanco)] text-sm md:text-base whitespace-nowrap">
                {user?.nombreCompleto || 'Nombre Usuario'}
              </button>
              <div className="flex items-center justify-center py-2 pl-2 md:px-2">
                {profilePhotoUrl ? (
                  <Image
                    src={profilePhotoUrl}
                    alt="Foto de perfil"
                    width={32}
                    height={32}
                    className="object-cover rounded-full border border-white"
                  />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 md:w-6 md:h-6 text-[var(--blanco)]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Menú desplegable */}
              {isMenuOpen && (
                <ProfileMenu 
                  onLogout={handleLogout} 
                  router={router} 
                  onBecomeHost={handleBecomeHost}
                  onBecomeDriver={handleBecomeDriver}
                  user={user}
                />
              )}
            </div>
          </div>
        </nav>
      </div>

      {/* Modales */}
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

      {/* Toast de notificación */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-[9999]">
          {toastMessage}
        </div>
      )}
    </>
  );
}

function ProfileMenu({
  onLogout,
  router,
  onBecomeHost,
  onBecomeDriver,
  user
}: {
  onLogout: () => void;
  router: ReturnType<typeof useRouter>;
  onBecomeHost: () => void;
  onBecomeDriver: () => void;
  user: ReturnType<typeof useUser>;  
}) {
  return (
    <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--blanco)] border rounded-lg shadow-lg z-[9999] font-[var(--tamaña-bold)]">
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)] rounded-t-lg"
        onClick={() => router.push('/home/homePage/configurationPerfil')}
      >
        <h2 className="hover:text-[var(--blanco)]">Cuenta</h2>
      </button>

      {user?.driverBool && (
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)]"
        onClick={() => router.push('/home/homePage/userPerfilDriver')}
      >
        <h2 className="hover:text-[var(--blanco)]">Perfil de Conductor</h2>
      </button>
      )}  
      
      {user?.host && (
        <>
          <button 
            className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)]"
            onClick={() => router.push('/home/homePage/misAutos')}
          >
            <h2 className="hover:text-[var(--blanco)]">Mis Autos</h2>
          </button>

          <button 
            className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)]"
            onClick={() => router.push('/home/homePage/calificaciones')}
          >
            <h2 className="hover:text-[var(--blanco)]">Calificaciones</h2>
          </button>
        </>
      )}
      
      {!user?.host && (
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)]"
        onClick={onBecomeHost}
      >
        <h2 className="hover:text-[var(--blanco)]">Quiero ser Host</h2>
      </button>
      )}

      {!user?.driverBool && (
      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)]"
        onClick={onBecomeDriver}
      >
        <h2 className="hover:text-[var(--blanco)]">Quiero ser Conductor</h2>
      </button>
      )}

      <button 
        className="block w-full text-left px-4 py-2 text-[var(--azul-oscuro)] hover:bg-[var(--naranja)] rounded-b-lg"
        onClick={onLogout}
      >
        <h2 className="hover:text-[var(--blanco)]">Cerrar sesión</h2>
      </button>
    </div>
  );
}