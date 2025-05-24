import React from 'react';
import Opcion from './Opcion';
import { OpcionType } from '../../../types/NPCTypes';

interface PreguntaProps {
  nombreNPC: string;
  enunciadoPregunta: string;
  texto: string;
  opciones: OpcionType[];
  onAgregarOpcion: () => void;
  onEliminarOpcion: (opcionIndex: number) => void;
  onChangeOpcion: (
    opcionIndex: number,
    campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
    valor: string | boolean
  ) => void;
  onEliminarPregunta: () => void;
  onChangeEnunciadoPregunta: (texto: string) => void;
  onChangeTextoP: (texto: string) => void;
}

const Pregunta: React.FC<PreguntaProps> = ({
  nombreNPC,
  enunciadoPregunta,
  texto,
  opciones,
  onAgregarOpcion,
  onEliminarOpcion,
  onChangeOpcion,
  onEliminarPregunta,
  onChangeEnunciadoPregunta,
  onChangeTextoP,
}) => {
  return (
    <div className="border border-gray-400 rounded p-4 mb-6 bg-gray-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 gap-2">
        <h4 className="text-lg font-semibold text-gray-800">Pregunta</h4>
        <input
          type="text"
          placeholder="Enunciado de la pregunta (del estudiante de Enfermería)"
          value={enunciadoPregunta}
          onChange={(e) => onChangeEnunciadoPregunta(e.target.value)}
          className="w-full sm:w-3/4 p-2 border rounded text-lg"
        />
        <input
          type="text"
          placeholder={`¿Qué responde ${nombreNPC} ante esta pregunta?`}
          value={texto}
          onChange={(e) => onChangeTextoP(e.target.value)}
          className="w-full sm:w-3/4 p-2 border rounded text-lg"
        />
        <button
          className="text-red-500 text-sm hover:text-red-700"
          onClick={onEliminarPregunta}
        >
          Eliminar pregunta ✕
        </button>
      </div>

      {opciones?.map((opcion, index) => (
        <Opcion
          key={opcion.id}
          opcion={opcion}
          onChangeRespuestaEstudiante={(val) => onChangeOpcion(index, 'texto', val)}
          onChangeReaccion={(val) => onChangeOpcion(index,'reaccion', val)}
          onChangeConsecuencia={(val) => onChangeOpcion(index, 'consecuencia', val)}
          onToggleCorrecta={() => onChangeOpcion(index, 'esCorrecta', !opcion.OpcionesAsociadas[0].esCorrecta)}
          onEliminar={() => onEliminarOpcion(index)}
        />
      ))}

      <button
        className="text-white px-4 py-2 rounded mt-2 bg-[#164a5f] hover:bg-[#0d5c71] mb-4 active:scale-95 w-full sm:w-auto"
        onClick={onAgregarOpcion}
      >
        Agregar opción
      </button>
    </div>
  );
};

export default Pregunta;
