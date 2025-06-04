'use client';

import { useState, useEffect } from 'react';
import { MdiPencil } from '@/app/components/Icons/Pencil';
import CalendarIcon from '@/app/components/Icons/Calendar';
import { updateUserField } from '@/libs/userService';

interface Props {
  initialValue: string;
  campoEnEdicion: string | null;
  setCampoEnEdicion: (campo: string | null) => void;
  setFechaVisual?: (valor: string) => void;
  edicionesUsadas: number; // ← AÑADE ESTO
}

export default function FechaNacimientoEditable({ initialValue, campoEnEdicion, setCampoEnEdicion, setFechaVisual, edicionesUsadas }: Props) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [valorTemporal, setValorTemporal] = useState(initialValue);
  const [feedback, setFeedback] = useState('');
  const [errorMensaje, setErrorMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [bloqueado, setBloqueado] = useState(edicionesUsadas >= 3);
  const [infoExtra, setInfoExtra] = useState('');
  const [esValido, setEsValido] = useState(false);
  
  useEffect(() => {
    if (!modalAbierto) {
      // Limpiar estado al cerrar el modal, no al abrir
      setInfoExtra('');
      setErrorMensaje('');
      setFeedback('');
      setLoading(false);
    }
  }, [modalAbierto]);

  const validarFecha = (valor: string) => {
    if (!valor) {
      setErrorMensaje('Este campo es obligatorio.');
      return false;
    }

    const fechaSeleccionada = new Date(valor);
    const hoy = new Date();

    if (fechaSeleccionada > hoy) {
      setErrorMensaje('La fecha no puede ser posterior a hoy.');
      return false;
    }

    const edad = hoy.getFullYear() - fechaSeleccionada.getFullYear();
    const mes = hoy.getMonth() - fechaSeleccionada.getMonth();
    const dia = hoy.getDate() - fechaSeleccionada.getDate();
    const edadFinal = mes < 0 || (mes === 0 && dia < 0) ? edad - 1 : edad;

    if (edadFinal < 18) {
      setErrorMensaje('Debes tener al menos 18 años.');
      return false;
    }

    if (edadFinal > 85) {
      setErrorMensaje('La edad máxima permitida es 85 años.');
      return false;
    }

    setErrorMensaje('');
    return true;
  };

  const handleGuardar = async () => {
    if (!validarFecha(valorTemporal)) return;

    try {
      setLoading(true);
      const response = await updateUserField('fechaNacimiento', valorTemporal);
      if (response.message === 'No hubo cambios en el valor.') {
        setErrorMensaje('No se realizaron cambios.');
        setLoading(false);
      
        setTimeout(() => {
          setErrorMensaje('');
          setModalAbierto(false);
          setCampoEnEdicion(null);
        }, 3000); // Espera 3 segundos antes de cerrar el modal
        return;
      }
      setFeedback('Fecha de nacimiento actualizada exitosamente.');
      setFechaVisual?.(valorTemporal);
      
      if (response.edicionesRestantes === 0) {
        setInfoExtra('Has alcanzado el límite de 3 ediciones para este campo. Para más cambios, contacta al soporte.');
        setTimeout(() => {
          setBloqueado(true); // se bloquea después del mensaje
          setModalAbierto(false);
          setCampoEnEdicion(null);
        }, 3000); // ⏱️ Espera 3 segundos antes de cerrar
        return;
      }

      if (response.infoExtra) {
        setInfoExtra(response.infoExtra);
      } else if (response.edicionesRestantes === 1) {
        setInfoExtra('Último intento: esta es tu última oportunidad para editar este campo.');
      } else if (response.edicionesRestantes > 1) {
        setInfoExtra(`Puedes editar este campo ${response.edicionesRestantes} veces más.`);
      }

      setTimeout(() => {
        setFeedback('');
        setInfoExtra('');
        setModalAbierto(false);
        setCampoEnEdicion(null);
        setLoading(false);
      }, 3000);
    } catch (err) {
      console.error('❌ Error al guardar:', err);
      setErrorMensaje('Hubo un error al guardar.');
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    setValorTemporal(initialValue);
    setErrorMensaje('');
    setModalAbierto(false);
    setCampoEnEdicion(null);
  };

  return (
    <div className="relative mb-4 font-[var(--tamaña-bold)]">
      <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Nacimiento</label>
      <div className="relative">
        <input
          type="date"
          value={initialValue}
          readOnly
          className="w-full border-2 rounded-md px-10 py-2 focus:outline-none focus:ring-1 focus:ring-[var(--azul-oscuro)] bg-gray-100 border-[var(--azul-oscuro)] shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
        />
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#11295B]">
          <CalendarIcon />
        </div>
        
        {!modalAbierto && !bloqueado && (
        <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer ${
            campoEnEdicion && campoEnEdicion !== 'fecha' ? 'opacity-50 pointer-events-none' : ''
            }`}
            onClick={() => {
                if (!campoEnEdicion) {
                    setErrorMensaje('');
                    setFeedback('');
                    setLoading(false);
                    
                    if (bloqueado) {
                      setInfoExtra('');
                    }
                
                    setModalAbierto(true);
                    setCampoEnEdicion('fecha');
                }
            }}
          >
            <MdiPencil />
          </div>
        )}
      </div>

      {modalAbierto && !bloqueado &&(
        <div className="fixed inset-0 bg-black/20 bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-[0_0px_20px_rgba(0,0,0,0.72)]">
            <h2 className="text-sm font-medium mb-1">Editar fecha de nacimiento</h2>

            <input
              type="date"
              value={valorTemporal}
              onChange={(e) => {
                const nuevaFecha = e.target.value;
                setValorTemporal(nuevaFecha);
                const valido = validarFecha(nuevaFecha);
                setEsValido(valido);
              }}
              onKeyDown={(e) => e.preventDefault()}
              className="w-full border-2 border-[var(--azul-oscuro)] rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-[var(--azul-oscuro)] shadow-[0_4px_10px_rgba(0,0,0,0.4)]"
            />

            {errorMensaje && <p className="text-[var(--rojo)] text-sm mb-1">{errorMensaje}</p>}
            {feedback && !errorMensaje && <p className="text-[var(--verde)] text-sm mb-1">{feedback}</p>}
            {infoExtra && !errorMensaje && (
                <p className="text-[var(--rojo)] text-sm font-semibold mb-1">{infoExtra}</p>
            )}

            {bloqueado && (
                <p className="text-[var(--rojo)] text-sm font-semibold mt-1">
                Has alcanzado el límite de 3 ediciones para este campo. Para más cambios, contacta al soporte.
                </p>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancelar}
                className="px-4 py-1 bg-gray-50 text-[var(--naranja)] rounded-lg hover:bg-[var(--blanco)] transition cursor-pointer shadow-[var(--sombra)]"
              >
                Cancelar
              </button>
              <button
                onClick={handleGuardar}
                disabled={!esValido || !!errorMensaje || valorTemporal.trim() === '' || loading}
                className={`px-4 py-1 rounded-lg transition cursor-pointer shadow-[var(--sombra)] ${
                  !!errorMensaje || valorTemporal.trim() === '' || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-[var(--naranja-46)] text-[var(--blanco)] hover:bg-[var(--naranja)]'
                }`}
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
