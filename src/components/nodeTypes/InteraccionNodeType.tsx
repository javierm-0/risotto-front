// src/nodeTypes/InteraccionNodeType.tsx
import React, { ChangeEvent } from "react";
import { InteraccionType } from "../../types/NPCTypes";
import { Handle, Position } from "reactflow";

interface InteraccionNodeProps {
  data: {
    nodeData: InteraccionType;
    onChangeField: (campo: "nombreNPC" | "descripcion", valor: any) => void;
    onDelete: () => void;
    onAddRelato: () => void;
    onEnfocar: () => void;
    nodeRef : (el: HTMLDivElement | null) => void;
    showHandles?: boolean,
  };
}

const InteraccionNodeType: React.FC<InteraccionNodeProps> = ({ data }) => {
  const { nodeData, onChangeField, onDelete, onAddRelato, onEnfocar, showHandles = true} = data;

  return (
    <div ref={data.nodeRef} className="w-60 bg-teal-50 border border-teal-700 rounded-md p-3 space-y-2 shadow-sm">
       {/* 1) Handle “target” en la parte superior para conectar desde Case */}
       {showHandles && (
        <Handle type="target" position={Position.Top} id="inter-target" />
      )}
      <input
        type="text"
        placeholder="Nombre de persona"
        value={nodeData.nombreNPC}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeField("nombreNPC", e.target.value)
        }
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <input
        type="text"
        placeholder="Descripción(Opcional)"
        value={nodeData.descripcion}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeField("descripcion", e.target.value)
        }
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
      />
      <div className="flex justify-between">
        <button
          onClick={onDelete}
          className="text-red-500 hover:text-red-700 text-xs font-medium"
        >
          Eliminar NPC
        </button>
         {/* 2) Handle “source” en la parte inferior para conectar al primer Relato */}
        {showHandles && (
          <Handle type="source" position={Position.Bottom} id="inter-source" />
        )}
        <button
          onClick={onAddRelato}
          className="text-teal-600 hover:underline text-xs font-medium"
        >
          + Relato
        </button>

        <button
          onClick={onEnfocar}
          className="text-teal-600 hover:underline text-xs font-medium"
        >
          →Enfocar
        </button>
      </div>
    </div>
  );
};

export default InteraccionNodeType;
