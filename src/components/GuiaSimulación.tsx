import { useState } from "react";
import StudentSidebar from "./StudentSidebar";



const pasosRaw = [
  `Para iniciar la simulación, elige en la barra lateral el tipo de caso clínico que deseas jugar. Al ingresar, se te entregará información inicial del paciente.`,

  `Durante la simulación, verás instrucciones sobre los comandos que puedes usar:\n\n- Para hablar con alguien: /hablar (nombre)\n- Para hacer una pregunta: /pregunta N°\n- Para responder: /opcion N°\n\nAlgunas respuestas pueden mostrar consecuencias según tu elección.`,

  `En todo momento puedes cambiar de interlocutor. Verás un indicador cuando hayas completado todas las interacciones con una figura.`,

  `La idea principal es que interactúes con todas las figuras para recopilar la mayor cantidad de información del caso.`,

  `Finalmente, usa el comando /finalizar \n\nEsto te llevará a una pantalla para responder al caso, cuando hayas terminado.`
];

function formatearTexto(texto: string):any {
  const regex = /(\/[a-zA-Z]+(?:\s[^\s]*)?)/g;
  const partes = texto.split(regex);

  return partes.map((parte, idx) =>
    regex.test(parte) ? (
      <code
        key={idx}
        className="bg-blue-100 text-blue-800 font-mono px-2 py-0.5 rounded text-xs inline-block mx-1"
      >
        {parte}
      </code>
    ) : (
      <span key={idx}>{parte}</span>
    )
  );
}



const renderLinea = (linea: string, index: number) => {
  const trimmed = linea.trim();
  const isBullet = trimmed.startsWith("- ");
  if (isBullet) {
    return (
      <li
        key={index}
        className="pl-2 relative text-sm text-gray-800 before:content-['●'] before:absolute before:-left-4 before:text-blue-500"
      >
        {formatearTexto(trimmed.slice(2))}
      </li>
    );
  } else {
    return (
      <p key={index} className="text-sm text-gray-800">
        {formatearTexto(linea)}
      </p>
    );
  }
};

// ...existing code...
const GuiaSimulacion = () => {
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  return (
    <div className="relative">
      {/* Botón para abrir/cerrar sidebar en móviles */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#164a5f] text-white p-2 rounded shadow"
        onClick={() => setSidebarAbierto(!sidebarAbierto)}
        aria-label="Abrir menú"
      >
        {sidebarAbierto ? "✕" : "☰"}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 z-40 h-screen w-[250px] bg-white transition-transform duration-300
          ${sidebarAbierto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block
        `}
      >
        <StudentSidebar onSidebarToggle={setSidebarAbierto} />
      </div>

      {/* Contenido principal */}
      <div
        className={`
          p-4 md:p-6 transition-all duration-300
          md:ml-[250px]
        `}
      >
        <h2 className="text-2xl font-bold text-[#164a5f] mb-6">Guía para usar la simulación</h2>
        <div className="space-y-4">
          {pasosRaw.map((paso, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#164a5f] text-white flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div className="space-y-2">
                {paso.split("\n").some(line => line.trim().startsWith("- ")) ? (
                  <ul className="list-none pl-6 space-y-1">
                    {paso.split("\n").map((line, idx) => renderLinea(line, idx))}
                  </ul>
                ) : (
                  paso.split("\n").map((line, idx) => renderLinea(line, idx))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
// ...existing code...

export default GuiaSimulacion;
