import { useEffect, useState } from 'react';
import axios from 'axios';
import { Case } from '../../types/NPCTypes';
import StudentSidebar from '../Estudiantes/StudentSidebar';
import { TablaGenerica } from '../../generic/TablaGenerica';
import { useNavigate } from 'react-router-dom';

const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;

const ListaCasosAPS = () => {
  const [casosAPS, setCasosAPS] = useState<Case[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const navigate = useNavigate();
  const backurl : string = "http://"+BACKEND_IP+":3001/simulation/case"
  

  useEffect(() => {
    const obtenerCasos = async () => {
      try {
        const response = await axios.get(backurl, {headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') } });
        const todos = response.data;
        const filtrados = todos
          .filter((caso: any) => caso.tipo_caso === 'APS')
          .map((caso: any) => ({
            ...caso,
            _id: typeof caso._id === 'object' && '$oid' in caso._id ? caso._id.$oid : caso._id,
          }));

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
      {/* Sidebar fija */}
      <div className="fixed top-0 left-0 z-40 h-screen">
        <StudentSidebar onSidebarToggle={setSidebarAbierto} />
      </div>

      {/* Contenido principal */}
      <div
        className={`flex-1 p-6 sm:p-8 mt-10 md:mt-0 transition-all duration-300 ${
          sidebarAbierto ? 'md:ml-[18rem]' : 'md:ml-[4rem]'
        }`}
      >
        <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
          Casos de tipo APS
        </h2>

        {/* Tabla para escritorio */}
        <div className="hidden sm:block">
          <TablaGenerica<Case>
            data={casosAPS}
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
                )
              }
            ]}
          />
        </div>

        {/* Tarjetas para móvil */}
        <div className="sm:hidden space-y-4">
          {cargando && <p className="text-gray-600">Cargando casos...</p>}
          {error && <p className="text-red-500">Error al cargar los casos.</p>}
          {!cargando && !error && casosAPS.length === 0 && (
            <p className="text-gray-600">No hay casos APS disponibles.</p>
          )}
          {casosAPS.map((caso) => (
            <div
              key={caso._id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-200"
            >
              <p className="text-base font-semibold text-gray-800 mb-2">
                {caso.titulo}
              </p>
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

export default ListaCasosAPS;
