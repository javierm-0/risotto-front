export interface Case {
  _id?: string;
  titulo: string;
  tipo_caso: 'APS' | 'Urgencia' | 'Hospitario';
  contexto_inicial: ContextoInicial;
  interacciones: Interaccion[];
  informacion_final_caso: string;
}

export interface ContextoInicial {
  descripcion: string;
  informacion_paciente: InformacionPaciente;
}

export interface InformacionPaciente {
  nombre: string;
  edad: number;
  diagnostico_previo: string;
  diagnostico_actual: string[];
  antecedentes_relevantes?: string[];
}

export interface Interaccion {
  nombreNPC: string;
  descripcion?: string;
  preguntas: Relato[];
}

export interface Relato {
  pregunta: string;  // Texto de la pregunta que el estudiante hace
  texto: string;     // Relato o respuesta que da el interlocutor
  opciones: Opcion[];
}

export interface Opcion {
  texto: string; // texto de la opción para elegir
  reaccion?: string; // opcional, reacción adicional del interlocutor (puedes ignorar si no usas)
  OpcionesAsociadas: OpcionesAsociadas[]; // alternativas con sus consecuencias
}

export interface OpcionesAsociadas {
  esCorrecta: boolean;
  consecuencia?: string;
}
