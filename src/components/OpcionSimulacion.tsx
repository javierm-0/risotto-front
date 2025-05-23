interface OpcionSimulacionProps {
  opcion: {
    texto: string;
    respuestaAsociada: string;
    esCorrecta: boolean;
    consecuencia: string;
  };
  seleccionada: boolean;
  deshabilitada: boolean;
  onClick: () => void;
}

const OpcionSimulacion: React.FC<OpcionSimulacionProps> = ({
  opcion,
  seleccionada,
  deshabilitada,
  onClick,
}) => {
  const color = seleccionada
    ? opcion.esCorrecta
      ? 'border-green-600 bg-green-100'
      : 'border-red-600 bg-red-100'
    : 'border-gray-300 bg-white';

  return (
    <button
      className={`block w-full text-left px-4 py-2 border rounded-md text-sm ${color} hover:bg-blue-50`}
      onClick={onClick}
      disabled={deshabilitada}
    >
      {opcion.texto}
    </button>
  );
};

export default OpcionSimulacion;
