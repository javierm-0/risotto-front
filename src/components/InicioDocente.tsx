import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Tostadas from "../utils/Tostadas";
import DocenteSidebar from "./DocenteSidebar";

function InicioDocente() {
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
        <DocenteSidebar onSidebarToggle={setSidebarAbierto} />
      </div>
      <div
          className={`flex-1 p-6 sm:p-8 mt-10 md:mt-0 transition-all duration-300 ${
          sidebarAbierto ? 'md:ml-[18rem]' : 'md:ml-[4rem]'
          }`}
      >
        <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
          ¡Bienvenid@ a la interfaz Docente!
        </h2>
        <p className="text-justify text-base sm:text-sm leading-relaxed lg:text-lg text-gray-700 mb-4">
          Esta interfaz permite a los docentes ver y crear casos clinicos para la simulacion de los estudiantes,
          y tambien permitira ver los diagnosticos finales de cada alumno junto con su respectivo archivo PDF.
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}

export default InicioDocente;
