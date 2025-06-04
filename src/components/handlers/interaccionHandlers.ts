

import { Case, InteraccionType } from "../../types/NPCTypes";
import { v4 as uuidv4 } from "uuid";

// Agrega una nueva InteraccionType con ID generado
export function handleAddInteraccion(prevCase: Case): Case {
  const nuevaInter: InteraccionType = {
    id: uuidv4(),
    nombreNPC: "",
    descripcion: "",
    preguntas: [],
  };
  return { ...prevCase, interacciones: [...prevCase.interacciones, nuevaInter] };
}

// Elimina la interaccion con el ID dado (si existe)
export function handleDeleteInteraccion(prevCase: Case, interId: string): Case {
  if (!interId) {
    console.warn("ID de interaccion vacío. No se elimina ninguna interaccion.");
    return prevCase;
  }
  return {
    ...prevCase,
    interacciones: prevCase.interacciones.filter((i) => i.id !== interId),
  };
}

// Actualiza un campo (nombreNPC o descripcion) de la interaccion con interId
export function handleChangeInteraccionField(
  prevCase: Case,
  interId: string,
  campo: "nombreNPC" | "descripcion",
  valor: any
): Case {
  if (campo === "nombreNPC" || campo === "descripcion") {
    if (typeof valor !== "string") {
      console.warn(`Se esperaba string para interaccion.${campo}. Cambio ignorado.`);
      return prevCase;
    }
    return {
      ...prevCase,
      interacciones: prevCase.interacciones.map((i) =>
        i.id === interId
          ? { ...i, [campo]: valor }
          : i
      ),
    };
  }

  console.warn(`Campo de interaccion desconocido: ${campo}.`);
  return prevCase;
}
