// src/utils/injectID.ts

import { Case, InteraccionType, RelatoType, OpcionType, OpcionesAsociadas } from "../types/NPCTypes";

/**
 * Recorre un Case y garantiza que _id e id existan en cada nivel:
 *  - Caso
 *  - Interacciones
 *  - Preguntas (relatos)
 *  - Opciones
 *  - OpcionesAsociadas
 *
 * Si algún objeto no trae _id, genera uno basado en el caseId y los índices.
 * Luego, copia ese valor a `id` en cada objeto.
 */
export function injectIdsIntoCase(originalCase: Case): Case {
  const caseId = originalCase._id || `case-${Date.now()}`;

  // Generadores de ID por niveles
  const generarIdInter = (iIdx: number) => `inter-${caseId}-${iIdx}-${Date.now()}`;
  const generarIdPreg = (iIdx: number, pIdx: number) => `preg-${caseId}-${iIdx}-${pIdx}-${Date.now()}`;
  const generarIdOpc = (iIdx: number, pIdx: number, oIdx: number) =>
    `opc-${caseId}-${iIdx}-${pIdx}-${oIdx}-${Date.now()}`;
  const generarIdAsoc = (iIdx: number, pIdx: number, oIdx: number, aIdx: number) =>
    `asoc-${caseId}-${iIdx}-${pIdx}-${oIdx}-${aIdx}-${Date.now()}`;

  const nuevasInteracciones: InteraccionType[] = originalCase.interacciones.map(
    (interaccion, iIdx) => {
      // Determinar el _id de la interacción: o bien viene en la propiedad _id,
      // o lo generamos con un sufijo basado en índices.
      const actualIdInter = (interaccion as any)._id || generarIdInter(iIdx);

      // Ahora procesamos cada pregunta (relato) dentro de la interacción
      const nuevasPreguntas: RelatoType[] = interaccion.preguntas.map((pregunta, pIdx) => {
        const actualIdPreg = (pregunta as any)._id || generarIdPreg(iIdx, pIdx);

        // Procesar cada opción dentro de la pregunta
        const nuevasOpciones: OpcionType[] = pregunta.opciones.map((opcion, oIdx) => {
          const actualIdOpc = (opcion as any)._id || generarIdOpc(iIdx, pIdx, oIdx);

          // Procesar cada OpcionesAsociadas dentro de la opción
          const nuevasAsociadas: OpcionesAsociadas[] =
            opcion.OpcionesAsociadas?.map((asoc, aIdx) => {
              // Si asoc ya trae `id`, lo conservamos; si no, lo generamos
              const actualIdAsoc = (asoc as any).id || generarIdAsoc(iIdx, pIdx, oIdx, aIdx);
              return {
                ...asoc,
                id: actualIdAsoc,
              };
            }) || [];

          return {
            // Establecemos _id y id con el mismo valor
            _id: actualIdOpc,
            id: actualIdOpc,
            texto: opcion.texto,
            reaccion: opcion.reaccion,
            OpcionesAsociadas: nuevasAsociadas,
          } as OpcionType;
        });

        return {
          // Establecemos _id y id con el mismo valor
          _id: actualIdPreg,
          id: actualIdPreg,
          pregunta: pregunta.pregunta,
          texto: pregunta.texto,
          opciones: nuevasOpciones,
        } as RelatoType;
      });

      return {
        // Establecemos _id y id con el mismo valor
        _id: actualIdInter,
        id: actualIdInter,
        nombreNPC: interaccion.nombreNPC,
        descripcion: (interaccion as any).descripcion || interaccion.descripcion || "",
        preguntas: nuevasPreguntas,
      } as InteraccionType;
    }
  );

  return {
    // Copiamos _id → id en la raíz del caso
    _id: caseId,
    titulo: originalCase.titulo,
    tipo_caso: originalCase.tipo_caso,
    contexto_inicial: originalCase.contexto_inicial,
    interacciones: nuevasInteracciones,
    informacion_final_caso: originalCase.informacion_final_caso,
  };
}
