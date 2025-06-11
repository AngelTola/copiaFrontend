"use client";

interface BuscadorInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  showClear?: boolean; // Mostrar botón de limpiar automáticamente
  onClear?: () => void;
  onEnter?: () => void;
}

export default function BuscadorInput({
  value,
  onChange,
  placeholder = "Buscar...",
  leftIcon,
  rightIcon,
  showClear = true,
  onClear,
  onEnter,
}: BuscadorInputProps) {

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  const handleClear = () => {
    onChange("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="w-full flex items-center border-2 border-[var(--azul-oscuro)] rounded-md px-3 py-2 shadow-sm">
      
      {/* Icono izquierdo */}
      {leftIcon && (
        <div className="mr-2">
          {leftIcon}
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        className="flex-grow text-sm focus:outline-none"
      />

      {/* Botón de limpiar (si está activo y hay texto) */}
      {showClear && value && (
        <button onClick={handleClear} className="ml-2 text-[var(--azul-oscuro)] hover:text-red-500">
          &#10005;
        </button>
      )}

      {/* Icono derecho (si lo quieres usar adicionalmente) */}
      {rightIcon && (
        <div className="ml-2">
          {rightIcon}
        </div>
      )}
    </div>
  );
}