import React from 'react';

interface Opcion {
  texto: string;
  respuestaAsociada: string;
  consecuencia?: string;
}

interface Pregunta {
  texto: string;
  opciones: Opcion[];
}

interface Props {
  pregunta: Pregunta;
  respuestaSeleccionada?: string;
  numeroPregunta?: number;
}

const PreguntaSimulacion: React.FC<Props> = ({ pregunta, numeroPregunta }) => {
  return (
    <div className="p-4 border border-gray-300 rounded-md bg-white shadow-sm">
      <p className="font-semibold mb-2">
        {numeroPregunta ? `${numeroPregunta}. ` : ''}{pregunta.texto}
      </p>

      <div className="mb-2">
        Opciones disponibles:
        <ul className="list-decimal list-inside ml-4">
          {pregunta.opciones.map((opcion, idx) => (
            <li key={idx} className="text-sm">
              {opcion.texto}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default PreguntaSimulacion;
