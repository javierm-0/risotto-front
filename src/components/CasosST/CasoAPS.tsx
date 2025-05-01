import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Tostadas from "../../utils/Tostadas";
import StudentSidebar from "../StudentSidebar";



function CasoAPS() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.showToast) {
      Tostadas.ToastSuccess('Ingreso exitoso!');
    }
  }, [location.state]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="w-full md:w-[21.25%] bg-white shadow-md">
        <StudentSidebar />
      </div>

      <div className="flex-1 p-6 sm:p-8 mt-10 md:mt-0">
        <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
          Simulacion de casos APS
        </h2>
        <ToastContainer />
      </div>
    </div>
  );
}

export default CasoAPS;