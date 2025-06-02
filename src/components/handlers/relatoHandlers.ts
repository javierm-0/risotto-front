// src/components/handlers/relatoHandlers.ts

import { Case, RelatoType, OpcionType, OpcionesAsociadas } from "../../types/NPCTypes";
import { v4 as uuidv4 } from "uuid";

// Agrega un nuevo RelatoType (con ID) a la interaccion interId
export function handleAddRelato(prevCase: Case, interId: string): Case {
  if (!interId) {
    console.warn("ID de interaccion vacío. No se agrega Relato.");
    return prevCase;
  }

  const nuevaRelato: RelatoType = {
    id: uuidv4(),
    pregunta: "",
    texto: "",
    opciones: [],
  };

  return {
    ...prevCase,
    interacciones: prevCase.interacciones.map((i) =>
      i.id === interId ? { ...i, preguntas: [...i.preguntas, nuevaRelato] } : i
    ),
  };
}

// Elimina el Relato con relId dentro de la interaccion interId
export function handleDeleteRelato(
  prevCase: Case,
  interId: string,
  relId: string
): Case {
  if (!interId || !relId) {
    console.warn("ID_Inter o ID_Relato vacío. No se elimina Relato.");
    return prevCase;
  }
  return {
    ...prevCase,
    interacciones: prevCase.interacciones.map((i) =>
      i.id === interId
        ? { ...i, preguntas: i.preguntas.filter((r) => r.id !== relId) }
        : i
    ),
  };
}

// Actualiza un campo ("pregunta" o "texto") dentro de un Relato específico
export function handleChangeRelatoField(
  prevCase: Case,
  interId: string,
  relId: string,
  campo: "pregunta" | "texto",
  valor: any
): Case {
  if (campo === "pregunta" || campo === "texto") {
    if (typeof valor !== "string") {
      console.warn(`Se esperaba string para Relato.${campo}. Cambio ignorado.`);
      return prevCase;
    }
    return {
      ...prevCase,
      interacciones: prevCase.interacciones.map((i) => {
        if (i.id === interId) {
          return {
            ...i,
            preguntas: i.preguntas.map((r) =>
              r.id === relId ? { ...r, [campo]: valor } : r
            ),
          };
        }
        return i;
      }),
    };
  }

  console.warn(`Campo desconocido en Relato: ${campo}`);
  return prevCase;
}

// Agrega una nueva OpcionType (con ID y asociada) dentro de un Relato
export function handleAddOpcion(
  prevCase: Case,
  interId: string,
  relId: string
): Case {
  if (!interId || !relId) {
    console.warn("ID_Inter o ID_Relato vacío. No se agrega Opción.");
    return prevCase;
  }

  const nuevaOpcion: OpcionType = {
    id: uuidv4(),
    texto: "",
    reaccion: "",
    OpcionesAsociadas: [{ id: uuidv4(), esCorrecta: false, consecuencia: "" }],
  };

  return {
    ...prevCase,
    interacciones: prevCase.interacciones.map((i) => {
      if (i.id === interId) {
        return {
          ...i,
          preguntas: i.preguntas.map((r) =>
            r.id === relId ? { ...r, opciones: [...r.opciones, nuevaOpcion] } : r
          ),
        };
      }
      return i;
    }),
  };
}

// Elimina la Opcion con opcId dentro de un Relato
export function handleDeleteOpcion(
  prevCase: Case,
  interId: string,
  relId: string,
  opcId: string
): Case {
  if (!interId || !relId || !opcId) {
    console.warn("Algún ID vacío. No se elimina Opción.");
    return prevCase;
  }
  return {
    ...prevCase,
    interacciones: prevCase.interacciones.map((i) => {
      if (i.id === interId) {
        return {
          ...i,
          preguntas: i.preguntas.map((r) =>
            r.id === relId
              ? { ...r, opciones: r.opciones.filter((o) => o.id !== opcId) }
              : r
          ),
        };
      }
      return i;
    }),
  };
}

// Actualiza un campo dentro de OpcionType (texto, reaccion, esCorrecta o consecuencia)
export function handleChangeOpcionField(
  prevCase: Case,
  interId: string,
  relId: string,
  opcId: string,
  campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
  valor: any
): Case {
  // Validaciones básicas
  if (campo === "texto" || campo === "reaccion") {
    if (typeof valor !== "string") {
      console.warn(`Se esperaba string para Opcion.${campo}. Cambio ignorado.`);
      return prevCase;
    }
  }
  if (campo === "esCorrecta") {
    if (typeof valor !== "boolean") {
      console.warn(`Se esperaba boolean para Opcion.esCorrecta. Cambio ignorado.`);
      return prevCase;
    }
  }
  if (campo === "consecuencia") {
    if (typeof valor !== "string") {
      console.warn(`Se esperaba string para Opcion.consecuencia. Cambio ignorado.`);
      return prevCase;
    }
  }

  return {
    ...prevCase,
    interacciones: prevCase.interacciones.map((i) => {
      if (i.id === interId) {
        return {
          ...i,
          preguntas: i.preguntas.map((r) => {
            if (r.id === relId) {
              return {
                ...r,
                opciones: r.opciones.map((o) => {
                  if (o.id === opcId) {
                    if (campo === "esCorrecta") {
                      // Actualizar la propiedad esCorrecta del primer elemento de OpcionesAsociadas
                      const nuevaAsoc: OpcionesAsociadas[] = [...o.OpcionesAsociadas];
                      if (nuevaAsoc.length > 0) {
                        nuevaAsoc[0].esCorrecta = valor;
                      }
                      return { ...o, OpcionesAsociadas: nuevaAsoc };
                    }
                    if (campo === "consecuencia") {
                      const nuevaAsoc: OpcionesAsociadas[] = [...o.OpcionesAsociadas];
                      if (nuevaAsoc.length > 0) {
                        nuevaAsoc[0].consecuencia = valor;
                      }
                      return { ...o, OpcionesAsociadas: nuevaAsoc };
                    }
                    // Para "texto" o "reaccion", actualizamos directo en el OpcionType
                    return { ...o, [campo]: valor };
                  }
                  return o;
                }),
              };
            }
            return r;
          }),
        };
      }
      return i;
    }),
  };
}
