import { useState, useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface MensajeRedireccionProps {
  onCerrar: () => void;
  onAceptar: () => void;
}

export default function MensajeRedireccion({ onCerrar, onAceptar }: MensajeRedireccionProps) {
  const [cerrando, setCerrar] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Agregar listener para cerrar al hacer clic fuera
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        manejarCierre();
      }
    };

    // Agregar listener para tecla Escape
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        manejarCierre();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const manejarCierre = () => {
    setCerrar(true);
    setTimeout(() => {
      onCerrar();
    }, 300); // Tiempo de la transición
  };

  return (
    <div
      className={`fixed inset-0 z-[3000] flex items-center justify-center transition-opacity ${
        cerrando ? "opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div
        ref={modalRef}
        className={`bg-ivory rounded-lg shadow-xl p-6 max-w-md w-full mx-4 relative transform transition-all duration-300 ${
          cerrando ? "scale-95 opacity-0" : "scale-100 opacity-100"
        }`}
        style={{ 
          backgroundColor: "white",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
        }}
      >
        {/* Botón de cerrar (x) */}
        <button
          onClick={manejarCierre}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <IoClose className="h-6 w-6" />
        </button>

        {/* Contenido del mensaje */}
        <div className="text-center">
          <h3 className="text-xl font-bold text-[#1E3A8A] mb-3">
            ¡Vehículo no disponible!
          </h3>
          <p className="text-gray-700 mb-5">
            Parece que este vehículo ya no está disponible. ¿Te ayudamos a encontrar otro que se adapte a tus necesidades?
          </p>
          
          <div className="flex justify-center gap-3">
            <button
              onClick={onAceptar}
              className="bg-[#F97316] hover:bg-[#EA580C] text-white font-medium py-2 px-6 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              Sí, por favor
            </button>
            <button
              onClick={manejarCierre}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-md transition-colors"
            >
              No, gracias
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}