// src/components/TestearNodos.tsx
import React, { useEffect, useRef, useState, useCallback} from 'react';
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  NodeDragHandler,
  Background,
  Controls
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Case} from '../../types/NPCTypes';
import { RFNode, RFEdge } from '../../types/ReactFlowTypes';
import { createEnrichedElements } from '../../utils/reactflowHelpers';
import { createFlowHandlers } from '../../utils/createFlowHandlers';

import CaseNodeType from '../nodeTypes/CaseNodeType';
import InteraccionNodeType from '../nodeTypes/InteraccionNodeType';
import RelatoNodeType from '../nodeTypes/RelatoNodeType';

export const nodeTypes = {
  caseNode: CaseNodeType,
  interaccionNode: InteraccionNodeType,
  relatoNode: RelatoNodeType,
};

const DEBOUNCE_DELAY = 300; // milisegundos

const TestearNodos: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);

  const [canvasWidth, setCanvasWidth] = useState<number>(800);

  // 1) Estado principal “Case”
  const [caseData, setCaseData] = useState<Case>({
    _id: 'case-temp-id',
    titulo: '',
    tipo_caso: 'Urgencia',
    contexto_inicial: {
      descripcion: '',
      informacion_paciente: {
        nombre: '',
        edad: 0,
        diagnostico_previo: '',
        diagnostico_actual: [],
        antecedentes_relevantes: [],
      },
    },
    interacciones: [],
    informacion_final_caso: '',
  });

  // 2) Hooks de React Flow
  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge[]>([]);

  // Flag para reconstruir el layout
  const [needsRecalc, setNeedsRecalc] = useState<boolean>(true);

  // Capturamos ancho real del contenedor al montar
  useEffect(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCanvasWidth(rect.width);
    }
  }, []);

  // Handler que lanza recálculo al soltar un nodo (debounce)
  const onNodeDragStop: NodeDragHandler = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setNeedsRecalc(true);
      timerRef.current = null;
    }, DEBOUNCE_DELAY);
  }, []);

  // Creamos “handlers” que actualizan caseData + marcan needsRecalc
  const handlers = createFlowHandlers(
    caseData,
    setCaseData,
    nodes,
    setNodes,
    setNeedsRecalc
  );

  // 1) Reconstruir TODO el layout cuando cambie needsRecalc o canvasWidth
  useEffect(() => {
    if (!needsRecalc) return;

    const { enrichedNodes, rawEdges } = createEnrichedElements(
      caseData,
      canvasWidth,
      handlers
    );
    setNodes(enrichedNodes);
    setEdges(rawEdges);
    setNeedsRecalc(false);
  }, [needsRecalc, caseData, canvasWidth, handlers, setNodes, setEdges]);

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 bg-gray-100 border-b flex gap-2">
        {/* Muestra el JSON actual */}
        <button
          className="bg-[#164a5f] text-white py-2 px-4 rounded hover:bg-[#0d5c71]"
          onClick={() => console.log(JSON.stringify(caseData, null, 2))}
        >
          Mostrar JSON del caso
        </button>
        {/* Fuerza recálculo manual */}
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
            onEdgesChange={onEdgesChange}
            onNodeDragStop={onNodeDragStop}
            nodeTypes={nodeTypes}
            nodesDraggable={true}
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
