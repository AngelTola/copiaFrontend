import React, { useState } from "react";
import { Bell } from "lucide-react";

const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* Header - Rectangle 3 */}
      <div className="absolute w-[2003px] h-[136px] top-0 left-0 border-3 border-[#FCA311]"></div>

      {/* Campana - Bell */}
      <button
        onClick={() => setOpen(!open)}
        className="absolute top-[47px] left-[1739px] w-[48px] h-[48px]"
      >
        <Bell className="w-full h-full text-orange-500" />
      </button>

      {/* Caja Group 31 */}
      {open && (
        <div className="absolute top-[125px] left-[1073px] w-[719px] h-[545px] bg-white border-[3px] border-[#FCA311] rounded-md shadow-lg z-50 p-6">
          {/* Mensaje "No hay notificaciones" alineado con Group 31 */}
          <div className="w-full h-[68px] border border-black flex items-center justify-center mb-6">
            <p className="text-gray-700 text-lg">No hay notificaciones</p>
          </div>

          {/* Contenido de la caja (Group 31) */}
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-center text-gray-500 text-lg">Contenido adicional de la caja 31</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
