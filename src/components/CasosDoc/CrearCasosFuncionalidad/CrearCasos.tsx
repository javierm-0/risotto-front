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

function CrearCasos() {
  const [titulo, setTitulo] = useState("");
  const [contextoInicial, setContextoInicial] = useState("");
  const [npcs, setNpcs] = useState<NPCType[]>([]);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  const handleCrearCaso = () => {
    if (titulo.trim() === "" || contextoInicial.trim() === "" || npcs.length === 0) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    const json = {
      titulo,
      contextoInicial,
    };
    console.log("JSON:", json);
  };

  const handleAgregarNPC = () => setNpcs(agregarNPC(npcs));
  const handleActualizarNombreNPC = (i: number, nombre: string) => setNpcs(actualizarNombre(npcs, i, nombre));
  const handleEliminarNPC = (i: number) => setNpcs(eliminarNPC(npcs, i));
  const handleAgregarPregunta = (npcIndex: number) => setNpcs((prev) => agregarPregunta(prev, npcIndex));
  const handleEliminarPregunta = (npcIndex: number, preguntaIndex: number) =>
    setNpcs((prev) => eliminarPregunta(prev, npcIndex, preguntaIndex));
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

        <textarea
          rows={6}
          placeholder="Ingrese el contexto inicial del caso clínico"
          value={contextoInicial}
          className="w-full p-3 border border-gray-300 rounded mb-6"
          onChange={(e) => setContextoInicial(e.target.value)}
        />

        {npcs?.map((npc, index) => (
          <NPC
            key={index}
            npc={npc}
            onChangeNombre={(nuevoNombre) => handleActualizarNombreNPC(index, nuevoNombre)}
            onEliminarNPC={() => handleEliminarNPC(index)}
            onAgregarPregunta={() => handleAgregarPregunta(index)}
            onEliminarPregunta={(preguntaIdx) => handleEliminarPregunta(index, preguntaIdx)}
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

        <button
          type="button"
          className="bg-[#164a5f] text-white py-4 px-4 text-lg rounded hover:bg-[#0d5c71] active:scale-95 w-full sm:w-auto"
          onClick={handleCrearCaso}
        >
          Crear caso clínico
        </button>
      </div>
    </div>
  );
}

export default CrearCasos;
