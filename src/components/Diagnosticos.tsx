import { useState, useEffect } from "react";
import DocenteSidebar from "./DocenteSidebar";
import { generatePdfInFrontend } from "../utils/generatePdfInFrontend";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Diagnostic = {
  _id: string;
  user_name: string;
  case_id: {
    _id: string;
    titulo: string;
  };
  case_info: string;
  date: string;
};

const BACKEND_IP = import.meta.env.VITE_BACKEND_IP;

function Diagnosticos() {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);
  const [diagnosticos, setDiagnosticos] = useState<Diagnostic[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const backurl : string = "http://"+BACKEND_IP+":3001/diagnostic";

  useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const res = await fetch(backurl);
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        const data = await res.json();
        setDiagnosticos(data);
      } catch (error) {
        console.error("Error al obtener los diagnósticos:", error);
        setDiagnosticos([]);
      }
    };
    fetchDiagnosticos();
  }, []);

  const handleGenerarPdf = async (diag: Diagnostic) => {
    try {
      const pdfData = {
        case_id: diag.case_id._id,
        case_title: diag.case_id.titulo,
        user_name: diag.user_name,
        case_info: diag.case_info,
        date: diag.date,
      };
      await generatePdfInFrontend(pdfData);
    } catch (err) {
      console.error("Error al generar PDF:", err);
    }
  };

  const handleEliminar = async (id: string) => {
    const confirmar = window.confirm("¿Estás seguro que deseas eliminar este diagnóstico?");
    if (!confirmar) return;

    try {
      const res = await fetch(`${backurl}+"/"+${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("No se pudo eliminar");

      setDiagnosticos((prev) => prev.filter((diag) => diag._id !== id));
      toast.success("✅ Diagnóstico eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar diagnóstico:", error);
      toast.error("❌ Ocurrió un error al eliminar el diagnóstico.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <div className="fixed top-0 left-0 z-40 h-screen">
        <DocenteSidebar onSidebarToggle={setSidebarAbierto} />
      </div>

      <div
        className={`flex-1 p-6 sm:p-8 mt-10 md:mt-0 transition-all duration-300 ${
          sidebarAbierto ? "md:ml-[18rem]" : "md:ml-[4rem]"
        }`}
      >
        <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
          Ver Diagnósticos Finales
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por estudiante o título del caso..."
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {diagnosticos.length === 0 ? (
          <p className="text-gray-600">No hay diagnósticos guardados.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-2 border">Estudiante</th>
                  <th className="p-2 border">Fecha</th>
                  <th className="p-2 border">Título del Caso</th>
                  <th className="p-2 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {diagnosticos
                  .filter((diag) =>
                    `${diag.user_name} ${diag.case_id?.titulo || ""}`
                      .toLowerCase()
                      .includes(busqueda.toLowerCase())
                  )
                  .map((diag, index) => (
                    <tr key={index} className="bg-white hover:bg-gray-50">
                      <td className="p-2 border">{diag.user_name}</td>
                      <td className="p-2 border">
                        {new Date(diag.date).toLocaleDateString()}
                      </td>
                      <td className="p-2 border">
                        {diag.case_id?.titulo || "Sin título"}
                      </td>
                      <td className="p-2 border">
                        <div className="flex justify-between gap-2 w-full">
                          <button
                            onClick={() => handleGenerarPdf(diag)}
                            className="bg-[#164a5f] text-white px-3 py-1 rounded hover:bg-[#123c4a]"
                          >
                            Descargar PDF
                          </button>
                          <button
                            onClick={() => handleEliminar(diag._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default Diagnosticos;
