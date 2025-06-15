import { useParams, useNavigate } from "react-router-dom";
import InteraccionNodeType from "../../nodeTypes/InteraccionNodeType";
import RelatoNodeType from "../../nodeTypes/RelatoNodeType";
import {
  Case,
  InteraccionType,
  RelatoType,
  OpcionType,
  OpcionesAsociadas,
} from "../../../types/NPCTypes";

interface InteraccionDetalleProps {
  caseData: Case;
  actualizarCampoInteraccion: (
    id: string,
    campo: keyof InteraccionType,
    valor: any
  ) => void;
  eliminarInteraccion: (id: string) => void;
  agregarRelato: (parentId: string) => void;
  actualizarCampoRelato: (
    interId: string,
    relatoId: string,
    campo: keyof RelatoType,
    valor: string
  ) => void;
  eliminarRelato: (interId: string, relatoId: string) => void;
  actualizarCampoOpcion: (
    interId: string,
    relatoId: string,
    opcionId: string,
    campo: keyof OpcionType | keyof OpcionesAsociadas,
    valor: any
  ) => void;
  eliminarOpcion: (
    interId: string,
    relatoId: string,
    opcionId: string
  ) => void;
  agregarOpcion: (interId: string, relatoId: string) => void;
  basePath: string;
}

const InteraccionDetalle: React.FC<InteraccionDetalleProps> = ({
  caseData,
  actualizarCampoInteraccion,
  eliminarInteraccion,
  agregarRelato,
  actualizarCampoRelato,
  eliminarRelato,
  actualizarCampoOpcion,
  eliminarOpcion,
  agregarOpcion,
  basePath,
}) => {
  const { idInteraccion } = useParams<{ idInteraccion: string }>();
  const navigate = useNavigate();

  if (!idInteraccion) return <p>ID de interacción no especificado</p>;

  // 1) Buscamos la interacción correspondiente
  const interaccion = caseData.interacciones.find(
    (i) => i.id === idInteraccion
  );
  if (!interaccion) return <p>Interacción no encontrada</p>;

  // 2) “relatos” son las preguntas (RelatoType[]) de esa interacción
  const relatos = interaccion.preguntas;

  return (
    <div className="flex flex-col h-full">
      {/* Cabecera con botón “Volver a vista general” */}
      <header className="p-4 bg-gray-50 border-b flex items-center space-x-4">
        <button
          className="text-teal-600 hover:underline text-sm"
          onClick={() =>
            navigate(`${basePath}/${caseData._id}`,{state: {caso: caseData}})
          }
        >
          ← Volver a vista general
        </button>
        <span className="font-semibold">
          Editando Interacción: {interaccion.nombreNPC || "(sin nombre)"}
        </span>
      </header>

      {/* Contenido principal: interacción fija a la izquierda, relatos a la derecha */}
      <main className="flex-1 flex overflow-x-auto space-x-6 p-4">
        {/* Panel izquierdo: un sólo InteraccionNodeType */}
        <div className="w-1/4">
          <InteraccionNodeType
            data={{
              nodeData: interaccion,
              onChangeField: (campo, valor) =>{
                if (!interaccion.id) {
                  console.error("No id al editar interacción");
                  return;
                }
                  console.log("actualizarCampoInteraccion : interID: ",interaccion.id, "campo: "+campo, "valor: "+valor);
                  actualizarCampoInteraccion(interaccion.id, campo, valor);
                },
              onDelete: () => {
                console.log("eliminarInteraccion : interID: ",interaccion.id);
                if (!interaccion.id) {
                  console.error("No id al editar interacción");
                  return;
                }
                eliminarInteraccion(interaccion.id);
                navigate(`${basePath}/${caseData._id}`);
               },
              onAddRelato: () => {
                console.log("agregarRelato : interID: ",interaccion.id);
                if (!interaccion.id) {
                  console.error("No id al editar interacción");
                  return;
                }
                agregarRelato(interaccion.id)
              },
              onEnfocar: () => {},
              nodeRef: () => {},
              showHandles: false,
            }}
          />
        </div>

        {/* Panel derecho: fila horizontal de RelatoNodeType */}
        <div className="flex-1 flex space-x-6 overflow-x-auto">
          {relatos.map((relato: RelatoType) => (
            <div key={relato.id} className="w-64">
              <RelatoNodeType
                data={{
                  nodeData: relato,
                  onChangeRelatoField: (campo, valor) =>
                    actualizarCampoRelato(
                      interaccion.id!,
                      relato.id!,
                      campo,
                      valor
                    ),
                  onDeleteRelato: () =>
                    eliminarRelato(interaccion.id!, relato.id!),
                  onAddOpcion: () =>
                    agregarOpcion(interaccion.id!, relato.id!),
                  onDeleteOpcion: (opcionId) =>
                    eliminarOpcion(
                      interaccion.id!,
                      relato.id!,
                      opcionId
                    ),
                  onChangeOpcionField: (opcionId, campo, valor) =>
                    actualizarCampoOpcion(
                      interaccion.id!,
                      relato.id!,
                      opcionId,
                      campo,
                      valor
                    ),
                  nodeRef: () => {},
                }}
              />
            </div>
          ))}

          {/* Botón “+ Relato” al final */}
          <div className="flex items-center">
            <button
              onClick={() => agregarRelato(interaccion.id!)}
              className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 text-xs"
            >
              + Relato
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InteraccionDetalle;
