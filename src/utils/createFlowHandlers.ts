
import { Case, InteraccionType, RelatoType, OpcionType } from "../types/NPCTypes";
import { RFNode } from "../types/ReactFlowTypes";
//import { NodeChange, applyNodeChanges } from "reactflow";

import {
  handleChangeFieldCase as hcfc,
  handleChangeContextoInicial as hcci,
  handleChangeInfoPaciente as hcip,
  handleAddDiagnosticoActual as haddDiag,
  handleDeleteDiagnosticoActual as hdelDiag,
  handleChangeDiagnosticoActual as hchgDiag,
  handleAddAntecedenteRelevante as haddAnt,
  handleDeleteAntecedenteRelevante as hdelAnt,
  handleChangeAntecedenteRelevante as hchgAnt,
} from "../components/handlers/caseHandlers";

import {
  handleAddInteraccion as haddInter,
  handleDeleteInteraccion as hdelInter,
  handleChangeInteraccionField as hchgInter,
} from "../components/handlers/interaccionHandlers";

import {
  handleAddRelato as haddRel,
  handleDeleteRelato as hdelRel,
  handleChangeRelatoField as hchgRel,
  handleAddOpcion as haddOpc,
  handleDeleteOpcion as hdelOpc,
  handleChangeOpcionField as hchgOpc,
} from "../components/handlers/relatoHandlers";

export type AllHandlers = {
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
  onDeleteInteraccion: (interId: string) => void;
  onChangeInteraccionField: (interId: string, campo: keyof InteraccionType, valor: any) => void;

  onAddRelato: (interId: string) => void;
  onDeleteRelato: (interId: string, relId: string) => void;
  onChangeRelatoField: (interId: string, relId: string, campo: keyof RelatoType, valor: any) => void;

  onAddOpcion: (interId: string, relId: string) => void;
  onDeleteOpcion: (interId: string, relId: string, opcId: string) => void;
  onChangeOpcionField: (
    interId: string,
    relId: string,
    opcId: string,
    campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
    valor: any
  ) => void;
};

/**
 * Crea el objeto `handlers` que se pasará a `createEnrichedElements(...)`.
 * Recibe:
 *  - `caseData` (para leer el _id del nodoCase),
 *  - setters de React (`setCaseData`, `setNodes`, `setNeedsRecalc`, y `nodes`).
 */
export function createFlowHandlers(
  caseData: Case,
  setCaseData: React.Dispatch<React.SetStateAction<Case>>,
  _nodes: RFNode[],
  setNodes: React.Dispatch<React.SetStateAction<RFNode[]>>,
  setNeedsRecalc: React.Dispatch<React.SetStateAction<boolean>>
): AllHandlers {
  return {
    // — CaseHandlers —
    onChangeFieldCase: (campo, valor) => {
      setCaseData(prev => hcfc(prev, campo, valor));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                [campo]: valor,
              },
            },
          };
        })
      );
    },
    onChangeContextoInicial: (campo, valor) => {
      setCaseData(prev => hcci(prev, campo, valor));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  [campo]: valor,
                },
              },
            },
          };
        })
      );
    },
    onChangeInfoPaciente: (campo, valor) => {
      setCaseData(prev => hcip(prev, campo, valor));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  informacion_paciente: {
                    ...prevNodeData.contexto_inicial!.informacion_paciente!,
                    [campo]: valor,
                  },
                },
              },
            },
          };
        })
      );
    },
    onAddDiagnostico: () => {
      setCaseData(prev => haddDiag(prev));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          const arrViejo =
            prevNodeData.contexto_inicial!.informacion_paciente.diagnostico_actual;
          const nuevoArr = [...arrViejo, ""];
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  informacion_paciente: {
                    ...prevNodeData.contexto_inicial!.informacion_paciente!,
                    diagnostico_actual: nuevoArr,
                  },
                },
              },
            },
          };
        })
      );
    },
    onDeleteDiagnostico: (idx) => {
      setCaseData(prev => hdelDiag(prev, idx));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          const arrViejo =
            prevNodeData.contexto_inicial!.informacion_paciente.diagnostico_actual;
          const nuevoArr = arrViejo.filter((_v, i) => i !== idx);
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  informacion_paciente: {
                    ...prevNodeData.contexto_inicial!.informacion_paciente!,
                    diagnostico_actual: nuevoArr,
                  },
                },
              },
            },
          };
        })
      );
    },
    onChangeDiagnostico: (idx, valor) => {
      setCaseData(prev => hchgDiag(prev, idx, valor));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          const arrViejo =
            prevNodeData.contexto_inicial!.informacion_paciente.diagnostico_actual;
          const nuevoArr = arrViejo.map((v, i) => (i === idx ? valor : v));
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  informacion_paciente: {
                    ...prevNodeData.contexto_inicial!.informacion_paciente!,
                    diagnostico_actual: nuevoArr,
                  },
                },
              },
            },
          };
        })
      );
    },
    onAddAntecedente: () => {
      setCaseData(prev => haddAnt(prev));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          const arrViejo =
            prevNodeData.contexto_inicial!.informacion_paciente.antecedentes_relevantes ||
            [];
          const nuevoArr = [...arrViejo, ""];
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  informacion_paciente: {
                    ...prevNodeData.contexto_inicial!.informacion_paciente!,
                    antecedentes_relevantes: nuevoArr,
                  },
                },
              },
            },
          };
        })
      );
    },
    onDeleteAntecedente: (idx) => {
      setCaseData(prev => hdelAnt(prev, idx));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          const arrViejo =
            prevNodeData.contexto_inicial!.informacion_paciente.antecedentes_relevantes ||
            [];
          const nuevoArr = arrViejo.filter((_v, i) => i !== idx);
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  informacion_paciente: {
                    ...prevNodeData.contexto_inicial!.informacion_paciente!,
                    antecedentes_relevantes: nuevoArr,
                  },
                },
              },
            },
          };
        })
      );
    },
    onChangeAntecedente: (idx, valor) => {
      setCaseData(prev => hchgAnt(prev, idx, valor));

      const idCaso = caseData._id!;
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== idCaso || n.type !== "caseNode") return n;
          const prevNodeData = n.data.nodeData as Case;
          const arrViejo =
            prevNodeData.contexto_inicial!.informacion_paciente.antecedentes_relevantes ||
            [];
          const nuevoArr = arrViejo.map((v, i) => (i === idx ? valor : v));
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                contexto_inicial: {
                  ...prevNodeData.contexto_inicial!,
                  informacion_paciente: {
                    ...prevNodeData.contexto_inicial!.informacion_paciente!,
                    antecedentes_relevantes: nuevoArr,
                  },
                },
              },
            },
          };
        })
      );
    },

    // — InteracciónHandlers —
    onAddInteraccion: () => {
      setCaseData(prev => haddInter(prev));
      setNeedsRecalc(true);
    },
    onDeleteInteraccion: (interId) => {
      setCaseData(prev => hdelInter(prev, interId));
      setNeedsRecalc(true);
    },
    onChangeInteraccionField: (interId, campo: any, valor) => {
      setCaseData(prev => hchgInter(prev, interId, campo, valor));

      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== interId || n.type !== "interaccionNode") return n;
          const prevNodeData = n.data.nodeData as InteraccionType;
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                [campo]: valor,
              },
            },
          };
        })
      );
    },

    // — Relato + Opción Handlers —
    onAddRelato: (interId) => {
      setCaseData(prev => haddRel(prev, interId));
      setNeedsRecalc(true);
    },
    onDeleteRelato: (interId, relId) => {
      setCaseData(prev => hdelRel(prev, interId, relId));
      setNeedsRecalc(true);
    },
    onChangeRelatoField: (interId, relId, campo : any, valor) => {
      setCaseData(prev => hchgRel(prev, interId, relId, campo, valor));

      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== relId || n.type !== "relatoNode") return n;
          const prevNodeData = n.data.nodeData as RelatoType;
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                [campo]: valor,
              },
            },
          };
        })
      );
    },
    onAddOpcion: (interId, relId) => {
      setCaseData(prev => haddOpc(prev, interId, relId));
      setNeedsRecalc(true);
    },
    onDeleteOpcion: (interId, relId, opcId) => {
      setCaseData(prev => hdelOpc(prev, interId, relId, opcId));
      setNeedsRecalc(true);
    },
    onChangeOpcionField: (interId, relId, opcId, campo, valor) => {
      // 1) Actualizo el estado global
      setCaseData(prev => hchgOpc(prev, interId, relId, opcId, campo, valor));

      // 2) Actualizo solo el array “opciones” dentro del nodo “relatoNode”
      setNodes(prevNodes =>
        prevNodes.map(n => {
          if (n.id !== relId || n.type !== "relatoNode") return n;
          const prevNodeData = n.data.nodeData as RelatoType;

          // Reconstruyo el arreglo de opciones cambiando solo la que coincide con opcId
          const nuevaListaOpciones = prevNodeData.opciones.map(o => {
            if (o.id !== opcId) return o;

            // Copia suave de la Opcion original
            const copiaOpcion: OpcionType = {
              ...o,
              OpcionesAsociadas: [...o.OpcionesAsociadas],
            };

            if (campo === "texto" || campo === "reaccion") {
              copiaOpcion[campo] = valor as string;
            } else {
              // “esCorrecta” o “consecuencia” van dentro de OpcionesAsociadas[0]
              const arrAsoc = copiaOpcion.OpcionesAsociadas!;
              if (arrAsoc.length > 0) {
                if (campo === "esCorrecta") {
                  arrAsoc[0].esCorrecta = valor as boolean;
                }
                if (campo === "consecuencia") {
                  arrAsoc[0].consecuencia = valor as string;
                }
              }
              copiaOpcion.OpcionesAsociadas = arrAsoc;
            }

            return copiaOpcion;
          });

          // Reemplazo solo el array “opciones” en nodeData:
          return {
            ...n,
            data: {
              ...n.data,
              nodeData: {
                ...prevNodeData,
                opciones: nuevaListaOpciones,
              },
            },
          };
        })
      );
    },
  };
}
