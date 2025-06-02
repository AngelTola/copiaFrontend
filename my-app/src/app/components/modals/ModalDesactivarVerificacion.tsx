//ModalDesactivarVerificacion.tsx
import BaseModal from '@/app/components/modals/ModalBase';
import BotonConfirm from '@/app/components/botons/botonConfirm';

export default function ModalDesactivarVerificacion({
  onClose,
  onDesactivar,
}: {
  onClose: () => void;
  onDesactivar: () => void;
}) {
  return (
    <BaseModal onClose={onClose}>
      <h2 className="text-2xl font-[var(--tamaña-bold)] text-center text-[var(--azul-oscuro)] mb-6">
        Verificación en dos pasos
      </h2>

      <div className="flex flex-col gap-4 w-full">
        <BotonConfirm
          texto="Desactivar verificación"
          onClick={onDesactivar}
        />

        <BotonConfirm
          texto="Cancelar"
          onClick={onClose}
        />
      </div>
    </BaseModal>
  );
}