"use client";

import { useState } from "react";

interface SelectorHoraAlquilerProps {
  pickupTime: string;
  dropoffTime: string;
  setPickupTime: (hora: string) => void;
  setDropoffTime: (hora: string) => void;
}

export default function SelectorHoraAlquiler({
  pickupTime,
  dropoffTime,
  setPickupTime,
  setDropoffTime,
}: SelectorHoraAlquilerProps) {
  const [activeDropdown, setActiveDropdown] = useState<"pickup" | "dropoff" | null>(null);

  return (
    <div className="border-2 border-gray-300 rounded-xl p-4 mt-4 relative z-10">
      <h3 className="text-lg font-semibold text-[#002a5c] mb-3">Hora de Alquiler</h3>
      <div className="flex flex-col gap-4">
        <DropdownHora
          label="Hora de recogida:"
          value={pickupTime}
          onChange={(hora) => {
            setPickupTime(hora);
            setActiveDropdown(null); // Cierra el dropdown al seleccionar
          }}
          isOpen={activeDropdown === "pickup"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "pickup" ? null : "pickup")
          }
          disabled={activeDropdown === "dropoff"} // Bloquea si el otro está activo
        />
        <DropdownHora
          label="Hora de devolución:"
          value={dropoffTime}
          onChange={(hora) => {
            setDropoffTime(hora);
            setActiveDropdown(null); // Cierra el dropdown al seleccionar
          }}
          isOpen={activeDropdown === "dropoff"}
          onToggle={() =>
            setActiveDropdown(activeDropdown === "dropoff" ? null : "dropoff")
          }
          disabled={activeDropdown === "pickup"} // Bloquea si el otro está activo
          disabledBefore={pickupTime}
        />
      </div>
    </div>
  );
}

function DropdownHora({
  label,
  value,
  onChange,
  isOpen,
  onToggle,
  disabled,
  disabledBefore,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  disabled: boolean;
  disabledBefore?: string;
}) {
  const opcionesHora: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hora = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
      if (!disabledBefore || hora > disabledBefore) {
        opcionesHora.push(hora);
      }
    }
  }

  return (
    <div className={`relative ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <label className="block mb-1 text-sm text-[#002a5c] font-medium">{label}</label>
      <div
        className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold bg-white cursor-pointer flex justify-between items-center ${
          isOpen ? "ring-2 ring-[#fca311]" : ""
        }`}
        onClick={() => {
          if (!disabled) onToggle();
        }}
      >
        {value || "Seleccionar"}
        <span className="text-gray-500 text-xs">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="absolute left-0 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto z-50">
          {opcionesHora.map((hora) => (
            <div
              key={hora}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => onChange(hora)}
            >
              {hora}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}