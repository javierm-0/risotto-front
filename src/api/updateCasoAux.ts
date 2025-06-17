import axios from "axios";
import { Case } from "../types/NPCTypes";
import Tostadas from "../utils/Tostadas";


export async function UpdateCasoAux(backurl: string, caseData: Case) : Promise<boolean>{
      const updatedCase = {
        _id: caseData._id,
        titulo: caseData.titulo,
        tipo_caso: caseData.tipo_caso,
        contexto_inicial: {
          descripcion: caseData.contexto_inicial?.descripcion,
          informacion_paciente: {
            nombre: caseData.contexto_inicial?.informacion_paciente?.nombre,
            edad: caseData.contexto_inicial?.informacion_paciente?.edad,
            diagnostico_previo: caseData.contexto_inicial?.informacion_paciente?.diagnostico_previo,
            diagnostico_actual: [...(caseData.contexto_inicial?.informacion_paciente?.diagnostico_actual ?? [])],
            antecedentes_relevantes: [...(caseData.contexto_inicial?.informacion_paciente?.antecedentes_relevantes ?? [])],
          }
        },
        interacciones: (caseData.interacciones).map(interaccion => ({
          nombreNPC: interaccion.nombreNPC,
          descripcion: interaccion.descripcion,
          preguntas: (interaccion.preguntas).map(pregunta => ({
            pregunta: pregunta.pregunta,
            texto: pregunta.texto,
            opciones: (pregunta.opciones).map(opcion => ({
              texto: opcion.texto,
              reaccion: opcion.reaccion ?? "",
              OpcionesAsociadas: (opcion.OpcionesAsociadas ?? []).map(asoc => ({
                esCorrecta: asoc.esCorrecta ?? false,
                consecuencia: asoc.consecuencia ?? ""
              }))
            }))
          }))
        })),
        informacion_final_caso: caseData.informacion_final_caso
      };

    try {
        const token = localStorage.getItem("token");
        const response = await axios.patch(backurl+updatedCase._id,updatedCase,{headers: { Authorization: `Bearer ${token}` }});
        if(response.status === 200 ){
            Tostadas.ToastSuccess("Caso actualizado exitosamente");
            return true;
        }
        Tostadas.ToastWarning("No se pudo actualizar el caso");
        console.warn(`UpdateCasoAux: Unexpected status ${response.status}`);
        return false;
    } catch (error: any) {
        Tostadas.ToastError("Error durante el envío del caso a actualizar, no se harán cambios");
        if (axios.isAxiosError(error)) {
            console.error("UpdateCasoAux: Axios error", error.response?.data || error.message);
        } else {
            console.error("UpdateCasoAux: Unknown error", error);
        }
        return false;
    }
}