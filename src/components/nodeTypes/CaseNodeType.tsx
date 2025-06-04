import React, { ChangeEvent } from 'react';
import { Case } from '../../types/NPCTypes';
import { Handle, Position } from 'reactflow';

interface CaseNodeProps {
  data: {
    nodeData: Case;
    onChangeFieldCase: (campo: keyof Case, valor: any) => void;
    onChangeContextoInicial: (campo: keyof Case['contexto_inicial'], valor: any) => void;
    onChangeInfoPaciente: (campo: keyof Case['contexto_inicial']['informacion_paciente'], valor: any) => void;
    onAddDiagnostico: () => void;
    onDeleteDiagnostico: (idx: number) => void;
    onChangeDiagnostico: (idx: number, valor: string) => void;
    onAddAntecedente: () => void;
    onDeleteAntecedente: (idx: number) => void;
    onChangeAntecedente: (idx: number, valor: string) => void;
    onAddInteraccion: () => void;
  };
}

const CaseNodeType: React.FC<CaseNodeProps> = ({ data }) => {
  const {
    nodeData,
    onChangeFieldCase,
    onChangeContextoInicial,
    onChangeInfoPaciente,
    onAddDiagnostico,
    onDeleteDiagnostico,
    onChangeDiagnostico,
    onAddAntecedente,
    onDeleteAntecedente,
    onChangeAntecedente,
    onAddInteraccion,
  } = data;

  return (
    <div className="w-[60%] bg-white border border-gray-800 rounded-md p-4 shadow-md space-y-3">
      {/* 1) Definimos el Handle “source” que va a estar anclado en la parte inferior */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="case-source"
      />
      {/* Título */}
      <input
        type="text"
        placeholder="Título"
        value={nodeData.titulo}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChangeFieldCase("titulo", e.target.value)
        }
        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />

      {/* Tipo de caso */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700">Tipo de caso:</label>
        <select
          value={nodeData.tipo_caso}
          onChange={(e) => onChangeFieldCase("tipo_caso", e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="APS">APS</option>
          <option value="Urgencia">Urgencia</option>
          <option value="Hospitalario">Hospitalario</option>
        </select>
      </div>

      {/* Contexto inicial – descripción */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700">Descripción:</label>
        <textarea
          value={nodeData.contexto_inicial.descripcion}
          onChange={(e) =>
            onChangeContextoInicial("descripcion", e.target.value)
          }
          rows={2}
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Información del paciente */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700">Nombre paciente:</label>
        <input
          type="text"
          value={nodeData.contexto_inicial.informacion_paciente.nombre}
          onChange={(e) =>
            onChangeInfoPaciente("nombre", e.target.value)
          }
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="text-xs font-medium text-gray-700">Edad:</label>
        <input
          type="number"
          value={nodeData.contexto_inicial.informacion_paciente.edad}
          onChange={(e) =>
            onChangeInfoPaciente("edad", parseInt(e.target.value, 10))
          }
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="text-xs font-medium text-gray-700">Diagnóstico previo:</label>
        <input
          type="text"
          value={nodeData.contexto_inicial.informacion_paciente.diagnostico_previo}
          onChange={(e) =>
            onChangeInfoPaciente("diagnostico_previo", e.target.value)
          }
          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      {/* Diagnóstico actual (lista de inputs) */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700">Diagnóstico actual:</label>
        {nodeData.contexto_inicial.informacion_paciente.diagnostico_actual.map(
          (diag, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <input
                type="text"
                value={diag}
                onChange={(e) => onChangeDiagnostico(idx, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => onDeleteDiagnostico(idx)}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                ×
              </button>
            </div>
          )
        )}
        <button
          onClick={onAddDiagnostico}
          className="text-indigo-600 hover:underline text-xs font-medium"
        >
          + Agregar diagnóstico
        </button>
      </div>

      {/* Antecedentes relevantes */}
      <div className="space-y-1">
        <label className="text-xs font-medium text-gray-700">Antecedentes relevantes:</label>
        {(nodeData.contexto_inicial.informacion_paciente.antecedentes_relevantes || []).map(
          (ant, idx) => (
            <div key={idx} className="flex items-center space-x-1">
              <input
                type="text"
                value={ant}
                onChange={(e) => onChangeAntecedente(idx, e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                onClick={() => onDeleteAntecedente(idx)}
                className="text-red-500 hover:text-red-700 text-lg"
              >
                ×
              </button>
            </div>
          )
        )}
        <button
          onClick={onAddAntecedente}
          className="text-indigo-600 hover:underline text-xs font-medium"
        >
          + Agregar antecedente
        </button>
      </div>

      {/* Botón para agregar una nueva Interacción */}
      <button
        onClick={onAddInteraccion}
        className="mt-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium py-1 rounded"
      >
        + Agregar entidad (NPC)
      </button>
    </div>
  );
};

export default CaseNodeType;
