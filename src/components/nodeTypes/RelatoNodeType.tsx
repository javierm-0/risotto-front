import React, { ChangeEvent } from "react";
import { RelatoType } from "../../types/NPCTypes";
import { Handle, Position } from "reactflow";

interface RelatoNodeProps {
  data: {
    nodeData: RelatoType;
    onChangeRelatoField: (campo: "pregunta" | "texto", valor: any) => void;
    onDeleteRelato: () => void;
    onAddOpcion: () => void;
    onDeleteOpcion: (opcionId: string) => void;
    onChangeOpcionField: (
      opcionId: string,
      campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
      valor: any
    ) => void;
    nodeRef : (el: HTMLDivElement | null) => void;
  };
}

const RelatoNodeType: React.FC<RelatoNodeProps> = ({ data }) => {
  const {
    nodeData,
    onChangeRelatoField,
    onDeleteRelato,
    onAddOpcion,
    onDeleteOpcion,
    onChangeOpcionField,
    //nodeRef,
  } = data;

  return (
    <div ref={data.nodeRef} className="w-64 bg-orange-50 border border-orange-700 rounded-md p-3 space-y-2 shadow-sm">
      {/* 1) Handle “target” en la parte superior: recibe conexión de “inter-source” */}
      <Handle type="target" position={Position.Top} id="rel-target" />
      <input
        type="text"
        placeholder="Enunciado pregunta"
        value={nodeData.pregunta}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeRelatoField("pregunta", e.target.value)
        }
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <textarea
        placeholder="Respuesta de la entidad"
        value={nodeData.texto}
        onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
          onChangeRelatoField("texto", e.target.value)
        }
        rows={8}
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
      />
      <button
        onClick={onDeleteRelato}
        className="text-red-500 hover:text-red-700 text-xs font-medium"
      >
        Eliminar esta pregunta
      </button>

      {/* Opciones dentro del relato */}
      {nodeData.opciones.map((opc, _id) => {
        let counter:number = _id+1;
        return(
          <div
            key={opc.id}
            className="border border-gray-300 rounded p-2 space-y-1 bg-white "
          >
            
            <textarea
              rows={3}
              placeholder={"Alternativa "+ counter +" de respuesta"}
              value={opc.texto}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                onChangeOpcionField(opc.id!, "texto", e.target.value)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
  
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-1 text-xs">
                <input
                  type="checkbox"
                  checked={opc.OpcionesAsociadas[0]?.esCorrecta || false}
                  onChange={(e) =>
                    onChangeOpcionField(opc.id!, "esCorrecta", e.target.checked)
                  }
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span>Es correcta</span>
              </label>
            </div>
  
            <textarea
              rows={6}
              placeholder="Consecuencia"
              value={opc.OpcionesAsociadas[0]?.consecuencia || ""}
              onChange={(e) =>
                onChangeOpcionField(opc.id!, "consecuencia", e.target.value)
              }
              className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
  
            <button
              onClick={() => onDeleteOpcion(opc.id!)}
              className="text-red-500 hover:text-red-700 text-xs font-medium"
            >
              Eliminar Opción
            </button>
          </div>
        )})
      }

      {/* 2) Este Handle “source” permite encadenar Rel[i] → Rel[i+1] (es clave xd)*/}
      <Handle
        type="source"
        position={Position.Bottom}
        id="rel-source"
      />

      <button
        onClick={onAddOpcion}
        className="mt-2 w-full bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium py-1 rounded"
      >
        + Agregar opción
      </button>
    </div>
  );
};

export default RelatoNodeType;
