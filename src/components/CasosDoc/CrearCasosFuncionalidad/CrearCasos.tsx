import { useState } from "react";
import DocenteSidebar from "../../DocenteSidebar";
import NPC from "./NPC";
import {
  agregarNPC,
  eliminarNPC,
  actualizarNombre,
  agregarPregunta,
  agregarOpcion,
  eliminarOpcion,
  eliminarPregunta,
  actualizarOpcion,
} from "../../../utils/npcUtils";
import { NPCType } from "../../../types/NPCTypes";
import axios from "axios";
import Tostadas from "../../../utils/Tostadas";
import { ToastContainer } from "react-toastify";

export type InformacionPacienteType = {
  nombre: string;
  edad: number;
  diagnostico_previo: string;
  diagnostico_actual: string;
  //antecedentes_relevantes?: string[];
};

export type ContextoInicialType = {
  descripcion: string;
  informacion_paciente: InformacionPacienteType;
};

function CrearCasos() {
  const [titulo, setTitulo] = useState("");
  const [tipoCaso, setTipoCaso] = useState("");
  const [contextoInicial, setContextoInicial] = useState<ContextoInicialType>({
  descripcion: "",
  informacion_paciente: {
    nombre: "",
    edad: 0,
    diagnostico_previo: "",
    diagnostico_actual: "",
    //antecedentes_relevantes: [],
  },
});
  const [creandoCaso, setCreandoCaso] = useState(false);
  const [npcs, setNpcs] = useState<NPCType[]>([]);
  const [informacionFinal, setInformacionFinal] = useState("");
  const [sidebarAbierto, setSidebarAbierto] = useState(true);



  const URL_BACKEND = "http://localhost:3001/simulation/case/create";

   const isFormValid = () => {
    return (
      titulo.trim() !== "" &&
      contextoInicial.descripcion !== "" &&
      npcs.length > 0 &&
      tipoCaso !== "" &&
      !npcs.some((npc) => npc.Preguntas.length === 0) &&
      !npcs.some((npc) =>
        npc.Preguntas.some((pregunta) => pregunta.opciones.length === 0)
      ) &&
      !npcs.some((npc) =>
        npc.Preguntas.some((pregunta) =>
          pregunta.opciones.some(
            (opcion) => opcion.enunciado.trim() === ""
          )
        )
      ) &&
      !npcs.some((npc) =>
        npc.Preguntas.some((pregunta) =>
          pregunta.opciones.some(
            (opcion) => opcion.respuestaDelSistema.trim() === ""
          )
        )
      ) &&
      contextoInicial.informacion_paciente.nombre.trim() !== "" &&
      contextoInicial.informacion_paciente.diagnostico_previo.trim() !== "" &&
      contextoInicial.informacion_paciente.edad > 0
    );
  };



  const handleCrearCaso = async () => {
    if (!isFormValid()) {
      Tostadas.ToastWarning("Por favor, complete todos los campos.");
      return;
    }
    setCreandoCaso(true);

    const json = {
      titulo: titulo,
      tipo_caso: tipoCaso,
      contexto_inicial: contextoInicial,
      interacciones: npcs.map((npc) => ({
        nombreNPC: npc.nombre,
        preguntas: npc.Preguntas.map((pregunta) => ({
          texto: pregunta.enunciadoPregunta,
          opciones: pregunta.opciones.map((opcion) => ({
            texto: opcion.enunciado,
            respuestaAsociada: opcion.respuestaDelSistema,
            esCorrecta: opcion.esCorrecta,
            consecuencia: opcion.consecuencia ?? "nada de momento",
          })),
        })),
    })),
      informacion_final_caso: informacionFinal
    };
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

  const handleAgregarNPC = () => setNpcs(agregarNPC(npcs));
  const handleActualizarNombreNPC = (i: number, nombre: string) => setNpcs(actualizarNombre(npcs, i, nombre));
  const handleEliminarNPC = (i: number) => setNpcs(eliminarNPC(npcs, i));
  const handleAgregarPregunta = (npcIndex: number) => setNpcs((prev) => agregarPregunta(prev, npcIndex));
  const handleEliminarPregunta = (npcIndex: number, preguntaIndex: number) =>
    setNpcs((prev) => eliminarPregunta(prev, npcIndex, preguntaIndex));
  const handleChangeEnunciadoPregunta = (npcIndex: number, preguntaIndex: number, nuevoEnunciado: string) => {
  setNpcs((prev) => {
    const copia = [...prev];
    copia[npcIndex].Preguntas[preguntaIndex].enunciadoPregunta = nuevoEnunciado;
    return copia;
  });
};

  const handleAgregarOpcion = (npcIndex: number, preguntaIndex: number) =>
    setNpcs((prev) => agregarOpcion(prev, npcIndex, preguntaIndex));
  const handleEliminarOpcion = (npcIndex: number, preguntaIndex: number, opcionIndex: number) =>
    setNpcs((prev) => eliminarOpcion(prev, npcIndex, preguntaIndex, opcionIndex));

  const handleChangeOpcion = (
    npcIndex: number,
    preguntaIndex: number,
    opcionIndex: number,
    campo: "enunciado" | "respuestaDelSistema" | "esCorrecta",
    valor: string | boolean
  ) => {
    setNpcs((prev) => actualizarOpcion(prev, npcIndex, preguntaIndex, opcionIndex, campo, valor));
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
          value={titulo}
          className="w-full p-3 text-lg border border-gray-300 rounded mb-4"
          onChange={(e) => setTitulo(e.target.value)}
        />

        <div className="mb-4">
        <label className="block mb-2 font-semibold text-[#164a5f]">Tipo de caso clínico</label>
        <div className="flex gap-4">
          {["APS", "Urgencia", "Hospitalario"].map((tipo) => (
            <button
              key={tipo}
              type="button"
              className={`px-6 py-3 rounded border text-lg
                ${tipoCaso === tipo ? "bg-[#164a5f] text-white border-[#164a5f]" : "bg-white text-[#164a5f] border-gray-300"}
                transition-colors`}
              onClick={() => setTipoCaso(tipo)}
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
  value={contextoInicial.descripcion}
  onChange={(e) =>
    setContextoInicial({
      ...contextoInicial,
      descripcion: e.target.value,
    })
  }
/>

      <h4 className="font-medium mt-4">Información del Paciente</h4>

      <input
        type="text"
        placeholder="Nombre del paciente"
        className="w-full p-2 mb-2 border rounded"
        value={contextoInicial.informacion_paciente.nombre}
        onChange={(e) =>
          setContextoInicial({
            ...contextoInicial,
            informacion_paciente: {
              ...contextoInicial.informacion_paciente,
              nombre: e.target.value,
            },
          })
        }
      />

      <input
        type="number"
        placeholder="Edad del paciente"
        className="w-full p-2 mb-2 border rounded"
        value={contextoInicial.informacion_paciente.edad}
        onChange={(e) =>
          setContextoInicial({
            ...contextoInicial,
            informacion_paciente: {
              ...contextoInicial.informacion_paciente,
              edad: parseInt(e.target.value, 10),
            },
          })
        }
      />

      <input
        type="text"
        placeholder="Diagnóstico previo"
        className="w-full p-2 mb-2 border rounded"
        value={contextoInicial.informacion_paciente.diagnostico_previo}
        onChange={(e) =>
          setContextoInicial({
            ...contextoInicial,
            informacion_paciente: {
              ...contextoInicial.informacion_paciente,
              diagnostico_previo: e.target.value,
            },
          })
        }
      />

      <input
        type="text"
        placeholder="Diagnóstico actual(opcional)"
        className="w-full p-2 mb-2 border rounded"
        value={contextoInicial.informacion_paciente.diagnostico_actual || ""}
        onChange={(e) =>
          setContextoInicial({
            ...contextoInicial,
            informacion_paciente: {
              ...contextoInicial.informacion_paciente,
              diagnostico_actual: e.target.value,
            },
          })
        }
      />


        {npcs?.map((npc, index) => (
          <NPC
            key={index}
            npc={npc}
            onChangeNombre={(nuevoNombre) => handleActualizarNombreNPC(index, nuevoNombre)}
            onEliminarNPC={() => handleEliminarNPC(index)}
            onAgregarPregunta={() => handleAgregarPregunta(index)}
            onEliminarPregunta={(preguntaIdx) => handleEliminarPregunta(index, preguntaIdx)}
            onChangeEnunciadoPregunta={(preguntaIdx, nuevoEnunciado) =>
              handleChangeEnunciadoPregunta(index, preguntaIdx, nuevoEnunciado)
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
            Agregar NPC
          </button>
        </div>

        <h4 className="font-medium mt-4">Información Final del Caso</h4>

        <textarea
          placeholder="Ingrese la información final del caso..."
          className="w-full p-2 mb-2 border rounded h-32"
          value={informacionFinal}
          onChange={(e) => setInformacionFinal(e.target.value)}
        ></textarea>

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
