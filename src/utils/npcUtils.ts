import { NPCType } from "../types/NPCTypes";
import { v4 as uuidv4 } from 'uuid';

export const agregarNPC = (npcs: NPCType[]) => {
  return [
    ...npcs.map(npc => ({
      ...npc,
      Preguntas: npc.Preguntas.map(p => ({
        ...p,
        opciones: [...p.opciones]
      }))
    })),
    {
      id: uuidv4(),
      nombre: '',
      Preguntas: []
    }
  ];
};

export const actualizarNombre = (npcs: NPCType[], index: number, nuevoNombre: string) => {
  return npcs.map((npc, i) => {
    if (i !== index) return npc;
    return {
      ...npc,
      nombre: nuevoNombre,
      Preguntas: npc.Preguntas.map(p => ({
        ...p,
        opciones: [...p.opciones]
      }))
    };
  });
};

export const eliminarNPC = (npcs: NPCType[], index: number) => {
  return npcs.filter((_npc, i) => i !== index);
};

export const agregarPregunta = (npcs: NPCType[], npcIndex: number): NPCType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = [
      ...(npc.Preguntas ?? []),
      {
        id: uuidv4(),
        opciones: [],
      }
    ];

    return {
      ...npc,
      Preguntas: nuevasPreguntas
    };
  });
};

export const eliminarPregunta = (npcs: NPCType[], npcIndex: number, preguntaIndex: number): NPCType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;
    return {
      ...npc,
      Preguntas: npc.Preguntas.filter((_, i) => i !== preguntaIndex)
    };
  });
};

export const agregarOpcion = (npcs: NPCType[], npcIndex: number, preguntaIndex: number): NPCType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = npc.Preguntas.map((pregunta, j) => {
      if (j !== preguntaIndex) return pregunta;

      return {
        ...pregunta,
        opciones: [
          ...pregunta.opciones,
          {
            id: uuidv4(),
            enunciado: '',
            respuestaDelSistema: '',
            esCorrecta: false
          }
        ]
      };
    });

    return {
      ...npc,
      Preguntas: nuevasPreguntas
    };
  });
};

export const eliminarOpcion = (
  npcs: NPCType[],
  npcIndex: number,
  preguntaIndex: number,
  opcionIndex: number
): NPCType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = npc.Preguntas.map((pregunta, j) => {
      if (j !== preguntaIndex) return pregunta;

      return {
        ...pregunta,
        opciones: pregunta.opciones.filter((_, i) => i !== opcionIndex)
      };
    });

    return {
      ...npc,
      Preguntas: nuevasPreguntas
    };
  });
};

export const actualizarOpcion = (
  npcs: NPCType[],
  npcIndex: number,
  preguntaIndex: number,
  opcionIndex: number,
  campo: 'enunciado' | 'respuestaDelSistema' | 'esCorrecta',
  valor: string | boolean
): NPCType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = npc.Preguntas.map((pregunta, j) => {
      if (j !== preguntaIndex) return pregunta;

      const nuevasOpciones = pregunta.opciones.map((opcion, k) => {
        if (k !== opcionIndex) return opcion;

        return {
          ...opcion,
          [campo]: valor
        };
      });

      return {
        ...pregunta,
        opciones: nuevasOpciones
      };
    });

    return {
      ...npc,
      Preguntas: nuevasPreguntas
    };
  });
};
