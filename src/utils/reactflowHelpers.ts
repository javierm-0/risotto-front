// src/utils/reactflowHelpers.ts
import { Case } from "../types/NPCTypes";
import { RFNode, RFEdge } from "../types/ReactFlowTypes";
import { computeFlowElements } from "./reactFlowUtils";

export type CaseHandlers = {
  onChangeFieldCase: (campo: keyof Case, valor: any) => void;
  onChangeContextoInicial: (campo: keyof Case["contexto_inicial"], valor: any) => void;
  onChangeInfoPaciente: (campo: keyof Case["contexto_inicial"]["informacion_paciente"], valor: any) => void;
  onAddDiagnostico: () => void;
  onDeleteDiagnostico: (idx: number) => void;
  onChangeDiagnostico: (idx: number, valor: string) => void;
  onAddAntecedente: () => void;
  onDeleteAntecedente: (idx: number) => void;
  onChangeAntecedente: (idx: number, valor: string) => void;
  onAddInteraccion: () => void;
};

export type InteraccionHandlers = {
  onChangeInteraccionField: (interId: string, campo: "nombreNPC" | "descripcion", valor: string) => void;
  onDeleteInteraccion: (interId: string) => void;
  onAddRelato: (interId: string) => void;
};

export type RelatoHandlers = {
  onChangeRelatoField: (
    interId: string,
    relatoId: string,
    campo: "pregunta" | "texto",
    valor: string
  ) => void;
  onDeleteRelato: (interId: string, relatoId: string) => void;
  onAddOpcion: (interId: string, relatoId: string) => void;
  onDeleteOpcion: (interId: string, relatoId: string, opcionId: string) => void;
  onChangeOpcionField: (
    interId: string,
    relatoId: string,
    opcionId: string,
    campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
    valor: any
  ) => void;
};

export type AllHandlers = CaseHandlers &
  InteraccionHandlers &
  RelatoHandlers;

/**
 * Toma:
 *   - caseData: el objeto Case completo
 *   - canvasWidth: ancho del contenedor (para el layout)
 *   - handlers: todas las funciones que cada tipo de nodo necesita
 * Devuelve:
 *   { enrichedNodes, rawEdges }
 * donde `enrichedNodes` es RFNode[] con todos los callbacks inyectados,
 * y `rawEdges` se copia tal cual de computeFlowElements.
 */
export function createEnrichedElements(
  caseData: Case,
  canvasWidth: number,
  handlers: AllHandlers
): { enrichedNodes: RFNode[]; rawEdges: RFEdge[] } {
  // 1) obtenemos los nodos y aristas “crudos” según el layout
  const { nodes: rawNodes, edges: rawEdges } = computeFlowElements(
    caseData,
    canvasWidth
  );
  // 2) transformamos rawNodes → enrichedNodes inyectando callbacks
  const enrichedNodes: RFNode[] = rawNodes.map((node) => {
    // ——— Caso “CaseNode” ———
    if (node.type === "caseNode") {
      return {
        ...node,
        data: {
          ...node.data,
          // Cada callback del CaseNode llama primero al handler (actualiza caseData)
          // y después actualiza solo el nodo correspondiente dentro de `enrichedNodes` vía setNodes()
          onChangeFieldCase: (campo: keyof Case, valor: any) => {
            handlers.onChangeFieldCase(campo, valor);
            // Lógica de “actualizar solo el nodo Case” tendrá que ir en el componente
            // (aquí nos limitamos a exponer el callback; la actualización física de `nodes`
            // se realiza en TestearNodos.tsx al invocar setNodes).
          },
          onChangeContextoInicial: (campo : any, valor: any) => {
            handlers.onChangeContextoInicial(campo, valor);
          },
          onChangeInfoPaciente: (campo: any, valor: any) => {
            handlers.onChangeInfoPaciente(campo, valor);
          },
          onAddDiagnostico: () => {
            handlers.onAddDiagnostico();
          },
          onDeleteDiagnostico: (idx: number) => {
            handlers.onDeleteDiagnostico(idx);
          },
          onChangeDiagnostico: (idx: number, valor: string) => {
            handlers.onChangeDiagnostico(idx, valor);
          },
          onAddAntecedente: () => {
            handlers.onAddAntecedente();
          },
          onDeleteAntecedente: (idx: number) => {
            handlers.onDeleteAntecedente(idx);
          },
          onChangeAntecedente: (idx: number, valor: string) => {
            handlers.onChangeAntecedente(idx, valor);
          },
          onAddInteraccion: () => {
            handlers.onAddInteraccion();
          },
        },
      };
    }

    // ——— Caso “InteraccionNode” ———
    if (node.type === "interaccionNode") {
      return {
        ...node,
        data: {
          ...node.data,
          onChangeField: (campo: "nombreNPC" | "descripcion", valor: string) => {
            handlers.onChangeInteraccionField(node.id, campo, valor);
          },
          onDelete: () => {
            handlers.onDeleteInteraccion(node.id);
          },
          onAddRelato: () => {
            handlers.onAddRelato(node.id);
          },
        },
      };
    }

    // ——— Caso “RelatoNode” ———
    if (node.type === "relatoNode") {
      // Para este nodo sí necesitamos saber el interId padre, que computeFlowElements guardó en `data.parentInterId`.
      const parentInterId = (node.data as any).parentInterId as string;

      return {
        ...node,
        data: {
          ...node.data,
          onChangeRelatoField: (campo: "pregunta" | "texto", valor: string) => {
            handlers.onChangeRelatoField(parentInterId, node.id, campo, valor);
          },
          onDeleteRelato: () => {
            handlers.onDeleteRelato(parentInterId, node.id);
          },
          onAddOpcion: () => {
            handlers.onAddOpcion(parentInterId, node.id);
          },
          onDeleteOpcion: (opcId: string) => {
            handlers.onDeleteOpcion(parentInterId, node.id, opcId);
          },
          onChangeOpcionField: (
            opcId: string,
            campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
            valor: any
          ) => {
            handlers.onChangeOpcionField(
              parentInterId,
              node.id,
              opcId,
              campo,
              valor
            );
          },
        },
      };
    }

    // Si hay otros tipos de nodo (por ejemplo “opcionNode”), repítelo según corresponda
    return node;
  });

  return { enrichedNodes, rawEdges };
}
