/*'use client';
import { useState } from 'react';
import { MdiPencil } from '@/app/components/Icons/Pencil';
import { updateUserField } from '@/libs/userService';
import MailIcon from '@/app/components/Icons/Email';

interface Props {
  initialValue: string;
}

export default function EmailEditable({ initialValue }: Props) {
  const [valor, setValor] = useState(initialValue);
  const [editando, setEditando] = useState(false);
  const [valorTemporal, setValorTemporal] = useState(initialValue);
  const [feedback, setFeedback] = useState('');

  const handleGuardar = async () => {
    try {
      await updateUserField('email', valorTemporal);
      setValor(valorTemporal);
      setEditando(false);
      setFeedback('Cambios guardados exitosamente.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      setFeedback('Hubo un error al guardar.');
    }
  };

  const handleCancelar = () => {
    setValorTemporal(valor);
    setEditando(false);
  };

  return (
    <div className="relative mb-4 font-[var(--tamaña-bold)]">
      <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>

      {/* Input con íconos }*/
     /* <div className="relative">
        <input
          type="email"
          value={editando ? valorTemporal : valor}
          onChange={(e) => setValorTemporal(e.target.value)}
          readOnly={!editando}
          placeholder={editando ? "Dirección de correo electrónico" : ""}
          className={`w-full border-2 rounded-md px-10 py-2 focus:outline-none focus:ring-1 shadow-[0_4px_10px_rgba(0,0,0,0.4)] ${
            editando ? 'bg-white border-[var(--azul-oscuro)] ring-[var(--azul-oscuro)]' : 'bg-gray-100 border-[var(--negro)]'
          }`}
        />

        {/* Icono izquierdo} */
       /* <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#11295B]">
          <MailIcon />
        </div>

        {/* Icono derecho o botones }*/
       /* {!editando && (
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer"
            onClick={() => setEditando(true)}
          >
            <MdiPencil />
          </div>
        )}
      </div>

      {/* Botones }*/
      /*{editando && (
        <div className="flex gap-2 mt-2 justify-end">
          <button
            onClick={handleGuardar}
            className="px-4 py-1 bg-[var(--naranja-46)] text-[var(--blanco)] rounded-lg hover:bg-[var(--naranja)] transition cursor-pointer shadow-[var(--sombra)]"
          >
            Guardar
          </button>
          <button
            onClick={handleCancelar}
            className="px-4 py-1 bg-gray-50 text-[var(--naranja)] rounded-lg hover:bg-[var(--blanco)] transition cursor-pointer shadow-[var(--sombra)]"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Feedback }*/
      /*{feedback && (
        <p className="text-center mt-2 text-green-600 font-semibold">{feedback}</p>
      )}
    </div>
  );
}
*/
