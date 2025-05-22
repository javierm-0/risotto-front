export interface NPCType {
  id: string;
  nombre: string;
  Preguntas: PreguntaType[];
}

export interface PreguntaType {
  id: string;
  enunciadoPregunta: string;
  opciones: OpcionType[];
}

export interface OpcionType {
  consecuencia: string;//opcional en el backend
  id: string;
  enunciado: string;
  respuestaDelSistema: string;
  esCorrecta: boolean;
}
