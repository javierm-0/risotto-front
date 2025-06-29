import React, { useState } from 'react';
import Pregunta from './Pregunta';
import { InteraccionType } from '../../../types/NPCTypes';

interface NPCProps {
  npc: InteraccionType;
  onChangeNombre: (nuevoNombre: string) => void;
  onChangeDescripcion: (nuevaDescripcion: string) => void;
  onEliminarNPC: () => void;
  onAgregarPregunta: () => void;
  onEliminarPregunta: (preguntaIndex: number) => void;
  onAgregarOpcion: (preguntaIndex: number) => void;
  onEliminarOpcion: (preguntaIndex: number, opcionIndex: number) => void;
  onChangeOpcion: (
    preguntaIndex: number,
    opcionIndex: number,
    campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
    valor: string | boolean
  ) => void;
  onChangeEnunciadoPregunta: (preguntaIndex: number, texto: string) => void;
  onChangeTextoP: (preguntaIdx: number, nuevoTexto: string) => void;
}

const NPC: React.FC<NPCProps> = ({
  npc,
  onChangeNombre,
  onChangeDescripcion,
  onEliminarNPC,
  onAgregarPregunta,
  onEliminarPregunta,
  onAgregarOpcion,
  onEliminarOpcion,
  onChangeOpcion,
  onChangeEnunciadoPregunta,
  onChangeTextoP,
  }) => {
  const [colapsado, setColapsado] = useState(false);
  

  return (
    <div className="p-4 border border-gray-300 rounded mb-6 bg-white shadow">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-2">
        <input
          type="text"
          placeholder="Nombre de esta persona"
          className="p-2 border border-gray-300 rounded flex-1"
          value={npc.nombreNPC}
          onChange={(e) => onChangeNombre(e.target.value)}
        />
        <input 
          type='text'
          placeholder='Descripcion de esta persona(opcional)'
          className='p-2 border border-gray-300 rounded flex-1'
          value={npc.descripcionNPC}
          onChange={(e) => onChangeDescripcion(e.target.value)}
        />
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:scale-95 w-full sm:w-auto"
          onClick={onEliminarNPC}
        >
          Eliminar entidad
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

      {/* Contenido colapsable(con scroll) */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          colapsado ? 'max-h-0 overflow-hidden' : 'max-h-[32rem] overflow-y-auto'
        }`}
      >
        {npc.preguntas?.map((preguntaMapeada, preguntaIndex) => (
          <Pregunta
            key={preguntaIndex}
            nombreNPC={npc.nombreNPC}
            texto={preguntaMapeada.texto}
            enunciadoPregunta={preguntaMapeada.pregunta}
            opciones={preguntaMapeada.opciones}
            onAgregarOpcion={() => onAgregarOpcion(preguntaIndex)}
            onEliminarOpcion={(opcionIndex) => onEliminarOpcion(preguntaIndex, opcionIndex)}
            onChangeOpcion={(opcionIndex, campo, valor) =>
              onChangeOpcion(preguntaIndex, opcionIndex, campo, valor)
            }
            onEliminarPregunta={() => onEliminarPregunta(preguntaIndex)}
            onChangeEnunciadoPregunta={(texto) =>
              onChangeEnunciadoPregunta(preguntaIndex, texto)
            }
            onChangeTextoP={(nuevoTexto) => onChangeTextoP(preguntaIndex,nuevoTexto)}
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
