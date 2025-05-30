// components/modals/VerificacionPaso1Modal.tsx
import BaseModal from '@/app/components/modals/ModalBase';
import BotonConfirm from '@/app/components/botons/BotonConfirm';

export default function VerificacionPaso1Modal({
  onClose,
  onVerificacionExitosa,
}: {
  onClose: () => void;
  onVerificacionExitosa: () => void;
}) {
  const handleConfirmar = () => {
    // Aquí luego pondrás la validación real del código
    onVerificacionExitosa();
  };
  return (
    <BaseModal onClose={onClose}>
      <h2 className="text-xl font-bold text-center text-[var(--azul-oscuro)] mb-4">
        Verificación en Dos Pasos
      </h2>
      <p className="text-center mb-6">Introduce el código enviado a tu correo</p>
      <input
        type="text"
        className="w-full border-2 p-3 rounded-lg mb-4 text-center"
        placeholder="Código de 6 dígitos"
        maxLength={6}
      />
      <BotonConfirm texto="Continuar" onClick={handleConfirmar}/>
    </BaseModal>
  );
}