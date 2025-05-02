export interface Case {
  _id: { $oid: string }; // ← corregido
  titulo: string;
  tipo_caso: 'APS' | 'Urgencia' | 'Hospitario';
  contexto_inicial: ContextoInicial;
  entrega_urgencias: EntregaUrgencias; // ← ya no opcional
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

export interface EntregaUrgencias {
  enfermera: EnfermeraUrgencias;
}

export interface EnfermeraUrgencias {
  informacion_inicial: string;
  informacion_condicional: InformacionCondicional[];
}

export interface Interaccion {
  rol: string;
  acciones_iniciales?: Accion[];
  informacion_condicional?: InformacionCondicional[];
  interacciones_posibles?: InteraccionPosible[];
  acciones_si_solicita?: string[];
  indicaciones_hospitalizacion?: Record<string, any>;
}

export interface Accion {
  solicitud?: string;
  informacion_entregada?: Record<string, any>;
}

export interface InformacionCondicional {
  pregunta_trigger?: string;
  momento_trigger?: string;
  respuesta: string;
}

export interface InteraccionPosible {
  pregunta: string;
  respuesta: string;
  posibles_respuestas?: string[];
}
