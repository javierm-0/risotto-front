import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Interprete, { interpretarConContexto } from '../utils/Interprete';
import SimulacionSidebar from './SimulacionSidebar';

interface CasoClinico {
  _id: string;
  titulo: string;
  contexto_inicial: {
    descripcion: string;
    informacion_paciente: Record<string, any>;
  };
  entrega_urgencias: {
    enfermera: {
      informacion_inicial: string;
      informacion_condicional: { pregunta_trigger: string; respuesta: string }[];
    };
  };
  interacciones: any[];
}

function formatearClave(clave: string): string {
  return clave
    .replace(/_/g, ' ')
    .replace(/(?:^|\s)\S/g, (l) => l.toUpperCase());
}

function Simulacion() {
  const { id } = useParams();
  const [caso, setCaso] = useState<CasoClinico | null>(null);
  const [input, setInput] = useState('');
  const [historial, setHistorial] = useState<string[]>([]);
  const [interlocutorActivo, setInterlocutorActivo] = useState<string | null>(null);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/simulation/case/${id}`)
      .then((res) => res.json())
      .then((data) => setCaso(data));
  }, [id]);

  const limpiarTexto = (texto: string) => {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w\s]/g, '');
  };

  const manejarPregunta = () => {
    if (!caso) return;

    const pregunta = input.trim();
    if (pregunta === '') return;
    setHistorial((prev) => [...prev, `👤 Estudiante: ${pregunta}`]);

    let respuesta = null;

    const posiblesRoles = caso.interacciones.map(i => i.rol.toLowerCase());
    const preguntaLimpia = limpiarTexto(pregunta);

    const rolDetectado = posiblesRoles.find(rol =>
      preguntaLimpia.includes(rol)
    );

    if (rolDetectado) {
      const cambio = interpretarConContexto(posiblesRoles, preguntaLimpia, 'comando');
      if (cambio) {
        const nuevoInterlocutor = caso.interacciones.find(i => i.rol.toLowerCase() === cambio.fraseValida)?.rol || null;
        setInterlocutorActivo(nuevoInterlocutor);
        setHistorial(prev => [...prev, `🔄 Cambiado interlocutor a: ${cambio.fraseValida}`]);
        setInput('');
        return;
      }
    }

    const volverAEnfermera = ["volver a la enfermera", "hablar con la enfermera", "consultar a enfermera"];
    if (volverAEnfermera.some(f => preguntaLimpia.includes("enfermera"))) {
      setInterlocutorActivo(null);
      setHistorial(prev => [...prev, '🔄 Has vuelto a hablar con la enfermera.']);
      setInput('');
      return;
    }

    if (!interlocutorActivo) {
      const preguntasValidas = caso.entrega_urgencias.enfermera.informacion_condicional.map(e => e.pregunta_trigger);
      const interpretacion = interpretarConContexto(preguntasValidas, pregunta, 'clinica');
      if (interpretacion) {
        const obj = caso.entrega_urgencias.enfermera.informacion_condicional.find(
          e => e.pregunta_trigger === interpretacion.fraseValida
        );
        if (obj) respuesta = obj.respuesta;
      }
    }

    for (const interaccion of caso.interacciones) {
      if (interlocutorActivo && interaccion.rol.toLowerCase() !== interlocutorActivo.toLowerCase()) {
        continue;
      }

      if (respuesta) break;

      if (interaccion.informacion_condicional) {
        const preguntasCond = interaccion.informacion_condicional.map((e: any) => e.pregunta_trigger).filter(Boolean);
        const interpretacionCond = interpretarConContexto(preguntasCond, pregunta, 'clinica');
        if (interpretacionCond) {
          const cond = interaccion.informacion_condicional.find(
            (e: any) => e.pregunta_trigger === interpretacionCond.fraseValida
          );
          if (cond) respuesta = cond.respuesta;
        }
      }

      if (interaccion.interacciones_posibles) {
        const preguntas = interaccion.interacciones_posibles.map((e: any) => e.pregunta);
        const interpretacionInt = interpretarConContexto(preguntas, pregunta, 'clinica');
        if (interpretacionInt) {
          const obj = interaccion.interacciones_posibles.find(
            (e: any) => e.pregunta === interpretacionInt.fraseValida
          );
          if (obj) respuesta = obj.respuesta;
        }
      }

      if (!respuesta && interaccion.acciones_iniciales?.length > 0) {
        const claves = Object.keys(interaccion.acciones_iniciales[0].informacion_entregada || {});
        const interpretacionInfo = interpretarConContexto(claves, pregunta, 'clinica');
        if (interpretacionInfo) {
          const valor = interaccion.acciones_iniciales[0].informacion_entregada[interpretacionInfo.fraseValida];
          respuesta = `${interpretacionInfo.fraseValida}: ${valor}`;
        }
      }
    }

    setHistorial((prev) => [
      ...prev,
      respuesta ? `🩺 Respuesta: ${respuesta}` : '📝 No se encontró información para esa pregunta.'
    ]);
    setInput('');
  };

  if (!caso) return <div className="text-center mt-10 text-gray-700">Cargando caso clínico...</div>;

  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen">
      <div className="fixed top-0 left-0 z-40 h-screen">
        <SimulacionSidebar onSidebarToggle={setSidebarAbierto} />
      </div>

      <div className={`flex-1 p-6 transition-all duration-300 ${sidebarAbierto ? 'md:ml-[18rem]' : 'md:ml-[4rem]'}`}>
        <h1 className="text-2xl font-bold text-[#164a5f] mb-4">Simulación</h1>

        {interlocutorActivo && (
          <div className="mb-2 text-sm text-blue-700">
            🎤 Hablando con: <span className="font-semibold">{interlocutorActivo}</span>
          </div>
        )}

        <div className="mb-4 p-4 border border-gray-300 rounded-md whitespace-pre-wrap text-sm bg-gray-50">
          <p><strong>📌 Descripción:</strong> {caso.contexto_inicial.descripcion}</p>
          <p className="mt-2"><strong>🧾 Información del paciente:</strong></p>
          <ul className="list-disc list-inside">
            {Object.entries(caso.contexto_inicial.informacion_paciente)
              .filter(([clave]) => clave !== '_id')
              .map(([clave, valor]) => (
                <li key={clave}>
                  <strong>{formatearClave(clave)}:</strong>{' '}
                  {Array.isArray(valor) ? (
                    <ul className="list-disc ml-6">
                      {valor.map((item: string, index: number) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    String(valor)
                  )}
                </li>
              ))}
          </ul>
          <p className="mt-4"><strong>🧍 Figuras presentes en la situación:</strong> {['Enfermera', ...caso.interacciones.map(i => i.rol)].join(', ')}</p>
          <p className="mt-4"><strong>🏥 Información inicial en urgencias:</strong> {caso.entrega_urgencias.enfermera.informacion_inicial}</p>
        </div>

        <div className="mb-8 p-4 border border-gray-300 rounded-md bg-gray-100 h-[300px] overflow-y-auto">
          {historial.map((linea, idx) => (
            <p key={idx} className="text-sm mb-1">{linea}</p>
          ))}
        </div>

        <div className="sticky bottom-6 flex gap-2 z-10 bg-white py-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') manejarPregunta();
            }}
            className="flex-1 p-3 border-2 border-[#164a5f] rounded-md shadow-sm text-sm"
            placeholder="Escribe tu pregunta aquí..."
          />
          <button
            onClick={manejarPregunta}
            className="bg-[#164a5f] text-white px-6 py-3 rounded-md text-sm hover:bg-[#143c4f]"
          >
            Preguntar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Simulacion;
