'use client';

interface Props {
  onClose: () => void;
}

export default function ModalLoginExitoso({ onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/20">
      <div className="flex flex-col w-full h-full 
      p-10 bg-[var(--blanco)] 
      sm:h-auto sm:w-[34rem] sm:rounded-[35px] sm:shadow-[0_0px_20px_rgba(0,0,0,0.72)]">

        <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="ml-auto block w-fit h-[30px] cursor-pointer text-[var(--azul-oscuro)] font-[var(--tamaño-black)]"
          onClick={onClose}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>
        <div className="flex flex-col text-center items-center mt-70
        sm:mt-0">
            <h2 className="text-[var(--azul-oscuro)] text-2xl font-bold mb-1">
            Inicio de sesión
            </h2>
            <p className="text-[var(--verde)] text-2xl font-bold mb-4">
            Exito
            </p>
        </div>
      </div>
    </div>
  );
}