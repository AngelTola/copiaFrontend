import BaseModal from '@/app/components/modals/ModalBase';
import BotonConfirm from '@/app/components/botons/botonConfirm';

export default function ModalVerificacionExitosa({ onClose }: { onClose: () => void }) {
  return (
    <BaseModal onClose={onClose}>
      <h2 className="text-2xl font-[var(--tamaña-bold)] text-center text-[var(--azul-oscuro)] mb-4 mt-90
      sm:mt-0
      md:mt-0
      lg:mt-0
      2xl:mt-0">
        La autenticación de dos pasos esta { ' '}
        <span className="text-[var(--verde)]">activada</span>
      </h2>
      <p className="text-center mb-6 text-[var(--azul-oscuro)]">
        Ahora te pediremos un codigo cada vez que inicies sesión desde un dispositivo que no reconozcamos</p>
      
      <BotonConfirm texto="Listo" onClick={onClose}/>
    </BaseModal>
  );
}