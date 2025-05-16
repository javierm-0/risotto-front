import { useState } from "react";
import DocenteSidebar from "../../DocenteSidebar";
import NPC from "./NPC";
import { agregarNPC ,eliminarNPC, actualizarNombre, agregarPregunta, agregarOpcion, eliminarOpcion, eliminarPregunta, actualizarOpcion} from "../../../utils/npcUtils";
import { NPCType } from "../../../types/NPCTypes";


function CrearCasos(){
    const [titulo, setTitulo] = useState("");
    const [contextoInicial, setContextoInicial] = useState("");
    const [npcs, setNpcs] = useState<NPCType[]>([]);

    const handleCrearCaso = () => {
        if (titulo.trim() === "" || contextoInicial.trim() === "" || npcs.length === 0) {
            alert("Por favor, complete todos los campos.");
            return;
        }


        const json = {
            titulo: titulo,
            contextoInicial: contextoInicial,
        }
        console.log("JSON:", json);
    };

    const handleAgregarNPC = () => setNpcs(agregarNPC(npcs));
    const handleActualizarNombreNPC = (i: number, nombre: string) => setNpcs(actualizarNombre(npcs, i, nombre));
    const handleEliminarNPC = (i: number) => setNpcs(eliminarNPC(npcs, i));

    const handleAgregarPregunta = (npcIndex: number) => {
        console.log("handleAgregarPregunta ejecutado");
        setNpcs((prev) => agregarPregunta(prev, npcIndex));
    };

    const handleEliminarPregunta = (npcIndex: number, preguntaIndex: number) => {
        setNpcs((prev) => eliminarPregunta(prev, npcIndex, preguntaIndex));
    };

    const handleAgregarOpcion = (npcIndex: number, preguntaIndex: number) => {
        setNpcs((prev) => agregarOpcion(prev, npcIndex, preguntaIndex));
    };

    const handleEliminarOpcion = (npcIndex: number, preguntaIndex: number, opcionIndex: number) => {
        setNpcs((prev) => eliminarOpcion(prev, npcIndex, preguntaIndex, opcionIndex));
    };


    const handleChangeOpcion = (
        npcIndex: number,
        preguntaIndex: number,
        opcionIndex: number,
        campo: 'enunciado' | 'respuestaDelSistema' | 'esCorrecta',
        valor: string | boolean
        ) => {
        setNpcs((prev) => actualizarOpcion(prev, npcIndex, preguntaIndex, opcionIndex, campo, valor));
        };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <div className="w-full md:w-[21.25%] bg-white shadow-md">
                <DocenteSidebar />
            </div>

            <div className="flex-1 p-6 sm:p-8 mt-10 md:mt-0 md:pr-40">
                <h2 className="text-3xl font-bold text-[#164a5f] mb-4">Crear casos clínicos</h2>

                <input
                    type="text"
                    placeholder="Ingrese el título del caso clínico"
                    value={titulo}
                    className="w-full p-2 text-2xl border border-gray-300 rounded mb-4"
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <textarea
                    rows={10}                
                    placeholder="Ingrese el contexto inicial del caso clínico"
                    value={contextoInicial}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
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
                    onEliminarOpcion={(preguntaIdx, opcionIdx) => handleEliminarOpcion(index, preguntaIdx, opcionIdx)}
                    onChangeOpcion={(preguntaIdx, opcionIdx, campo, valor) =>
                        handleChangeOpcion(index, preguntaIdx, opcionIdx, campo, valor)}
                    />

                ))}


                <button
                    type="button"
                    className="bg-[#164a5f] text-white py-2 px-4 rounded hover:bg-[#0d5c71] mb-4 active:scale-95"
                    onClick={handleAgregarNPC}
                >
                    Agregar NPC
                </button>

                <div className="flex flex-col gap-4 mb-4">
                    <button
                        type="button"
                        className="bg-[#164a5f] text-white py-6 px-4 text-2xl rounded hover:bg-[#0d5c71] active:scale-95"
                        onClick={handleCrearCaso}
                    >
                        Crear caso clínico
                    </button>
                </div>
            </div>
        </div>
    );

}

export default CrearCasos;