
import { Case, InformacionPacienteType } from "../../types/NPCTypes";

// Actualiza cualquier campo primitivo directo de Case: "titulo", "tipo_caso" o "informacion_final_caso"
export function handleChangeFieldCase(
  prevCase: Case,
  campo: keyof Case,
  valor: any
): Case {
  // Validar según cada campo posible
  if (campo === "titulo" || campo === "informacion_final_caso") {
    if (typeof valor !== "string") {
      console.warn(`Se esperaba un string para el campo "${campo}". Cambio ignorado.`);
      return prevCase;
    }
    return { ...prevCase, [campo]: valor };
  }

  if (campo === "tipo_caso") {
    if (valor !== "APS" && valor !== "Urgencia" && valor !== "Hospitalario") {
      console.warn(`Valor inválido para "tipo_caso": ${valor}. Cambio ignorado.`);
      return prevCase;
    }
    return { ...prevCase, tipo_caso: valor };
  }

  console.warn(`El campo "${campo}" no es un campo directo de Case que pueda modificarse aquí.`);
  return prevCase;
}

// Actualiza el subcampo "descripcion" o "informacion_paciente" dentro de contexto_inicial
export function handleChangeContextoInicial(
  prevCase: Case,
  campo: keyof Case["contexto_inicial"],
  valor: any
): Case {
  if (campo === "descripcion") {
    if (typeof valor !== "string") {
      console.warn(`Se esperaba string para "contexto_inicial.descripcion". Cambio ignorado.`);
      return prevCase;
    }
    return {
      ...prevCase,
      contexto_inicial: { ...prevCase.contexto_inicial, descripcion: valor },
    };
  }

  if (campo === "informacion_paciente") {
    // Debe ser un objeto que cumpla InformacionPacienteType
    const ip = valor as InformacionPacienteType;
    if (
      typeof ip !== "object" ||
      typeof ip.nombre !== "string" ||
      typeof ip.edad !== "number" ||
      typeof ip.diagnostico_previo !== "string" ||
      !Array.isArray(ip.diagnostico_actual)
    ) {
      console.warn(`Objeto inválido para "informacion_paciente". Cambio ignorado.`);
      return prevCase;
    }
    return {
      ...prevCase,
      contexto_inicial: {
        ...prevCase.contexto_inicial,
        informacion_paciente: ip,
      },
    };
  }

  console.warn(`El campo "${campo}" no es parte de "contexto_inicial".`);
  return prevCase;
}

/**
 * Actualiza un campo puntual dentro de "contexto_inicial.informacion_paciente".
 * Por ejemplo: "nombre", "edad" o "diagnostico_previo". No reemplaza el objeto completo.
 */
export function handleChangeInfoPaciente(
  prevCase: Case,
  campo: keyof Case["contexto_inicial"]["informacion_paciente"],
  valor: any
): Case {
  // Validación básica por tipo
  if (
    (campo === "nombre" || campo === "diagnostico_previo") &&
    typeof valor !== "string"
  ) {
    console.warn(
      `Se esperaba string para "informacion_paciente.${campo}". Cambio ignorado.`
    );
    return prevCase;
  }
  if (campo === "edad" && typeof valor !== "number") {
    console.warn(
      `Se esperaba number para "informacion_paciente.edad". Cambio ignorado.`
    );
    return prevCase;
  }

  return {
    ...prevCase,
    contexto_inicial: {
      ...prevCase.contexto_inicial,
      informacion_paciente: {
        ...prevCase.contexto_inicial.informacion_paciente,
        [campo]: valor,
      },
    },
  };
}


// ----------------------------------------
// Diagnóstico actual (array de strings)
// ----------------------------------------

// Agrega un nuevo elemento vacío a diagnostico_actual
export function handleAddDiagnosticoActual(prevCase: Case): Case {
  return {
    ...prevCase,
    contexto_inicial: {
      ...prevCase.contexto_inicial,
      informacion_paciente: {
        ...prevCase.contexto_inicial.informacion_paciente!,
        diagnostico_actual: [
          ...prevCase.contexto_inicial.informacion_paciente!.diagnostico_actual,
          "",
        ],
      },
    },
  };
}

// Elimina el diagnóstico en la posición idx
export function handleDeleteDiagnosticoActual(
  prevCase: Case,
  idx: number
): Case {
  const arr = [...prevCase.contexto_inicial.informacion_paciente!.diagnostico_actual];
  if (idx < 0 || idx >= arr.length) {
    console.warn(`Índice ${idx} fuera de rango en diagnostico_actual. Cambio ignorado.`);
    return prevCase;
  }
  arr.splice(idx, 1);
  return {
    ...prevCase,
    contexto_inicial: {
      ...prevCase.contexto_inicial,
      informacion_paciente: {
        ...prevCase.contexto_inicial.informacion_paciente!,
        diagnostico_actual: arr,
      },
    },
  };
}

// Actualiza el string en la posición idx
export function handleChangeDiagnosticoActual(
  prevCase: Case,
  idx: number,
  valor: any
): Case {
  if (typeof valor !== "string") {
    console.warn(`Se esperaba un string para diagnostico_actual[${idx}]. Cambio ignorado.`);
    return prevCase;
  }
  const arr = [...prevCase.contexto_inicial.informacion_paciente!.diagnostico_actual];
  if (idx < 0 || idx >= arr.length) {
    console.warn(`Índice ${idx} fuera de rango en diagnostico_actual. Cambio ignorado.`);
    return prevCase;
  }
  arr[idx] = valor;
  return {
    ...prevCase,
    contexto_inicial: {
      ...prevCase.contexto_inicial,
      informacion_paciente: {
        ...prevCase.contexto_inicial.informacion_paciente!,
        diagnostico_actual: arr,
      },
    },
  };
}

// ----------------------------------------
// Antecedentes relevantes (array de strings)
// ----------------------------------------

// Agrega un nuevo elemento vacío a antecedentes_relevantes
export function handleAddAntecedenteRelevante(prevCase: Case): Case {
  return {
    ...prevCase,
    contexto_inicial: {
      ...prevCase.contexto_inicial,
      informacion_paciente: {
        ...prevCase.contexto_inicial.informacion_paciente!,
        antecedentes_relevantes: [
          ...(prevCase.contexto_inicial.informacion_paciente!.antecedentes_relevantes || []),
          "",
        ],
      },
    },
  };
}

// Elimina el antecedente en la posición idx
export function handleDeleteAntecedenteRelevante(
  prevCase: Case,
  idx: number
): Case {
  const arr = [
    ...(prevCase.contexto_inicial.informacion_paciente!.antecedentes_relevantes || []),
  ];
  if (idx < 0 || idx >= arr.length) {
    console.warn(`Índice ${idx} fuera de rango en antecedentes_relevantes. Cambio ignorado.`);
    return prevCase;
  }
  arr.splice(idx, 1);
  return {
    ...prevCase,
    contexto_inicial: {
      ...prevCase.contexto_inicial,
      informacion_paciente: {
        ...prevCase.contexto_inicial.informacion_paciente!,
        antecedentes_relevantes: arr,
      },
    },
  };
}

// Actualiza el string en la posición idx
export function handleChangeAntecedenteRelevante(
  prevCase: Case,
  idx: number,
  valor: any
): Case {
  if (typeof valor !== "string") {
    console.warn(`Se esperaba un string para antecedentes_relevantes[${idx}]. Cambio ignorado.`);
    return prevCase;
  }
  const arr = [
    ...(prevCase.contexto_inicial.informacion_paciente!.antecedentes_relevantes || []),
  ];
  if (idx < 0 || idx >= arr.length) {
    console.warn(`Índice ${idx} fuera de rango en antecedentes_relevantes. Cambio ignorado.`);
    return prevCase;
  }
  arr[idx] = valor;
  return {
    ...prevCase,
    contexto_inicial: {
      ...prevCase.contexto_inicial,
      informacion_paciente: {
        ...prevCase.contexto_inicial.informacion_paciente!,
        antecedentes_relevantes: arr,
      },
    },
  };
}
