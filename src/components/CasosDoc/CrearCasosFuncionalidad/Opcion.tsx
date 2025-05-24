import React from 'react';
import { OpcionType } from '../../../types/NPCTypes';

interface OpcionProps {
  opcion: OpcionType;
  onChangeRespuestaEstudiante: (texto: string) => void;
  onChangeReaccion: (reaccion: string) => void;
  onChangeConsecuencia: (consecuencia: string) => void;
  onToggleCorrecta: () => void;
  onEliminar: () => void;
}

const Opcion: React.FC<OpcionProps> = ({
  opcion,
  onChangeRespuestaEstudiante,
  onChangeReaccion,
  onChangeConsecuencia,
  onToggleCorrecta,
  onEliminar,
}) => {
  return (
    <div className="flex flex-col gap-3 border p-4 rounded mb-4 bg-white shadow-sm">
      <input
        type="text"
        placeholder="Enunciado de la respuesta (del estudiante de Enfermería)"
        value={opcion.texto}
        onChange={(e) => onChangeRespuestaEstudiante(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />

      <textarea
        placeholder="Reacción (de la persona con la que el estudiante está hablando)"
        value={opcion.reaccion}
        onChange={(e) => onChangeReaccion(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        rows={3}
      />

      <input
        type="text"
        placeholder="Ingrese las consecuencias de elegir esta opción (opcional)"
        value={opcion.OpcionesAsociadas[0].consecuencia}
        onChange={(e) => onChangeConsecuencia(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={opcion.OpcionesAsociadas[0].esCorrecta}
            onChange={onToggleCorrecta}
          />
          ¿Es correcta?
        </label>
        <button
          className="text-red-500 hover:text-red-700 text-sm w-full sm:w-auto text-left sm:text-right"
          onClick={onEliminar}
        >
          Eliminar opción ✕
        </button>
      </div>
    </div>
  );
};

export default Opcion;
