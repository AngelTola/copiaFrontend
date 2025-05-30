// components/modals/VerificacionPaso1Modal.tsx
import { useState } from 'react';
import BaseModal from '@/app/components/modals/ModalBase';
import BotonConfirm from '@/app/components/botons/BotonConfirm';
import CodigoVerificacion from '@/app/components/input/CodigoVerificacíon';
import { FaKey } from "react-icons/fa";

export default function VerificacionPaso1Modal({ onClose }: { onClose: () => void }) {
  const [codigo, setCodigo] = useState('');
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
      <h2 className="text-2xl font-[var(--tamaña-bold)] text-center 
      text-[var(--azul-oscuro)] mb-4 mt-90 
      sm:mt-0
      md:mt-0
      lg:mt-0
      2xl:mt-0
      ">
        Revisiza tu correo electronico
      </h2>
      <p className="text-left mb-6 text-[var(--azul-oscuro)]">Ingresa el código que enviamos a tu correo
Es posible que debas esperar hasta un minuto para recibir este código</p>

      <CodigoVerificacion
        name="Ingresa código"
        label="Ingresa código"
        value={codigo}
        onChange={(e) => setCodigo(e.target.value)}
        helperText=""
        icono={<FaKey className='text-[var(--azul-oscuro)] text-2xl' />}
      />

      <BotonConfirm texto="Confirmar" />
    </BaseModal>
  );
}