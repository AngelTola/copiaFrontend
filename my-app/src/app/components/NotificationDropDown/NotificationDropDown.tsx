import React from "react";

const NotificationDropdown: React.FC = () => {
  // Simulamos que no hay notificaciones
  const notifications: string[] = [];

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-lg z-50 p-4">
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-sm text-center">No hay notificaciones</p>
      ) : (
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="text-sm py-1 border-b last:border-none">
              {notification}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationDropdown;

