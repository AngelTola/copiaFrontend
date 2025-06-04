import React from "react";

interface ButtonProps {
  id: string;
  color: string;
  type: "button" | "submit" | "reset";
  Guardar: string;
  deshabilitado: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  type,
  id,
  Guardar,
  color,
  deshabilitado,
  onClick
}) => {
  return (
    <button
      type={type}
      id={id}
      disabled={deshabilitado}
      onClick={onClick}
      className={color}
    >
      {Guardar}
    </button>
  );
};

export default Button;
