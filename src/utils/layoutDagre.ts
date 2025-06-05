import dagre from "dagre";
import { Node, Edge } from "reactflow";

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  nodeSizes: Record<string, { width: number; height: number }>,
  direction: "TB" | "LR" = "TB"
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === "LR";
  const relatoHeights = nodes
    .filter((n) => n.type === "relatoNode")
    .map((n) => {
      const sz = nodeSizes[n.id];
      return sz ? sz.height : 142;
    });
  const PADDING_VERTICAL = 35;
  const maxRelatoHeight = relatoHeights.length > 0 ? Math.max(...relatoHeights) : 0;//if >0 -> toma altura maxima del nodo, sino 0
  const ranksepValue = Math.min(maxRelatoHeight + PADDING_VERTICAL, 200);

  dagreGraph.setGraph({
    rankdir: direction,
    ranksep: ranksepValue, //distancia entre niveles/profundidad del arbol
    nodesep: 60,//distancia horizontal entre nodos del mismo nivel
    marginx: 20,
    marginy: 20,
  });

  nodes.forEach((node) => {
    const size = nodeSizes[node.id];
    let w: number, h: number;

    if (size) {
      w = size.width;
      h = size.height;
    } else {
      switch (node.type) {
        case "caseNode":
          w = 362.65;
          h = 392.84;
          break;
        case "interaccionNode":
          w = 156.23;
          h = 88.63;
          break;
        case "relatoNode":
          w = 157;
          h = 142;
          break;
        default:
          w = 200;
          h = 100;
          console.warn("Tipo de nodo desconocido en Dagre:", node.type);
          break;
      }
    }
    dagreGraph.setNode(node.id, { width: w, height: h });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const meta = dagreGraph.node(node.id);
    if (!meta) return node;
    const { x, y, width, height } = meta;
    return {
      ...node,
      position: {
        x: x - width! / 2,
        y: y - height! / 2,
      },
      sourcePosition: isHorizontal ? "right" : "bottom",
      targetPosition: isHorizontal ? "left" : "top",
    };
  }) as Node[];

  const layoutedEdges: Edge[] = edges.map((e) => ({ ...e }));
  return { nodes: layoutedNodes, edges: layoutedEdges };
}
