import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import SimulacionSidebar from "./SimulacionSidebar";
import ucnLogo from '../assets/Escudo-UCN-Full-Color.png';
import medicinaLogo from "../assets/logoMedUcn_circular.png";
import { generatePdfInFrontend } from "../utils/generatePdfInFrontend";


const DiagnosticoFinal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [diagnostico, setDiagnostico] = useState("");
  const [nombreEstudiante, setNombreEstudiante] = useState("");
  const [errorNombre, setErrorNombre] = useState(false);

  const handleGenerarPdf = async () => {

    if (!nombreEstudiante.trim()) {
      setErrorNombre(true);
      return;
    }

    const pdfData = {
      case_id: id || "CASO_XYZ",
      user_name: nombreEstudiante || "Estudiante anónimo",
      case_info: diagnostico,
      date: new Date().toISOString(),
      logos: {
        ucn: ucnLogo,
        medicina: medicinaLogo
      }
    };

    try {
      await generatePdfInFrontend(pdfData);
      alert("✅ Diagnóstico final generado correctamente en PDF.");
      navigate("/inicioEstudiante");
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      alert("Hubo un problema al generar el PDF");
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

        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del estudiante <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          value={nombreEstudiante}
          onChange={(e) => {
            setNombreEstudiante(e.target.value);
            setErrorNombre(false);
        }}
          className={`w-full border ${
            errorNombre ? "border-red-500" : "border-gray-300"
        }   rounded-md p-3 mb-1 text-sm`}
        />
        {errorNombre && (
        <p className="text-red-500 text-sm mb-4">Este campo es obligatorio.</p>
        )}


        <textarea
          rows={10}
          value={diagnostico}
          onChange={(e) => setDiagnostico(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-4 text-sm resize-none"
          placeholder="Escribe aquí tu diagnóstico final con tus propias palabras"
        />

        <button
          onClick={handleGenerarPdf}
          className="mt-4 bg-[#164a5f] text-white px-6 py-3 rounded-md text-sm hover:bg-[#143c4f]"
        >
          Listo
        </button>
      </div>
    </div>
  );
};

export default DiagnosticoFinal;
