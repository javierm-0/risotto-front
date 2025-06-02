import React, { useEffect, useRef, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { Case } from "../../types/NPCTypes";
import { RFNode, RFEdge } from "../../types/ReactFlowTypes";
import { createEnrichedElements } from "../../utils/reactflowHelpers";
import { createFlowHandlers } from "../../utils/createFlowHandlers";

import CaseNodeType from "../nodeTypes/CaseNodeType";
import InteraccionNodeType from "../nodeTypes/InteraccionNodeType";
import RelatoNodeType from "../nodeTypes/RelatoNodeType";

export const nodeTypes = {
  caseNode: CaseNodeType,
  interaccionNode: InteraccionNodeType,
  relatoNode: RelatoNodeType,
};

const TestearNodos: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(800);

  // 1) Estado principal que representa el “Case” completo
  const [caseData, setCaseData] = useState<Case>({
    _id: "case-temp-id",
    titulo: "",
    tipo_caso: "Urgencia",
    contexto_inicial: {
      descripcion: "",
      informacion_paciente: {
        nombre: "",
        edad: 0,
        diagnostico_previo: "",
        diagnostico_actual: [],
        antecedentes_relevantes: [],
      },
    },
    interacciones: [],
    informacion_final_caso: "",
  });

  // 2) Estados que React Flow consumirá (nodos + aristas)
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges] = useState<RFEdge[]>([]);

  // Flag para saber cuándo reconstruir TODO el layout
  const [needsRecalc, setNeedsRecalc] = useState<boolean>(true);

  // Al montar, capturo el ancho del contenedor para centrar nodos
  useEffect(() => {
    if (wrapperRef.current) {
      const { width } = wrapperRef.current.getBoundingClientRect();
      setCanvasWidth(width);
    }
  }, []);

  //obj handlers llama a modulo createFlowHandlers y nos ahorra poner +400 lineas aca
  const handlers = createFlowHandlers(
    caseData,
    setCaseData,
    nodes,//aca sale un 'error' pero es psicologico xdd
    setNodes,
    setNeedsRecalc
  );

  // 1) Reconstruir TODO cuando cambie needsRecalc o canvasWidth
  useEffect(() => {
    if (!needsRecalc) return;

    const { enrichedNodes, rawEdges } = createEnrichedElements(
      caseData,
      canvasWidth,
      handlers
    );
    setNodes(enrichedNodes);
    setEdges(rawEdges);
    console.log("=== rawEdges =", rawEdges);
    setNeedsRecalc(false);
  }, [needsRecalc, caseData, canvasWidth, handlers, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 border-b flex gap-2">
        <button
          className="bg-[#164a5f] text-white py-2 px-4 rounded hover:bg-[#0d5c71]"
          onClick={() => console.log(JSON.stringify(caseData, null, 2))}
        >
          Generar JSON
        </button>
        <button
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          onClick={() => setNeedsRecalc(true)}
        >
          Actualizar diagrama
        </button>
      </div>

      <div ref={wrapperRef} className="flex-1">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            nodeTypes={nodeTypes}
            nodesDraggable={false}
            nodesConnectable={false}
            elementsSelectable={false}
            zoomOnScroll
            panOnDrag
            fitView
          >
            <Background gap={16} color="#888" />
            <Controls />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default TestearNodos;
