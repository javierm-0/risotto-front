import React from 'react';
import { ReactFlow, Node, Edge, Controls, Handle, Position } from 'reactflow';
import 'reactflow/dist/style.css';

const CustomNode = ({ data }) => (
  <div style={{ padding: 10, border: '1px solid black', borderRadius: 5, width: 100, textAlign: 'center' }}>
    <Handle type="source" position={Position.Top} id="solo 1 conexion" />
    <Handle type="target" position={Position.Bottom} id="solo 1 conexion" />
    <div>{data.label}</div>
  </div>
);

const nodes: Node[] = [
  {
    id: '1',
    type: 'custom',
    position: { x: 200, y: 0 },
    data: { label: 'hola' }
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 250, y: 200 },
    data: { label: 'mundo' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 200 },
    data: { label: 'mundo3' }
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 0, y: 200 },
    data: { label: 'mundo4' }
  }
];

const edges: Edge[] = [
  {
    id: 'conectar-2-1',
    source: '2',
    target: '1',
    animated: true
  },
  {
    id: 'conectar-3-1',
    source: '3',
    target: '1',
    animated: true
  },
  {
    id: 'conectar-4-1',
    source: '4',
    target: '1',
    animated: true
  }
];

const nodeTypes = { custom: CustomNode };

const TestearNodos: React.FC = () => {
  return (
    <div className=''>
      <div className='bg-gray-200 h-screen'>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} >
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default TestearNodos;
