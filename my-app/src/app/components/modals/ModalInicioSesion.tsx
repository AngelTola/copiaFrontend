import BaseModal from '@/app/components/modals/ModalBase';
import BotonConfirm from '@/app/components/botons/BotonConfirm';

export default function ModalInicioSesion({ 
  onClose 
  }: { onClose: () => void }) {
  return (
    <BaseModal onClose={onClose}>
      <svg
          viewBox="0 0 1024 1024"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          className="ml-auto block w-fit h-[30px] cursor-pointer text-[var(--azul-oscuro)]"
          onClick={onClose}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M195.2 195.2a64 64 0 0 1 90.496 0L512 421.504 738.304 195.2a64 64 0 0 1 90.496 90.496L602.496 512 828.8 738.304a64 64 0 0 1-90.496 90.496L512 602.496 285.696 828.8a64 64 0 0 1-90.496-90.496L421.504 512 195.2 285.696a64 64 0 0 1 0-90.496z"
          />
        </svg>
      <h2 className="text-xl font-bold text-center text-[var(--azul-oscuro)] mb-4">
        Bienvenido a <br />
        <span className="text-[var(--naranja)] font-[var(--tamaño-black)] text-[2.2rem] drop-shadow-[2px_2px_4px_rgba(0,0,0,0.4)]">
          REDIBO
        </span>
        <br />
        <span className="text-[var(--azul-oscuro)] font-[var(--tamaño-regular)] text-[1.8rem] uppercase underline drop-shadow-[2px_2px_4px_rgba(0,0,0,0.4)]">
          INGRESAR CÓDIGO
        </span>
      </h2>

      <input
        type="text"
        className="w-full border-2 p-3 rounded-lg mb-4 text-center"
        placeholder="Código de 6 dígitos"
        maxLength={6}
      />
      <BotonConfirm 
        texto="Iniciar sesión" 
        onClick={onClose}
      />
    </BaseModal>
  );
}