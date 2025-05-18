import { useState } from "react";
import DocenteSidebar from "./DocenteSidebar";

function VerCasos() {
  const [sidebarAbierto, setSidebarAbierto] = useState(true);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar docente */}
      <div className="fixed top-0 left-0 z-40 h-screen">
        <DocenteSidebar onSidebarToggle={setSidebarAbierto} />
      </div>

      {/* Contenido */}
      <div
        className={`flex-1 p-6 sm:p-8 mt-10 md:mt-0 transition-all duration-300 ${
          sidebarAbierto ? "md:ml-[18rem]" : "md:ml-[4rem]"
        }`}
      >
        <h2 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
          Ver casos clínicos
        </h2>

        {/* Aquí puedes insertar una tabla, cards, etc. */}
        <p className="text-gray-600">Aquí se listarán los casos clínicos disponibles.</p>
      </div>
    </div>
  );
}

export default VerCasos;
