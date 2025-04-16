import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Tostadas from "./Tostadas";
import DocenteSidebar from "./DocenteSidebar";

function InicioDocente() {
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
        <DocenteSidebar />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 p-6 sm:p-8 mt-10 md:mt-0">
        <h2 className="text-2xl sm:text-xl font-bold text-[#164a5f] mb-4">
          ¡Bienvenid@ {location.state?.userName} a la interfaz Docente!
        </h2>
        <p className="text-justify text-base sm:text-sm leading-relaxed">
          Esta interfaz permite a los docentes ver y crear casos clinicos para la simulacion de los estudiantes,
          y tambien permitira ver los diagnosticos finales de cada alumno junto con su respectivo archivo PDF.

        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default InicioDocente;
