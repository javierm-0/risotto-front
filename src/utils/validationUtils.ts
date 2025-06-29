import { Case, InteraccionType, RelatoType, OpcionType, OpcionesAsociadas } from "../types/NPCTypes";

const VALID_TIPOS: Array<Case["tipo_caso"]> = ["APS", "Urgencia", "Hospitalario"];

/**
 * Verifica que el objeto Case cumpla con todos los campos obligatorios
 * y que, en caso de existir arreglos anidados (interacciones, relatos, opciones, etc.),
 * cada elemento tenga sus propiedades requeridas.
 *
 * @param caseData El objeto Case a validar
 * @returns true si está completo y valido, false en caso contrario
 */
export function validateCaseData(caseData: Case): boolean {
  if (typeof caseData.titulo !== "string" || caseData.titulo.trim() === "") {
    return false;
  }
  if (!VALID_TIPOS.includes(caseData.tipo_caso)) {
    return false;
  }
  if (typeof caseData.informacion_final_caso !== "string" || caseData.informacion_final_caso.trim() === "") {
    return false;
  }

  const ctx = caseData.contexto_inicial;
  if (!ctx || typeof ctx.descripcion !== "string" || ctx.descripcion.trim() === "") {
    return false;
  }

  const ip = ctx.informacion_paciente;
  if (!ip || typeof ip.nombre !== "string" || ip.nombre.trim() === "") {
    return false;
  }
  if (typeof ip.edad !== "number" || isNaN(ip.edad)) {
    return false;
  }
  if (typeof ip.diagnostico_previo !== "string" || ip.diagnostico_previo.trim() === "") {
    return false;
  }
  //diagnostico actual -> opcional, basta con que siga siendo un arreglo
  if (!Array.isArray(ip.diagnostico_actual)) {
    return false;
  }
  for (const d of ip.diagnostico_actual) {
    if (typeof d !== "string") {
      return false;
    }
  }
  if (ip.antecedentes_relevantes != null) {
    if (!Array.isArray(ip.antecedentes_relevantes)) {
      return false;
    }
    for (const a of ip.antecedentes_relevantes) {
      if (typeof a !== "string") {
        return false;
      }
    }
  }
  if (!Array.isArray(caseData.interacciones) || caseData.interacciones.length === 0) {
    return false;
  }
  for (const inter of caseData.interacciones) {
    if (!validateInteraccion(inter)) {
      return false;
    }
  }

  return true;
}

function validateInteraccion(inter: InteraccionType): boolean {
  if (typeof inter.nombreNPC !== "string" || inter.nombreNPC.trim() === "") {
    return false;
  }
  if (inter.descripcion != null && typeof inter.descripcion !== "string" || inter.descripcion.trim() === "") {
    return false;
  }
  if (!Array.isArray(inter.preguntas) || inter.preguntas.length === 0) {
    return false;
  }
  for (const rel of inter.preguntas) {
    if (!validateRelato(rel)) {
      return false;
    }
  }
  return true;
}

function validateRelato(rel: RelatoType): boolean {
  if (typeof rel.pregunta !== "string" || rel.pregunta.trim() === "") {
    return false;
  }
  if (typeof rel.texto !== "string" || rel.texto.trim() === "") {
    return false;
  }
  //si opciones no es arreglo o tiene len 0 -> false
  if (!Array.isArray(rel.opciones) || rel.opciones.length === 0) {
    return false;
  }
  for (const opc of rel.opciones) {
    if (!validateOpcion(opc)) {
      return false;
    }
  }
  return true;
}

function validateOpcion(opc: OpcionType): boolean {
  // texto obligatorio
  if (typeof opc.texto !== "string" || opc.texto.trim() === "") {
    return false;
  }
  //reaccion es opcional, pero si existe debe ser string
  if (opc.reaccion != null && typeof opc.reaccion !== "string") {
    return false;
  }
  //si no es arreglo o len 0 -> false
  if (!Array.isArray(opc.OpcionesAsociadas) || opc.OpcionesAsociadas.length === 0) {
    return false;
  }
  for (const asoc of opc.OpcionesAsociadas) {
    if (!validateOpcionesAsociadas(asoc)) 
    {
      return false;
    }
  }
  return true;
}

function validateOpcionesAsociadas(asoc: OpcionesAsociadas): boolean {
  if (typeof asoc.esCorrecta !== "boolean") 
    {
        return false;
    }
if (typeof asoc.consecuencia !== "string" || asoc.consecuencia.trim() === "") 
    {
        return false;
    }
  return true;
}
