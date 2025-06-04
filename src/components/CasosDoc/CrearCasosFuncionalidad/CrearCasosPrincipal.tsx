import React, { useState } from "react";
import { Case, InteraccionType, OpcionesAsociadas, OpcionType, RelatoType } from "../../../types/NPCTypes";
import TestearNodos from "../../Test/TestearNodos";
import { validateCaseData } from "../../../utils/validationUtils";

export function createCasePayload(caseData: Case) {
  return {
    titulo: caseData.titulo,
    tipo_caso: caseData.tipo_caso,
    contexto_inicial: {
      descripcion: caseData.contexto_inicial?.descripcion ?? "",
      informacion_paciente: {
        nombre: caseData.contexto_inicial?.informacion_paciente.nombre ?? "",
        edad: caseData.contexto_inicial?.informacion_paciente.edad ?? 0,
        diagnostico_previo: caseData.contexto_inicial?.informacion_paciente.diagnostico_previo ?? "",
        diagnostico_actual: caseData.contexto_inicial?.informacion_paciente.diagnostico_actual ?? [],
        antecedentes_relevantes: caseData.contexto_inicial?.informacion_paciente.antecedentes_relevantes ?? []
      }
    },
    interacciones: (caseData.interacciones ?? []).map((inter: InteraccionType) => ({
      nombreNPC: inter.nombreNPC,
      ...(inter.descripcion ? { descripcion: inter.descripcion } : {}),
      preguntas: (inter.preguntas ?? []).map((rel: RelatoType) => ({
        pregunta: rel.pregunta,
        texto: rel.texto,
        opciones: (rel.opciones ?? []).map((opc: OpcionType) => ({
          texto: opc.texto,
          ...(opc.reaccion ? { reaccion: opc.reaccion } : {}),
          OpcionesAsociadas: (opc.OpcionesAsociadas ?? []).map((assoc: OpcionesAsociadas) => ({
            esCorrecta: assoc.esCorrecta,
            ...(assoc.consecuencia ? { consecuencia: assoc.consecuencia } : {})
          }))
        }))
      }))
    })),
    informacion_final_caso: caseData.informacion_final_caso
  };
}


const CrearCasosPrincipal: React.FC = () =>{
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

  


  return(
    <div>
        <div>
            {/*luego veo si va el sidebar o no */}
        </div>

        <div>
            <TestearNodos caseData={caseData} setCaseData={setCaseData} />
        </div>
    </div>
  );

};

export default CrearCasosPrincipal;