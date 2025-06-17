import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SimulacionSidebar from "./SimulacionSidebar";
import { jwtDecode } from "jwt-decode";
import Tostadas from "../utils/Tostadas";
import { ToastContainer } from "react-toastify";

const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;


  const DiagnosticoFinal = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sidebarAbierto, setSidebarAbierto] = useState(true);
    const [diagnostico, setDiagnostico] = useState("");
    const [nombreEstudiante, setNombreEstudiante] = useState("");
    const backurl:string = "http://"+BACKEND_IP+":3001/diagnostic/create"

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          setNombreEstudiante(decoded.name || "Estudiante anónimo");
        } catch (e) {
          console.error("No se pudo decodificar el token:", e);
        }
      }
    }, []);

    const handleGuardarDiagnostico = async () => {
      const jsonDiagnostico = {
        case_id: id,
        user_name: nombreEstudiante.trim(),
        case_info: diagnostico,
        date: new Date().toISOString()
      };

      try {
        const res = await fetch(backurl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonDiagnostico),
        });

        if (!res.ok) throw new Error("Error al guardar diagnóstico");

        Tostadas.ToastSuccess("✅ Diagnóstico final guardado exitosamente.");
        navigate("/inicioEstudiante", { state: { showToast: true } });
      } catch (error) {
        console.error("Error al guardar el diagnóstico:", error);
        Tostadas.ToastError("Hubo un problema al guardar el diagnóstico");
      }
    };


  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 z-40 h-screen">
        <SimulacionSidebar onSidebarToggle={setSidebarAbierto} modoDiagnosticoFinal navigateBack={() => navigate(`/simulacion/${id}`)} />
      </div>

      <div
        className={`flex-1 p-6 sm:p-8 mt-10 md:mt-0 transition-all duration-300 ${
          sidebarAbierto ? "md:ml-[18rem]" : "md:ml-[4rem]"
        }`}
      >
        <h2 className="text-3xl font-bold text-[#164a5f] mb-6">
          Diagnóstico Final
        </h2>

        <textarea
          rows={10}
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-4 text-sm resize-none"
          placeholder="Escribe aquí tu diagnóstico final con tus propias palabras"
        />

        <button
          onClick={handleGuardarDiagnostico}
          className="mt-4 bg-[#164a5f] text-white px-6 py-3 rounded-md text-sm hover:bg-[#143c4f]"
        >
          Listo
        </button>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
};

export default DiagnosticoFinal;
