import React from 'react';
import Pregunta from './Pregunta';
import { NPCType} from '../../../types/NPCTypes'; // Asegurate de importar correctamente tus tipos

interface NPCProps {
  npc: NPCType;
  onChangeNombre: (nuevoNombre: string) => void;
  onEliminarNPC: () => void;
  onAgregarPregunta: () => void;
  onEliminarPregunta: (preguntaIndex: number) => void;
  onAgregarOpcion: (preguntaIndex: number) => void;
  onEliminarOpcion: (preguntaIndex: number, opcionIndex: number) => void;
  onChangeOpcion: (
    preguntaIndex: number,
    opcionIndex: number,
    campo: 'enunciado' | 'respuestaDelSistema' | 'esCorrecta',
    valor: string | boolean
  ) => void;
}

const NPC: React.FC<NPCProps> = ({
  npc,
  onChangeNombre,
  onEliminarNPC,
  onAgregarPregunta,
  onEliminarPregunta,
  onAgregarOpcion,
  onEliminarOpcion,
  onChangeOpcion,
}) => {
  return (
    <div className="p-4 border border-gray-300 rounded mb-6 bg-white shadow">
      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          placeholder="Nombre del NPC"
          className="p-2 border border-gray-300 rounded w-full"
          value={npc.nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
        />
        <button
          className="bg-red-500 text-white px-3 py-1 rounded active:scale-95 hover:bg-red-600"
          onClick={onEliminarNPC}
        >
          Eliminar NPC
        </button>
      </div>

      <h3 className="font-semibold text-gray-700 mb-2">Preguntas</h3>

      {npc.Preguntas?.map((pregunta, preguntaIndex) => (
        <Pregunta
          key={pregunta.id}
          opciones={pregunta.opciones}
          onAgregarOpcion={() => onAgregarOpcion(preguntaIndex)}
          onEliminarOpcion={(opcionIndex) =>
            onEliminarOpcion(preguntaIndex, opcionIndex)
          }
          onChangeOpcion={(opcionIndex, campo, valor) =>
            onChangeOpcion(preguntaIndex, opcionIndex, campo, valor)
          }
          onEliminarPregunta={() => onEliminarPregunta(preguntaIndex)}
        />
      ))}

      <button
        className="text-white px-4 py-2 mt-3 rounded bg-[#164a5f] hover:bg-[#0d5c71] mb-4 active:scale-95"
        onClick={onAgregarPregunta}
      >
        Agregar pregunta
      </button>
    </div>
  );
};

export default NPC;
