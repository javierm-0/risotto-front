import axios from "axios";
import { Case } from "../types/NPCTypes";
import Tostadas from "../utils/Tostadas";

    export async function CrearCaso(backUrl: string, caseData:Case) : Promise<boolean> {
        const jsonCase = {
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
            const response = await axios.post(backUrl,jsonCase,{headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
            if(response.status === 201){
                Tostadas.ToastSuccess("Caso creado exitosamente");
                return true;
            }
            else{
                Tostadas.ToastWarning("No se pudo crear el caso");
                return false;
            }
            
        } catch (error) {
            Tostadas.ToastError("Error, No se pudo crear el caso");
            return false;
        }

        return false;
    };