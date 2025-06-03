export interface ContextoInicialType {
  descripcion: string;
  informacion_paciente: InformacionPacienteType;
}

export interface InformacionPacienteType {
  nombre: string;
  edad: number;
  diagnostico_previo: string;
  diagnostico_actual: string[];
  antecedentes_relevantes?: string[];
}

export interface Case {
  _id?: string;
  titulo: string;
  tipo_caso: 'APS' | 'Urgencia' | 'Hospitalario';
  contexto_inicial: ContextoInicialType;
  interacciones: InteraccionType[];
  informacion_final_caso: string;
}


export interface InteraccionType {
  id?: string;
  nombreNPC: string;
  descripcion: string;
  preguntas: RelatoType[];
}

export interface RelatoType {
  id?: string;
  pregunta: string;
  texto: string;//contexto antes de preguntar creo
  opciones: OpcionType[];
}

export interface OpcionType {
  id?: string;
  texto: string;
  reaccion: string;
  OpcionesAsociadas: OpcionesAsociadas[];
}

export interface OpcionesAsociadas {
  id?: string;
  esCorrecta: boolean;
  consecuencia?: string;
}
