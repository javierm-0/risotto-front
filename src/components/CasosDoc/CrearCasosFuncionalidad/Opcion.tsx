import React from 'react';
import { OpcionType } from '../../../types/NPCTypes';

interface OpcionProps {
  opcion: OpcionType;
  onChangeEnunciado: (texto: string) => void;
  onChangeRespuestaDelSistema: (texto: string) => void;
  onToggleCorrecta: () => void;
  onEliminar: () => void;
}

const Opcion: React.FC<OpcionProps> = ({
  opcion,
  onChangeEnunciado,
  onChangeRespuestaDelSistema,
  onToggleCorrecta,
  onEliminar,
}) => {
  return (
    <div className="flex flex-col gap-2 border p-4 rounded mb-2 bg-white shadow-sm">
      <input
        type="text"
        placeholder="Enunciado de la opción"
        value={opcion.enunciado}
        onChange={(e) => onChangeEnunciado(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <textarea
        placeholder="Respuesta del sistema"
        value={opcion.respuestaDelSistema}
        onChange={(e) => onChangeRespuestaDelSistema(e.target.value)}
        className="p-2 border border-gray-300 rounded"
        rows={3}
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={opcion.esCorrecta}
            onChange={onToggleCorrecta}
          />
          ¿Es correcta?
        </label>
        <button
          className="text-red-500 hover:text-red-700 text-sm"
          onClick={onEliminar}
        >
          Eliminar opción ✕
        </button>
      </div>
    </div>
  );
};

export default Opcion;