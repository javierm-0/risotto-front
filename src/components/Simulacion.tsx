import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SimulacionSidebar from "./SimulacionSidebar";
import { Case, OpcionesAsociadas } from "../types/NPCTypes";

type MensajeHistorialTipo =
  | "pregunta"
  | "respuesta"
  | "sistema"
  | "error"
  | "info"
  | "interloc"
  | "npc";

type MensajeHistorial = {
  tipo: MensajeHistorialTipo;
  texto: string;
};

function formatearClave(clave: string): string {
  return clave
    .replace(/_/g, " ")
    .replace(/(?:^|\s)\S/g, (l) => l.toUpperCase());
}

const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;

function Simulacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caso, setCaso] = useState<Case | null>(null);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [npcActivo, setNpcActivo] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [preguntasPendientes, setPreguntasPendientes] = useState<
    { pregunta: string; texto: string; opciones: any[] }[]
  >([]);
  const [preguntaActivaIndex, setPreguntaActivaIndex] = useState<number | null>(null);
  const [inputRespuesta, setInputRespuesta] = useState("");
  const [historialesPorNPC, setHistorialesPorNPC] = useState<
    Record<string, MensajeHistorial[]>
  >({});
  const [mostrarDetalles, setMostrarDetalles] = useState(false);

  const backurl = "http://"+BACKEND_IP+":3001/simulation/case/"

  useEffect(() => {
    fetch(`${backurl}+${id}`)
      .then((res) => res.json())
      .then((data) => setCaso(data));
  }, [id]);

  const todasLasPreguntasRespondidas = (respuestasEvaluar?: Record<string, string>) => {
    if (!caso) return false;
    const resp = respuestasEvaluar ?? respuestas;
    let totalPreguntas = 0;
    let totalRespondidas = 0;
    for (const npc of caso.interacciones) {
      totalPreguntas += npc.preguntas.length;
      totalRespondidas += npc.preguntas.filter((p) => resp[p.pregunta]).length;
    }
    return totalPreguntas > 0 && totalPreguntas === totalRespondidas;
  };

  const iniciarInterlocucion = (nombreNPC: string) => {
    if (!caso) return;
    const npc = caso.interacciones.find(
      (i) => i.nombreNPC.toLowerCase() === nombreNPC.toLowerCase()
    );
    if (!npc) {
      setHistorialesPorNPC((prev) => ({
        ...prev,
        global: [...(prev.global ?? []).filter((m) => m.tipo !== "error"), {
          tipo: "error",
          texto: `No se encontró interlocutor con nombre "${nombreNPC}".`
        }],
      }));
      return;
    }

    setNpcActivo(npc.nombreNPC);
    setPreguntaActivaIndex(null);
    const pendientes = npc.preguntas.filter(
      (p) => !Object.keys(respuestas).includes(p.pregunta)
    );
    setPreguntasPendientes(pendientes);

    setHistorialesPorNPC((prev) => {
      if (prev[npc.nombreNPC] && prev[npc.nombreNPC].length > 0) return prev;
      const preguntasListadas = pendientes.map((p, i) => `${i + 1}. ${p.pregunta}`).join("\n");
      return {
        ...prev,
        [npc.nombreNPC]: [
          { tipo: "npc", texto: `${npc.nombreNPC} relata:` },
          { tipo: "npc", texto: npc.descripcion || "" },
          {
            tipo: "sistema",
            texto: `Elige una pregunta para hacerle escribiendo /pregunta seguido del número.\n${preguntasListadas}`,
          },
        ],
      };
    });

    setHistorialesPorNPC((prev) => ({
      ...prev,
      global: (prev.global ?? []).filter((m) => m.tipo !== "error"),
    }));
  };

  const manejarPregunta = (numPregunta: number) => {
    if (!npcActivo || !caso) return;
    const npc = caso.interacciones.find((i) => i.nombreNPC === npcActivo);
    if (!npc) return;
    if (numPregunta < 1 || numPregunta > preguntasPendientes.length) {
      setHistorialesPorNPC((prev) => ({
        ...prev,
        [npcActivo]: [...(prev[npcActivo] ?? []).filter((m) => m.tipo !== "error"), {
          tipo: "error",
          texto: `Número de pregunta inválido. Debe estar entre 1 y ${preguntasPendientes.length}.`
        }],
      }));
      return;
    }

    const pregunta = preguntasPendientes[numPregunta - 1];
    setPreguntaActivaIndex(numPregunta - 1);
    setHistorialesPorNPC((prev) => ({
      ...prev,
      [npcActivo]: [...(prev[npcActivo] ?? []).filter((m) => m.tipo !== "error"),
        { tipo: "npc", texto: pregunta.pregunta },
        { tipo: "npc", texto: pregunta.texto },
        {
          tipo: "sistema",
          texto: `Selecciona la opción correcta con /responder [número]\n${pregunta.opciones.map((op, i) => `${i + 1}. ${op.texto}`).join("\n")}`
        },
      ]
    }));
  };

  const manejarRespuesta = (numOpcion: number) => {
    if (!npcActivo || !caso || preguntaActivaIndex === null) return;
    const npc = caso.interacciones.find((i) => i.nombreNPC === npcActivo);
    if (!npc) return;
    const pregunta = preguntasPendientes[preguntaActivaIndex];
    if (!pregunta || numOpcion < 1 || numOpcion > pregunta.opciones.length) return;

    const opcionElegida = pregunta.opciones[numOpcion - 1];
    if (respuestas[pregunta.pregunta]) {
      setHistorialesPorNPC((prev) => ({
        ...prev,
        [npcActivo]: [...(prev[npcActivo] ?? []), { tipo: "error", texto: "Esa pregunta ya fue respondida." }],
      }));
      return;
    }

    setRespuestas((prev) => ({ ...prev, [pregunta.pregunta]: opcionElegida.texto }));
    const nuevasPendientes = preguntasPendientes.filter((_, i) => i !== preguntaActivaIndex);
    setPreguntasPendientes(nuevasPendientes);
    setPreguntaActivaIndex(null);

    setHistorialesPorNPC((prev) => {
      const nuevoHistorial = [...(prev[npcActivo] ?? [])];
      nuevoHistorial.push({ tipo: "respuesta", texto: `Respuesta: ${opcionElegida.texto}` });
      if (opcionElegida.OpcionesAsociadas.some((oa: OpcionesAsociadas) => oa.esCorrecta)) {
        nuevoHistorial.push({ tipo: "info", texto: "✅ Opción correcta." });
      } else {
        nuevoHistorial.push({ tipo: "error", texto: "❌ Opción incorrecta." });
      }
      opcionElegida.OpcionesAsociadas.forEach((oa: OpcionesAsociadas, i: number) => {
        nuevoHistorial.push({
          tipo: oa.esCorrecta ? "info" : "error",
          texto: `Consecuencia ${i + 1}: ${oa.consecuencia || "Sin descripción."}`
        });
      });

      if (nuevasPendientes.length > 0) {
        const preguntasListadas = nuevasPendientes.map((p, i) => `${i + 1}. ${p.pregunta}`).join("\n");
        nuevoHistorial.push({ tipo: "sistema", texto: `Puedes hacer otra pregunta:\n${preguntasListadas}` });
      } else {
        nuevoHistorial.push({ tipo: "interloc", texto: "Has respondido todas las preguntas de este interlocutor." });
      }

      if (todasLasPreguntasRespondidas()) {
        nuevoHistorial.push({ tipo: "info", texto: "Has respondido todas las preguntas. Usa /finalizar para terminar." });
      }

      return { ...prev, [npcActivo]: nuevoHistorial };
    });
  };

  const manejarComandoRespuesta = () => {
    if (!caso) return;
    const texto = inputRespuesta.trim();
    if (!texto) return;

    const hablarRegex = /^\/hablar\s+(.+)$/i;
    const preguntaRegex = /^\/pregunta\s+(\d+)$/i;
    const responderRegex = /^\/responder\s*(opcion|opción)?\s*(\d+)$/i;
    const finalizarRegex = /^\/finalizar$/i;

    if (hablarRegex.test(texto)) {
      const match = texto.match(hablarRegex);
      if (!match) return;
      iniciarInterlocucion(match[1].trim());
    } else if (preguntaRegex.test(texto)) {
      const match = texto.match(preguntaRegex);
      if (!match) return;
      manejarPregunta(parseInt(match[1], 10));
    } else if (responderRegex.test(texto)) {
      const match = texto.match(responderRegex);
      if (!match) return;
      manejarRespuesta(parseInt(match[2], 10));
    } else if (finalizarRegex.test(texto)) {
      navigate(`/simulacion/${id}/diagnostico`);
    }
    setInputRespuesta("");
  };

  const historialGlobal = historialesPorNPC.global ?? [];
  const historialNPC = npcActivo ? historialesPorNPC[npcActivo] ?? [] : [];

  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen">
      <div className="fixed top-0 left-0 z-40 h-screen">
        <SimulacionSidebar onSidebarToggle={setSidebarAbierto} />
      </div>

      <div className={`flex-1 flex flex-col px-4 pt-18 sm:pt-0 sm:px-6 sm:py-6 transition-all duration-300 ${sidebarAbierto ? "md:ml-[18rem]" : "md:ml-[4rem]"}`}>
        <h1 className="text-xl sm:text-2xl font-bold text-[#164a5f] mb-4">Simulación</h1>

        <div className="mb-4 border border-gray-300 rounded-md bg-gray-50 text-sm">
          <button onClick={() => setMostrarDetalles(!mostrarDetalles)} className="w-full text-left p-4 font-medium text-[#164a5f] bg-gray-100 border-b border-gray-300">
            Información del Caso {mostrarDetalles ? "▲" : "▼"}
          </button>
          {mostrarDetalles && (
            <div className="p-4">
              <p><strong>📌 Descripción:</strong> {caso?.contexto_inicial?.descripcion}</p>
              <p className="mt-2"><strong>🧾 Información del paciente:</strong></p>
              <ul className="list-disc list-inside">
                {caso && Object.entries(caso.contexto_inicial?.informacion_paciente).filter(([clave]) => clave !== "_id" && clave !== "antecedentes_relevantes").map(([clave, valor]) => (
                  <li key={clave}>
                    <strong>{formatearClave(clave)}:</strong> {Array.isArray(valor) ? <ul className="list-disc ml-6">{valor.map((item, i) => <li key={i}>{item}</li>)}</ul> : String(valor)}
                  </li>
                ))}
              </ul>
              <p className="mt-4"><strong>🧍 Figuras presentes:</strong> {caso?.interacciones.map((i) => i.nombreNPC).join(", ")}</p>
            </div>
          )}
        </div>

        <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-100 text-sm max-h-64 overflow-y-auto font-mono whitespace-pre-wrap">
          {[...historialGlobal, ...historialNPC].length === 0 ? (
            <p className="italic text-gray-500">Escribe <code>/hablar &lt;nombre&gt;</code> para comenzar.</p>
          ) : (
            [...historialNPC, ...historialGlobal].map((msg, idx) => {
              let estilo = "";
              let emoji = "";
              switch (msg.tipo) {
                case "pregunta": estilo = "text-orange-700"; emoji = "❓ "; break;
                case "respuesta": estilo = "text-blue-700"; emoji = "    "; break;
                case "npc": estilo = "text-purple-800 font-semibold"; emoji = "👤 "; break;
                case "sistema": estilo = "text-gray-800"; emoji = "    "; break;
                case "error": estilo = "text-red-600"; emoji = "⚠️ "; break;
                case "info": estilo = msg.texto.includes("/finalizar") ? "text-green-600 font-semibold" : "text-gray-800"; emoji = "    "; break;
                case "interloc": estilo = "text-red-600"; emoji = "🔴 "; break;
              }
              return <p key={idx} className={`${estilo} mb-1`}>{emoji}{msg.texto}</p>;
            })
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <input
            type="text"
            placeholder='Ej: "/hablar hija", luego "/pregunta 1", "/responder 1"'
            className="flex-1 p-3 border border-[#164a5f] rounded-md text-sm"
            value={inputRespuesta}
            onChange={(e) => setInputRespuesta(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && manejarComandoRespuesta()}
            autoFocus
          />
          <button
            className="bg-[#164a5f] text-white px-6 py-3 rounded-md text-sm hover:bg-[#143c4f]"
            onClick={manejarComandoRespuesta}
          >
            Enviar
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-300 rounded text-blue-800 text-sm">
          <p><strong>Instrucciones:</strong></p>
          <p>1. Escribe <code>/hablar nombre</code> para elegir interlocutor.</p>
          <p>2. Usa <code>/pregunta 1</code> para hacer una pregunta.</p>
          <p>3. Responde con <code>/responder 2</code> para elegir una opción.</p>
          <p>Cuando termines, usa <code>/finalizar</code> para ir al diagnóstico.</p>
        </div>
      </div>
    </div>
  );
}

export default Simulacion;