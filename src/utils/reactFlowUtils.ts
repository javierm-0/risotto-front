import { Case } from '../types/NPCTypes';
import { RFNode, RFEdge } from '../types/ReactFlowTypes';

const nodoWidth = 200;
const nodoHeight = 120;
const gapHorizontalInteraccion = 40;
const gapVerticalEntreNiveles = 60;
const gapHorizontalRelato = 30;

export function computeFlowElements(caseData: Case, canvasWidth: number) {
  const nodes: RFNode[] = [];
  const edges: RFEdge[] = [];

  // 1. Nodo Case
  const caseId = caseData._id || caseData.titulo || 'case-node';
  nodes.push({
    id: caseId,
    type: 'caseNode',
    position: { x: canvasWidth / 2 - nodoWidth / 2, y: 20 },
    data: { nodeData: caseData },
    draggable: false,
  } as RFNode);

  // 2. Nodos de Interacción y aristas Case→Interacción
  const nInter = caseData.interacciones.length;
  const anchoTotal = nInter * nodoWidth + Math.max(0, nInter - 1) * gapHorizontalInteraccion;
  const xPrimerInter = (canvasWidth - anchoTotal) / 2;
  const yInter = 600 + nodoHeight + gapVerticalEntreNiveles;

  caseData.interacciones.forEach((inter, idx) => {
    const xInter = xPrimerInter + idx * (nodoWidth + gapHorizontalInteraccion);
    nodes.push({
      id: inter.id!,
      type: 'interaccionNode',
      position: { x: xInter, y: yInter },
      data: { nodeData: inter },
      draggable: false,
    } as RFNode);
    edges.push({
      id: `edge-case-${inter.id!}`,
      source: caseId,
      target: inter.id!,
      type: 'smoothstep',
      sourceHandle: "case-source",
      targetHandle: "inter-target",
    });

    // 3. Si hay Relatos dentro de esta Interacción, los colocamos debajo
    if (inter.preguntas.length > 0) {
      const yPrimRel = yInter + nodoHeight + gapVerticalEntreNiveles;
      inter.preguntas.forEach((rel, idxRel) => {
        //const xRel = xInter + idxRel * (nodoWidth + gapHorizontalRelato);
        const yRel = yInter+(idxRel+1)*(nodoWidth + gapHorizontalRelato);
        nodes.push({
          id: rel.id!,
          type: 'relatoNode',
          position: { x: xInter, y:yRel },
          data: { nodeData: rel, parentInterId: inter.id! },
          draggable: false,
        } as RFNode);

        // Arista Interacción→primer Relato
        if (idxRel === 0) {
          edges.push({
            id: `edge-${inter.id!}-${rel.id!}`,
            source: inter.id!,
            target: rel.id!,
            type: 'straight',
            sourceHandle: "inter-source",
            targetHandle: "rel-target",
          });
        }
        // Arista Relato[i-1]→Relato[i]
        if (idxRel > 0) {
          const prevId = inter.preguntas[idxRel - 1].id!;
          edges.push({
            id: `edge-${prevId}-${rel.id!}`,
            source: prevId,
            target: rel.id!,
            type: 'straight',
            sourceHandle: 'rel-source',
            targetHandle: 'rel-target',
          });
        }
      });
    }
  });

  return { nodes, edges };
}

/**
 *  Dado el arreglo actual de nodos de React Flow y un parentInterId, calcula
 *    la posición (x,y) donde debería ir el nuevo Relato, poniéndolo justo
 *    debajo del nodo Interacción padre.
 *
 *    - Busca la posición {x, y} del nodo padre.
 *    - Le suma un offset en Y (por ejemplo: alto del nodo + gapVerticalEntreNiveles).
 *
 *  En este ejemplo uso:
 *    offsetY = nodoHeight + gapVerticalEntreNiveles
 */
export function computeNewRelatoPosition(
  nodes: RFNode[],
  parentInterId: string
): { x: number; y: number } {
  const parentNode = nodes.find((n) => n.id === parentInterId);
  if (!parentNode) {
    console.warn(`No existe un nodo de Interacción con id = ${parentInterId}`);
    // Devolvemos (0,0) como fallback para que no crashee, pero idealmente no debería ocurrir.
    return { x: 0, y: 0 };
  }

  // 1) Extraemos su posición actual
  const { x: parentX, y: parentY } = parentNode.position as { x: number; y: number };

  // 2) Desplazamiento en Y para “dejar espacio” debajo del padre:
  const offsetY = nodoHeight + gapVerticalEntreNiveles;

  // 3) Devolvemos coord (misma X padre, pero Y padre + offset)
  return {
    x: parentX,
    y: parentY + offsetY,
  };
}