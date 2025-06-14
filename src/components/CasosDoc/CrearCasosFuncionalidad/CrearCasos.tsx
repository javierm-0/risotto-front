import { useState } from "react";
import DocenteSidebar from "../../DocenteSidebar";
import NPC from "./NPC";
import {
  agregarNPC,
  eliminarNPC,
  actualizarNombre,
  actualizarDescripcionNPC,
  agregarPregunta,
  agregarOpcion,
  eliminarOpcion,
  eliminarPregunta,
  actualizarOpcion,
  actualizarTextoPregunta,
} from "../../../utils/npcUtils";
import { Case} from "../../../types/NPCTypes";
import axios from "axios";
import Tostadas from "../../../utils/Tostadas";
import { ToastContainer } from "react-toastify";
import { addItem, removeItemAt, updateItemAt } from "../../../utils/arrayUtils";

type TipoCaso = Case['tipo_caso'];
const TIPOS_CASO: TipoCaso[] = ["APS", "Urgencia", "Hospitalario"];
const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;

function CrearCasos() {
  const [caso, setCaso] = useState<Case>({
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
      }
    },
    interacciones: [],
    informacion_final_caso: "",
  });
  const [creandoCaso, setCreandoCaso] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);



  const URL_BACKEND = "http://"+BACKEND_IP+":3001/simulation/case/create";

   const isFormValid = () => {
    return (
      caso.titulo.trim() !== "" &&
      caso.contexto_inicial.descripcion !== "" &&
      caso.contexto_inicial.informacion_paciente.nombre.trim() !== "" &&
      caso.contexto_inicial.informacion_paciente.diagnostico_previo.trim() !== "" &&
      caso.contexto_inicial.informacion_paciente.edad > 0
    );
  };



  const handleCrearCaso = async () => {
    if (!isFormValid()) {
      Tostadas.ToastWarning("Por favor, complete todos los campos.");
      return;
    }
    if(caso === undefined) return;

    setCreandoCaso(true);
    const json : Case = {
      titulo: caso.titulo,
      tipo_caso: caso.tipo_caso,
      contexto_inicial: {
        descripcion: caso.contexto_inicial.descripcion,
        informacion_paciente: {
          nombre: caso.contexto_inicial.informacion_paciente.nombre,
          edad: caso.contexto_inicial.informacion_paciente.edad,
          diagnostico_previo: caso.contexto_inicial.informacion_paciente.diagnostico_previo,
          diagnostico_actual: caso.contexto_inicial.informacion_paciente?.diagnostico_actual ?? [],
          antecedentes_relevantes: caso.contexto_inicial.informacion_paciente.antecedentes_relevantes
        }
      },
      interacciones: caso.interacciones?.map(interaccion => ({
      id: interaccion.id,
      nombreNPC: interaccion.nombreNPC,
      descripcionNPC: interaccion.descripcion,
      preguntas: interaccion.preguntas?.map(pregunta => ({
        id: pregunta.id,
        pregunta: pregunta.pregunta,
        texto: pregunta.texto ?? '',
        opciones: pregunta.opciones?.map(opcion => ({
          id: opcion.id,
          texto: opcion.texto,
          reaccion: opcion.reaccion,
          OpcionesAsociadas: opcion.OpcionesAsociadas?.map(opAsoc => ({
            id: opAsoc.id,
            esCorrecta: opAsoc.esCorrecta,
            consecuencia: opAsoc.consecuencia
          })) ?? []
        })) ?? []
      })) ?? []
    })) ?? [],
    informacion_final_caso: caso.informacion_final_caso ?? ''
  }


    console.log("Caso clínico creado:", JSON.stringify(json, null, 2));
    
    try {
      const response = await axios.post(URL_BACKEND, json);
      console.log("response: ", response);
      if (response.status === 201) {
        console.log("Caso clínico creado exitosamente");
        Tostadas.ToastSuccess("Caso clínico creado exitosamente");
        setCreandoCaso(true);
      }

    } catch (error) {
        console.error("Error al crear el caso clínico:", error);
        setCreandoCaso(false);
        Tostadas.ToastError("Error al crear el caso clínico");
    }
  };

  const handleAgregarNPC = () => {
    if(!caso) return;
    const nuevasInteracciones = agregarNPC(caso.interacciones);
    setCaso({
      ...caso, 
      interacciones: nuevasInteracciones
    });
  };
  const handleActualizarNombreNPC = (i: number, nuevoNombre: string) => {
    if (!caso) return;
    const nuevasInteracciones = actualizarNombre(caso.interacciones, i, nuevoNombre);
    setCaso({...caso , interacciones: nuevasInteracciones});
  }
  const handleActualizarDescripcionNPC = (i: number, nuevaDescripcion: string) => {
    if (!caso) return;
    const nuevasInteracciones = actualizarDescripcionNPC(caso.interacciones, i, nuevaDescripcion);
    setCaso({...caso, interacciones: nuevasInteracciones});
  }
  const handleEliminarNPC = (i: number) => {
    if(!caso) return;
    const interaccionesPostDelete = eliminarNPC(caso.interacciones, i);
    setCaso({...caso, interacciones: interaccionesPostDelete});
  }
  const handleAgregarPregunta = (npcIndex: number) => {
    if (!caso) return;
    const interaccionesPostAgregarPregunta = agregarPregunta(caso.interacciones, npcIndex);
    setCaso({
      ...caso,
      interacciones: interaccionesPostAgregarPregunta
    });
  }
  const handleEliminarPregunta = (npcIndex: number, preguntaIndex: number) =>{
    if(!caso) return;
    const interaccionesPostDeletePregunta = eliminarPregunta(caso.interacciones, npcIndex, preguntaIndex);
    setCaso({
      ...caso,
      interacciones: interaccionesPostDeletePregunta
    });
  }
  const handleChangeEnunciadoPregunta = (npcIndex: number, preguntaIndex: number, nuevoEnunciado: string) => {
  if(!caso) return;
  const interaccionesActualizadas = [...caso.interacciones];
  interaccionesActualizadas[npcIndex].preguntas[preguntaIndex].pregunta = nuevoEnunciado;
  setCaso({
    ...caso,
    interacciones: interaccionesActualizadas
  });
};

  const handleAgregarOpcion = (npcIndex: number, preguntaIndex: number) =>{
    if(!caso) return;
    const interaccionesPostAgregarOpcion = agregarOpcion(caso.interacciones,npcIndex,preguntaIndex);
    setCaso({
      ...caso,
      interacciones: interaccionesPostAgregarOpcion
    });
  }
  const handleEliminarOpcion = (npcIndex: number, preguntaIndex: number, opcionIndex: number) =>{
    if(!caso) return;
    const interraccionesPostEliminarOpcion = eliminarOpcion(caso.interacciones,npcIndex,preguntaIndex,opcionIndex);
    setCaso({
      ...caso,
      interacciones: interraccionesPostEliminarOpcion
    });
  }

  const handleChangeOpcion = (
    npcIndex: number,
    preguntaIndex: number,
    opcionIndex: number,
    campo: "texto" | "reaccion" | "esCorrecta" | "consecuencia",
    valor: string | boolean
  ) => {
    if(!caso) return;
    const interaccionesPostUpdateOpcion = actualizarOpcion(caso.interacciones,npcIndex,preguntaIndex,opcionIndex,campo,valor);
    setCaso({
      ...caso,
      interacciones: interaccionesPostUpdateOpcion
    });
  };

 const cambiarDiagnostico = (idx: number, valor: string) => {
  if (!caso) return;
  const nuevoDiagnosticoActual = updateItemAt(caso.contexto_inicial.informacion_paciente.diagnostico_actual, idx, valor);
  setCaso({
    ...caso,
    contexto_inicial: {
      ...caso.contexto_inicial,
      informacion_paciente: {
        ...caso.contexto_inicial.informacion_paciente,
        diagnostico_actual: nuevoDiagnosticoActual,
      },
    },
  });
};

  const agregarDiagnostico = () => {
  if (!caso) return;
  const nuevoDiagnosticoActual = addItem(caso.contexto_inicial.informacion_paciente.diagnostico_actual, '');
  setCaso({
    ...caso,
    contexto_inicial: {
      ...caso.contexto_inicial,
      informacion_paciente: {
        ...caso.contexto_inicial.informacion_paciente,
        diagnostico_actual: nuevoDiagnosticoActual,
      },
    },
  });
};

  const eliminarDiagnostico = (idx: number) => {
  if (!caso) return;
  const nuevoDiagnosticoActual = removeItemAt(caso.contexto_inicial.informacion_paciente.diagnostico_actual, idx);
  setCaso({
    ...caso,
    contexto_inicial: {
      ...caso.contexto_inicial,
      informacion_paciente: {
        ...caso.contexto_inicial.informacion_paciente,
        diagnostico_actual: nuevoDiagnosticoActual,
      },
    },
  });
};

const handleChangeTextoPregunta = (npcIndex: number, preguntaIndex: number, nuevoTexto: string) => {
  setCaso(prevCaso => ({
    ...prevCaso,
    interacciones: actualizarTextoPregunta(prevCaso.interacciones, npcIndex, preguntaIndex, nuevoTexto)
  }));
};



  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 z-40 h-screen">
        <DocenteSidebar onSidebarToggle={setSidebarAbierto} />
      </div>

      <div
        className={`flex-1 flex flex-col p-4 sm:p-8 transition-all duration-300 ${
          sidebarAbierto ? "md:ml-[18rem]" : "md:ml-[4rem]"
        } pt-16 sm:pt-0`}
      >
        <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-6">
          Crear casos clínicos
        </h2>

        <input
          type="text"
          placeholder="Ingrese el título del caso clínico"
          value={caso.titulo}
          className="w-full p-3 text-lg border border-gray-300 rounded mb-4"
          onChange={(e) =>
            setCaso({
              ...caso,
              titulo: e.target.value,
            })
          }
        />


        <div className="mb-4">
        <label className="block mb-2 font-semibold text-[#164a5f]">Tipo de caso clínico</label>
        <div className="flex gap-4">
          {TIPOS_CASO.map((tipo) => (
            <button
              key={tipo}
              type="button"
              className={`px-6 py-3 rounded border text-lg
                ${caso.tipo_caso === tipo ? "bg-[#164a5f] text-white border-[#164a5f]" : "bg-white text-[#164a5f] border-gray-300"}
                transition-colors`}
              onClick={() => setCaso({ ...caso, tipo_caso: tipo })}
            >
              {tipo}
            </button>
          ))}

        </div>
      </div>

        <h3 className="text-lg font-semibold mb-2">Contexto Inicial</h3>

      <input
        type="text"
        placeholder="Descripción del contexto"
        className="w-full p-2 mb-2 border rounded"
        value={caso.contexto_inicial.descripcion}
        onChange={(e) =>
          setCaso({
            ...caso,
            contexto_inicial: {
              ...caso.contexto_inicial,
              descripcion: e.target.value,
            },
          })
        }
      />


      <h4 className="font-medium mt-4">Información del Paciente</h4>

      <input
        type="text"
        placeholder="Nombre del paciente"
        className="w-full p-2 mb-2 border rounded"
        value={caso.contexto_inicial.informacion_paciente.nombre}
        onChange={(e) =>
          setCaso({
            ...caso,
            contexto_inicial: {
              ...caso.contexto_inicial,
              informacion_paciente: {
                ...caso.contexto_inicial.informacion_paciente,
                nombre: e.target.value,
              },
            },
          })
        }
      />


      <input
        type="number"
        placeholder="Edad del paciente"
        className="w-full p-2 mb-2 border rounded"
        value={caso.contexto_inicial.informacion_paciente.edad}
        onChange={(e) =>
          setCaso({
            ...caso,
            contexto_inicial: {
              ...caso.contexto_inicial,
              informacion_paciente: {
                ...caso.contexto_inicial.informacion_paciente,
                edad: parseInt(e.target.value, 10),
              },
            },
          })
        }
      />


      <input
        type="text"
        placeholder="Diagnóstico previo"
        className="w-full p-2 mb-2 border rounded"
        value={caso.contexto_inicial.informacion_paciente.diagnostico_previo}
        onChange={(e) =>
          setCaso({
            ...caso,
            contexto_inicial: {
              ...caso.contexto_inicial,
              informacion_paciente: {
                ...caso.contexto_inicial.informacion_paciente,
                diagnostico_previo: e.target.value,
              },
            },
          })
        }
      />


      <h4 className="font-medium mt-4">Diagnóstico actual</h4>
      {caso.contexto_inicial.informacion_paciente.diagnostico_actual.map((diag, idx) => (
        <div key={idx} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            placeholder={`Diagnóstico #${idx + 1}`}
            className="flex-1 p-2 border rounded"
            value={diag}
            onChange={e => cambiarDiagnostico(idx, e.target.value)}
          />
          <button
            type="button"
            className="px-2 py-1 text-red-600 hover:bg-red-100 rounded"
            onClick={() => eliminarDiagnostico(idx)}
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        className="text-sm text-[#164a5f] hover:underline mb-4"
        onClick={agregarDiagnostico}
      >
        + Agregar diagnóstico
      </button>


        {caso?.interacciones?.map((npc, index) => (
          <NPC
            key={index}
            npc={npc}
            onChangeNombre={(nuevoNombre) => handleActualizarNombreNPC(index, nuevoNombre)}
            onChangeDescripcion={(nuevaDescripcion) => handleActualizarDescripcionNPC(index, nuevaDescripcion)}
            onEliminarNPC={() => handleEliminarNPC(index)}
            onAgregarPregunta={() => handleAgregarPregunta(index)}
            onEliminarPregunta={(preguntaIdx) => handleEliminarPregunta(index, preguntaIdx)}
            onChangeEnunciadoPregunta={(preguntaIdx, nuevoEnunciado) =>
              handleChangeEnunciadoPregunta(index, preguntaIdx, nuevoEnunciado)
            }
            onChangeTextoP={(preguntaIdx, nuevoTexto) => 
              handleChangeTextoPregunta(index, preguntaIdx, nuevoTexto)
            }
            onAgregarOpcion={(preguntaIdx) => handleAgregarOpcion(index, preguntaIdx)}
            onEliminarOpcion={(preguntaIdx, opcionIdx) =>
              handleEliminarOpcion(index, preguntaIdx, opcionIdx)
            }
            onChangeOpcion={(preguntaIdx, opcionIdx, campo, valor) =>
              handleChangeOpcion(index, preguntaIdx, opcionIdx, campo, valor)
            }
          />
        ))}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <button
            type="button"
            className="bg-[#164a5f] text-white py-2 px-4 rounded hover:bg-[#0d5c71] active:scale-95 w-full sm:w-auto"
            onClick={handleAgregarNPC}
          >
            Agregar Entidad
          </button>
        </div>

        <h4 className="font-medium mt-4">Información Final del Caso</h4>

        <textarea
          placeholder="Ingrese la información final del caso..."
          className="w-full p-2 mb-2 border rounded h-32"
          value={caso.informacion_final_caso}
          onChange={(e) => setCaso({ ...caso, informacion_final_caso: e.target.value })}
        />


          {isFormValid() && (
          <button
            type="button"
            className="bg-[#164a5f] text-white py-4 px-4 text-lg rounded hover:bg-[#0d5c71] active:scale-95 w-full sm:w-auto"
            onClick={handleCrearCaso}
            disabled={creandoCaso}
          >
            Crear caso clínico
          </button>
        )}
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default CrearCasos;
