import { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Tostadas from "../utils/Tostadas";
import StudentSidebar from "./StudentSidebar";

function InicioStudent() {
  const location = useLocation();
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  useEffect(() => {
    if (location.state?.showToast) {
      Tostadas.ToastSuccess('Ingreso exitoso!');
    }
  }, [location.state]);

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


        <h1 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
          ¡Bienvenid@ al Sistema de Simulación!
        </h1>
        <div className="text-justify text-base sm:text-sm leading-relaxed lg:text-lg text-gray-700 mb-4">
          <p>
            Este sistema es una plataforma diseñada para apoyar la preparación de los estudiantes de Enfermería de la 
            Universidad Católica del Norte en la atención de pacientes, a través de experiencias simuladas que fortalecen 
            sus competencias clínicas.
          </p>
          <p className="mt-4 mb-4">
            Es el resultado de una colaboración entre la carrera de Enfermería y la carrera de 
            Ingeniería Civil en Informática de la Universidad Católica del Norte, 
            una alianza que busca integrar la tecnología con la formación en salud para 
            enriquecer el proceso de enseñanza-aprendizaje.
          </p>
        </div>
        <h2 className="text-lg sm:text-base font-bold text-[#164a5f] mb-2">
          Resultados de aprendizaje
        </h2>
        <p>
          A través de esta plataforma, se espera que el estudiante demuestre habilidades de comunicación efectiva, 
          trabajo colaborativo y toma de decisiones en contextos clínicos simulados, 
          contribuyendo al desarrollo de una atención segura y centrada en el paciente.
        </p>
        <ToastContainer />
        </div>
      </div>
  );
}

export default InicioStudent;
