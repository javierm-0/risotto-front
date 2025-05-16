export interface NPCType {
  id: string;
  nombre: string;
  Preguntas: PreguntaType[];
}

export interface PreguntaType {
  id: string;
  opciones: OpcionType[];
}

export interface OpcionType {
  id: string;
  enunciado: string;
  respuestaDelSistema: string;
  esCorrecta: boolean;
}
