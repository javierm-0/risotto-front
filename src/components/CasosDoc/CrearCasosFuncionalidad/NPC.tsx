import React, { useState } from 'react';
import Pregunta from './Pregunta';
import { NPCType } from '../../../types/NPCTypes';

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
  const [colapsado, setColapsado] = useState(false);

  return (
    <div className="p-4 border border-gray-300 rounded mb-6 bg-white shadow">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-2">
        <input
          type="text"
          placeholder="Nombre del NPC"
          className="p-2 border border-gray-300 rounded flex-1"
          value={npc.nombre}
          onChange={(e) => onChangeNombre(e.target.value)}
        />
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:scale-95 w-full sm:w-auto"
          onClick={onEliminarNPC}
        >
          Eliminar NPC
        </button>
      </div>

      {/* Botón colapsar/expandir */}
      <div className="flex justify-between items-center mt-2 mb-4">
        <h3 className="font-semibold text-gray-700">Preguntas</h3>
        <button
          className="text-sm text-[#164a5f] hover:underline"
          onClick={() => setColapsado((prev) => !prev)}
        >
          {colapsado ? 'Mostrar contenido ⬇' : 'Ocultar contenido ⬆'}
        </button>
      </div>

      {/* Contenido colapsable */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          colapsado ? 'max-h-0' : 'max-h-[1000px]'
        }`}
      >
        {npc.Preguntas?.map((pregunta, preguntaIndex) => (
          <Pregunta
            key={pregunta.id}
            opciones={pregunta.opciones}
            onAgregarOpcion={() => onAgregarOpcion(preguntaIndex)}
            onEliminarOpcion={(opcionIndex) => onEliminarOpcion(preguntaIndex, opcionIndex)}
            onChangeOpcion={(opcionIndex, campo, valor) =>
              onChangeOpcion(preguntaIndex, opcionIndex, campo, valor)
            }
            onEliminarPregunta={() => onEliminarPregunta(preguntaIndex)}
          />
        ))}

        <button
          className="text-white px-4 py-2 mt-3 rounded bg-[#164a5f] hover:bg-[#0d5c71] mb-4 active:scale-95 w-full sm:w-auto"
          onClick={onAgregarPregunta}
        >
          Agregar pregunta
        </button>
      </div>
    </div>
  );
};

export default NPC;
