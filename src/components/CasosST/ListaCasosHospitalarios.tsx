import { useEffect, useState } from 'react';
import axios from 'axios';
import { Case } from '../../types/NPCTypes';
import StudentSidebar from '../StudentSidebar';
import { TablaGenerica } from '../../generic/TablaGenerica';
import { useNavigate } from 'react-router-dom';

const ListadoCasosHospitalarios = () => {
  const [casos, setCasos] = useState<Case[]>([]);
  const [cargando, setCargando] = useState(true);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerCasos = async () => {
      try {
        const response = await axios.get('http://localhost:3001/simulation/case');
        const todos = response.data;

        const filtrados = todos
          .filter((caso: any) => caso.tipo_caso === 'Hospitalario')
          .map((caso: any) => ({
            ...caso,
            _id: typeof caso._id === 'object' && '$oid' in caso._id ? caso._id.$oid : caso._id,
          }));

        setCasos(filtrados);
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
      <div className="fixed top-0 left-0 z-40 h-screen">
        <StudentSidebar onSidebarToggle={setSidebarAbierto} />
      </div>
      <div
        className={`flex-1 p-6 sm:p-8 mt-10 md:mt-0 transition-all duration-300 ${
          sidebarAbierto ? 'md:ml-[18rem]' : 'md:ml-[4rem]'
        }`}
      >
        <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
          Casos de tipo Hospitalario
        </h2>

        {/* Escritorio */}
        <div className="hidden sm:block">
          <TablaGenerica<Case>
            data={casos}
            loading={cargando}
            error={error ? 'Error al cargar los casos.' : undefined}
            columns={[
              { header: 'Título del caso', accessor: 'titulo' },
              {
                header: '',
                accessor: 'titulo',
                render: (caso) => (
                  <button
                    onClick={() => navigate(`/simulacion/${caso._id}`)}
                    className="bg-[#164a5f] text-white py-4 px-2 hover:bg-[#164a5fd2] font-bold transition w-full h-full"
                  >
                    Elegir este caso
                  </button>
                ),
              },
            ]}
          />
        </div>

        {/* Móvil */}
        <div className="sm:hidden space-y-4">
          {cargando && <p className="text-gray-600">Cargando casos...</p>}
          {error && <p className="text-red-500">Error al cargar los casos.</p>}
          {casos.map((caso) => (
            <div
              key={caso._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <p className="text-base font-semibold text-gray-800 mb-2">{caso.titulo}</p>
              <button
                onClick={() => navigate(`/simulacion/${caso._id}`)}
                className="w-full bg-[#164a5f] text-white py-2 rounded-md hover:bg-[#143c4f] transition"
              >
                Elegir este caso
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListadoCasosHospitalarios;
