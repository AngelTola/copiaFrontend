import BaseModal from '@/app/components/modals/ModalBase';
import BotonConfirm from '@/app/components/botons/BotonConfirm';

export default function ModalDesactivarVerificacion({ onClose }: { onClose: () => void }) {
  return (
    <BaseModal onClose={onClose}>
      <h2 className="text-2xl font-[var(--tamaña-bold)] text-center text-[var(--azul-oscuro)] mb-4 mt-90
      sm:mt-0
      md:mt-0
      lg:mt-0
      2xl:mt-0">
        La autenticación de dos pasos esta { ' '}
        <span className="text-[var(--rojo)]">desactivada</span>
      </h2>
      
      <BotonConfirm texto="Listo" onClick={onClose}/>
    </BaseModal>
  );
}