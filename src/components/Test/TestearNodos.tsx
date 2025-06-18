import React, {
  useEffect,
  useRef,
  useState,
  //useCallback,
  useLayoutEffect,
} from "react";
import ReactFlow, {
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  //NodeDragHandler,
  Background,
  Controls,
  Node,
  Edge,
  Viewport, // para tipar el callback onMove
} from "reactflow";
import "reactflow/dist/style.css";

import { Case } from "../../types/NPCTypes";
import { RFNode, RFEdge } from "../../types/ReactFlowTypes";
import { createEnrichedElements } from "../../utils/reactflowHelpers";
import { createFlowHandlers } from "../../utils/createFlowHandlers";
import { getLayoutedElements } from "../../utils/layoutDagre";

//import { createCasePayload } from "../CasosDoc/CrearCasosFuncionalidad/CrearCasosPrincipal";
import { useNavigate } from "react-router-dom";

import { nodeTypes as memoNodeTypes } from "../nodeTypes/CteNodos";

//const DEBOUNCE_DELAY = 300;

interface TestearNodosProps {
  caseId: string;
  caseData: Case;
  setCaseData: React.Dispatch<React.SetStateAction<Case>>;
  basePath: string;
}

const TestearNodos: React.FC<TestearNodosProps> = ({
  caseId,
  caseData,
  setCaseData,
  basePath,
}) => {
  const navigate = useNavigate();
  const wrapperRef = useRef<HTMLDivElement>(null);
  //const timerRef = useRef<number | null>(null);
  const nodeTypesRef = useRef(memoNodeTypes);
  const nodeTypes = nodeTypesRef.current;

  const [canvasWidth, setCanvasWidth] = useState<number>(800);

  const [nodes, setNodes, onNodesChange] = useNodesState<RFNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<RFEdge[]>([]);
  

  // Controla cuando ejecutar el layout con Dagre
  const [needsLayout, setNeedsLayout] = useState<boolean>(true);

  // Mapa de refs para cada nodo
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Mapa de mediciones reales: { [nodeId]: { width, height } }
  const [nodeSizes, setNodeSizes] = useState<
    Record<string, { width: number; height: number }>
  >({});

  // Nivel de zoom actual en React Flow (1 = 100%, 1.5 = 150%, etc.)
  const [zoom, setZoom] = useState<number>(1);

  //
  // 1) Cuando cambian los `nodes` renderizados, medimos cada uno
  //    y desescalamos por el zoom actual.
  //
  useLayoutEffect(() => {
    if (nodes.length === 0) return;

    const nuevasMedidas: Record<string, { width: number; height: number }> = {};
    nodes.forEach((n) => {
      const el = nodeRefs.current[n.id];
      if (el) {
        const rect = el.getBoundingClientRect();
        nuevasMedidas[n.id] = {
          width: Math.round(rect.width / zoom),
          height: Math.round(rect.height / zoom),
        };
      }
    });

    let cambió = false;
    Object.keys(nuevasMedidas).forEach((id) => {
      const prev = nodeSizes[id];
      const next = nuevasMedidas[id];
      if (!prev || prev.width !== next.width || prev.height !== next.height) {
        cambió = true;
      }
    });

    if (cambió) {
      setNodeSizes(nuevasMedidas);
      setNeedsLayout(true);
    }
  }, [nodes, zoom]);

  //
  // 2) Capturamos ancho del contenedor solo al montar
  //
  useEffect(() => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      setCanvasWidth(rect.width);
    }
  }, []);

  /*de momento no se usa
  const onNodeDragStop: NodeDragHandler = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      setNeedsLayout(true);
      timerRef.current = null;
    }, DEBOUNCE_DELAY);
  }, []);
  */

  const handlers = createFlowHandlers(
    caseData,
    setCaseData,
    nodes as RFNode[],
    setNodes as React.Dispatch<React.SetStateAction<RFNode[]>>,
    setNeedsLayout
  );

  //  useEffect controla estos dos fases:
  //    FASE 1: Render sin posiciones (para llenar nodeRefs y medir)
  //    FASE 2: Una vez nodeSizes listo, ejecutar Dagre
  useEffect(() => {
    if (!needsLayout) return;

    // 5.1) Generamos nodos “crudos” y aristas a partir de caseData
    const { enrichedNodes: enrichedRawNodes, rawEdges } = createEnrichedElements(
      caseData,
      canvasWidth,
      handlers
    );


    // 5.2) Inyectar nodeRef en cada nodo y posición inicial {x:0, y:0}
    const nodesForRender: Node[] = enrichedRawNodes.map((n) => ({
      id: n.id,
      type: n.type,
      data: {
        ...n.data,
        onEnfocar: () => {
              navigate(`${basePath}/${caseId}/interacciones/${n.id}` ,{state: {caseData}});
            },
        nodeRef: (el: HTMLDivElement | null) => {
          nodeRefs.current[n.id] = el;
        },
      },
      position: { x: 0, y: 0 },
      ...(n.selected !== undefined ? { selected: n.selected } : {}),
      ...(n.draggable !== undefined ? { draggable: n.draggable } : {}),
      ...(n.connectable !== undefined ? { connectable: n.connectable } : {}),
      ...(n.style !== undefined ? { style: n.style } : {}),
      ...(n.extent !== undefined ? { extent: n.extent } : {}),
    }));

    // 5.3) Chequear que haya medición para todos los nodos
    const todosMedidos = nodesForRender.every((n) => !!nodeSizes[n.id]);

    if (!todosMedidos) {
      // FASE 1: pintamos en (0,0) para que React monte y podamos medir
      setNodes(nodesForRender);
      setEdges(rawEdges as RFEdge[]);
      return;
    }

    // 5.4) FASE 2: Ya hay nodeSizes, ejecutamos Dagre
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      nodesForRender as Node[],
      rawEdges as Edge[],
      nodeSizes,
      "TB"
    );

    setNodes(layoutedNodes as RFNode[]);
    setEdges(layoutedEdges as RFEdge[]);

    setNeedsLayout(false);
  }, [needsLayout, caseData, canvasWidth, nodeSizes]);

  return (
    <div className="flex flex-col h-screen">

      <div ref={wrapperRef} className="flex-1">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            nodesDraggable={true}
            nodesConnectable={false}
            elementsSelectable={true}
            zoomOnScroll
            panOnDrag
            fitView

            onMove={(_evt, viewport: Viewport) => {
              setZoom(viewport.zoom);
            }}
          >
            <Background gap={16} color="#888" />
            <Controls 
              showInteractive={true}
              
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default TestearNodos;
