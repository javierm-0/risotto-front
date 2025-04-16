import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Tostadas from "./Tostadas";
import StudentSidebar from "./StudentSidebar";

function InicioStudent() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      Tostadas.ToastSuccess('Ingreso exitoso!');
    }
  }, [location.state]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-white shadow-md">
        <StudentSidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 sm:p-8 mt-10 md:mt-0">
        <h2 className="text-2xl sm:text-xl font-bold text-[#164a5f] mb-4">
          ¡Bienvenid@ {location.state?.userName} al Sistema de Simulación!
        </h2>
        <p className="text-justify text-base sm:text-sm leading-relaxed">
          Este es un sistema de simulación el cual es una plataforma destinada a facilitar la preparación de los 
          estudiantes de Enfermería de la Universidad Católica del Norte en la atención de pacientes críticos.
          <br /><br />
          Este sistema permite a los estudiantes practicar y mejorar sus habilidades de recopilación de información 
          crítica de los pacientes en un entorno seguro y controlado, lo que les ayuda a adquirir confianza y competencia 
          antes de enfrentarse a situaciones reales en el ámbito de la salud.
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default InicioStudent;
