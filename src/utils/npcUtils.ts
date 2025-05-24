import { InteraccionType } from "../types/NPCTypes";
import { v4 as uuidv4 } from 'uuid';

export const agregarNPC = (npcs: InteraccionType[]) : InteraccionType[] => {
  return [
    ...npcs.map(npc => ({
      ...npc,
      preguntas: npc.preguntas.map(p => ({
        ...p,
        opciones: [...p.opciones]
      }))
    })),
    {
      id: uuidv4(),
      nombreNPC: '',
      descripcionNPC: '',
      preguntas: []
    }
  ];
};

export const actualizarNombre = (npcs: InteraccionType[], index: number, nuevoNombre: string) : InteraccionType[] => {
  return npcs.map((npc, i) => {
    if (i !== index) return npc;
    return {
      ...npc,
      nombreNPC: nuevoNombre,
      preguntas: npc.preguntas.map(p => ({
        ...p,
        opciones: [...p.opciones]
      }))
    };
  });
};

export const actualizarDescripcionNPC = (npcs: InteraccionType[], index: number, nuevaDescripcion: string): InteraccionType[] => {
  return npcs.map((npcMapeado, i) =>{
    if(i !== index) return npcMapeado;
    return {
      ...npcMapeado,
      descripcionNPC: nuevaDescripcion,
      preguntas: npcMapeado.preguntas.map(p => ({
        ...p,
        opciones: [...p.opciones]
      }))
    }
  })
}

export const eliminarNPC = (npcs: InteraccionType[], index: number): InteraccionType[] => {
  return npcs.filter((_npc, i) => i !== index);
};

export const agregarPregunta = (npcs: InteraccionType[], npcIndex: number): InteraccionType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = [
      ...(npc.preguntas ?? []),
      {
        id: uuidv4(),
        pregunta: '',
        texto: '',
        opciones: [],
      }
    ];

    return {
      ...npc,
      preguntas: nuevasPreguntas
    };
  });
};

export const eliminarPregunta = (npcs: InteraccionType[], npcIndex: number, preguntaIndex: number): InteraccionType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;
    return {
      ...npc,
      preguntas: npc.preguntas.filter((_, i) => i !== preguntaIndex)
    };
  });
};

export const agregarOpcion = (npcs: InteraccionType[], npcIndex: number, preguntaIndex: number): InteraccionType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = npc.preguntas.map((pregunta, j) => {
      if (j !== preguntaIndex) return pregunta;

      return {
        ...pregunta,
        opciones: [
          ...pregunta.opciones,
          {
            id: uuidv4(),
            texto: '',
            reaccion: '',
            OpcionesAsociadas: [
              {
                id: uuidv4(),
                esCorrecta: false,
                consecuencia: ''
              }
            ]
          }
        ]
      };
    });

    return {
      ...npc,
      preguntas: nuevasPreguntas
    };
  });
};

export const eliminarOpcion = (
  npcs: InteraccionType[],
  npcIndex: number,
  preguntaIndex: number,
  opcionIndex: number
): InteraccionType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = npc.preguntas.map((pregunta, j) => {
      if (j !== preguntaIndex) return pregunta;

      return {
        ...pregunta,
        opciones: pregunta.opciones.filter((_, i) => i !== opcionIndex)
      };
    });

    return {
      ...npc,
      preguntas: nuevasPreguntas
    };
  });
};

export const actualizarOpcion = (
  npcs: InteraccionType[],
  npcIndex: number,
  preguntaIndex: number,
  opcionIndex: number,
  campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
  valor: string | boolean
): InteraccionType[] => {
  return npcs.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = npc.preguntas.map((pregunta, j) => {
      if (j !== preguntaIndex) return pregunta;

      const nuevasOpciones = pregunta.opciones.map((opcion, k) => {
        if (k !== opcionIndex) return opcion;

        if (campo === 'esCorrecta'){
          return {
            ...opcion,
            OpcionesAsociadas: opcion.OpcionesAsociadas.map((op, idx) =>
              idx === 0 ? { ...op, esCorrecta: valor as boolean } : op
            ),
          };
        }

        if (campo === 'consecuencia') {
          return {
            ...opcion,
            OpcionesAsociadas: opcion.OpcionesAsociadas.map((op, idx) =>
              idx === 0 ? { ...op, consecuencia: valor as string } : op
            ),
          };
        }

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
      preguntas: nuevasPreguntas
    };
  });
};

export const actualizarTextoPregunta = (
  interacciones: InteraccionType[],
  npcIndex: number,
  preguntaIndex: number,
  nuevoTexto: string
): InteraccionType[] => {
  return interacciones.map((npc, i) => {
    if (i !== npcIndex) return npc;

    const nuevasPreguntas = npc.preguntas.map((pregunta, j) => {
      if (j !== preguntaIndex) return pregunta;

      return {
        ...pregunta,
        texto: nuevoTexto
      };
    });

    return {
      ...npc,
      preguntas: nuevasPreguntas
    };
  });
};
