import { useEffect, useState } from 'react';
import axios from 'axios';
import { Case } from '../../types/Case';
import StudentSidebar from '../StudentSidebar';
import { TablaGenerica } from '../../generic/TablaGenerica';

const ListadoCasosHospitalarios = () => {
  const [casosAPS, setCasosAPS] = useState<Case[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const obtenerCasos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/simulation/case');
        const todos = response.data;
        const filtrados = todos.filter((caso :any) => caso.tipo_caso === 'Hospitalario');
        setCasosAPS(filtrados);
      } catch (err) {
        console.error('Error al obtener los casos:', err);
        setError(true);
      } finally {
        setCargando(false);
      }
    };

    obtenerCasos();
  }, []);
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        <div className="w-full md:w-[21.25%] bg-white shadow-md">
            <StudentSidebar />
        </div>
        <div className="flex-1 p-6 sm:p-8 mt-10 md:mt-0">
            <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
                Casos de tipo Hospitalario
            </h2>
            <TablaGenerica<Case>
                data={casosAPS}
                loading={cargando}
                error={error ? "Error al cargar los casos." : undefined}
                columns={[
                    { header: "Título del caso", accessor: "titulo" },
                    {
                    header: "",
                    accessor: "titulo",
                    render: (caso) => (
                        <button
                        onClick={() => console.log(`llevar al caso: ${caso.titulo}`)}
                        className="bg-[#164a5f] text-white py-4 px-2 hover:bg-[#164a5fd2] font-bold transition w-full h-full"
                        >
                        Elegir este caso
                        </button>
                    ),
                    },
                ]}
            />
        </div>
    </div>
  );
};

export default ListadoCasosHospitalarios;
