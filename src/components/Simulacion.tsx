import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Interprete from '../utils/Interprete';
import StudentSidebar from './StudentSidebar';

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

function Simulacion() {
  const { id } = useParams();
  const [caso, setCaso] = useState<CasoClinico | null>(null);
  const [input, setInput] = useState('');
  const [historial, setHistorial] = useState<string[]>([]);
  const [interlocutorActivo, setInterlocutorActivo] = useState<string | null>(null);

  if (!id) {
    return (
      <div className="text-center mt-10 text-red-600">
        ❌ Error: No se proporcionó un ID de simulación válido.
      </div>
    );
  }

  useEffect(() => {
    fetch(`http://localhost:3001/simulation/case/${id}`)
      .then((res) => res.json())
      .then((data) => setCaso(data));
  }, [id]);

  const manejarPregunta = () => {
    if (!caso) return;

    const pregunta = input.trim();
    setHistorial((prev) => [...prev, `👤 Estudiante: ${pregunta}`]);

    let respuesta = null;

  
    const nombresRoles = caso.interacciones.map((i) => i.rol.toLowerCase());
    const cambio = Interprete(nombresRoles, pregunta.toLowerCase());
    if (cambio) {
      const nuevoInterlocutor = caso.interacciones.find(i => i.rol.toLowerCase() === cambio.fraseValida)?.rol || null;
      setInterlocutorActivo(nuevoInterlocutor);
      setHistorial(prev => [...prev, `🔄 Cambiado interlocutor a: ${cambio.fraseValida}`]);
      setInput('');
      return;
    }

   
    const frasesParaSalir = ["volver a la enfermera", "terminar conversacion", "salir", "cerrar", "hablar con enfermera"];
    const volver = Interprete(frasesParaSalir, pregunta.toLowerCase());
    if (volver) {
      setInterlocutorActivo(null);
      setHistorial(prev => [...prev, '🔄 Has vuelto a hablar con la enfermera.']);
      setInput('');
      return;
    }

   
    if (!interlocutorActivo) {
      const preguntasValidas = caso.entrega_urgencias.enfermera.informacion_condicional.map(
        (e) => e.pregunta_trigger
      );
      const interpretacion = Interprete(preguntasValidas, pregunta);
      if (interpretacion) {
        const obj = caso.entrega_urgencias.enfermera.informacion_condicional.find(
          (e) => e.pregunta_trigger === interpretacion.fraseValida
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
        const interpretacionCond = Interprete(preguntasCond, pregunta);
        if (interpretacionCond) {
          const cond = interaccion.informacion_condicional.find(
            (e: any) => e.pregunta_trigger === interpretacionCond.fraseValida
          );
          if (cond) respuesta = cond.respuesta;
        }
      }

      if (interaccion.interacciones_posibles) {
        const preguntas = interaccion.interacciones_posibles.map((e: any) => e.pregunta);
        const interpretacionInt = Interprete(preguntas, pregunta);
        if (interpretacionInt) {
          const obj = interaccion.interacciones_posibles.find(
            (e: any) => e.pregunta === interpretacionInt.fraseValida
          );
          if (obj) respuesta = obj.respuesta;
        }
      }

      if (!respuesta && interaccion.acciones_iniciales?.length > 0) {
        const claves = Object.keys(interaccion.acciones_iniciales[0].informacion_entregada || {});
        const interpretacionInfo = Interprete(claves, pregunta);
        if (interpretacionInfo) {
          const valor = interaccion.acciones_iniciales[0].informacion_entregada[interpretacionInfo.fraseValida];
          respuesta = `${interpretacionInfo.fraseValida}: ${valor}`;
        }
      }
    }

    setHistorial((prev) => [
      ...prev,
      respuesta ? `🩺 Respuesta: ${respuesta}` : '🩺 No se encontró información para esa pregunta.'
    ]);
    setInput('');
  };

  if (!caso) {
    return <div className="text-center mt-10 text-gray-700">Cargando caso clínico...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row bg-white min-h-screen">
      <div className="w-full md:w-[21.25%]">
        <StudentSidebar />
      </div>
      <div className="flex-1 p-6">
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
                   <li key={clave}><strong>{clave}:</strong> {JSON.stringify(valor)}</li>
            ))}
          </ul>
          <p className="mt-4"><strong>🏥 Información inicial en urgencias:</strong> {caso.entrega_urgencias.enfermera.informacion_inicial}</p>
        </div>

        <div className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-100 h-[300px] overflow-y-auto">
          {historial.map((linea, idx) => (
            <p key={idx} className="text-sm mb-1">{linea}</p>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-2 border border-gray-400 rounded-md"
            placeholder="Escribe tu pregunta aquí..."
          />
          <button
            onClick={manejarPregunta}
            className="bg-[#164a5f] text-white px-4 py-2 rounded-md"
          >
            Preguntar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Simulacion;
