import { useState } from "react";
import Interprete, { evaluarSimilitud } from "../../utils/Interprete";
import Tostadas from "../../utils/Tostadas";
import { ToastContainer } from "react-toastify";
import StudentSidebar from "../StudentSidebar";
import { TablaGenerica } from "../../generic/TablaGenerica";
//import { StrSimilarityResults } from "../../types/StrSimilarityResult";


function TestearInterprete() {

    const frasesValidas = [
        'preguntar al tens',
        'consultar antecedentes médicos',
        'preguntar a la familia',
      ];
    const [inputUsuario, setInputUsuario] = useState('');
    //const [resultado, setResultado] = useState<StrSimilarityResults | null>();
    
    const handleButtonClick = () => {
        const interpretacion = Interprete(frasesValidas, inputUsuario);
        //setResultado(interpretacion);
      
        if (interpretacion === null) {
          Tostadas.ToastError("No se encontró una coincidencia válida. Intente nuevamente.");
          Tostadas.ToastInfo("Frase ingresada por usuario: " + inputUsuario);
        } else {
          Tostadas.ToastSuccess("Coincidencia encontrada");
          Tostadas.ToastInfo("Frase ingresada: " + interpretacion.fraseInput);
          Tostadas.ToastInfo("Frase válida: " + interpretacion.fraseValida);
          Tostadas.ToastInfo("Confianza: " + interpretacion.similarityRating.toFixed(3));
        }
      };
      

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <div className="w-full md:w-[21.25%] bg-white shadow-md">
                <StudentSidebar />
            </div>
            <div className="flex-1 p-6 sm:p-8 mt-10 md:mt-0 md:pr-40">
                <h1 className="text-3xl sm:text-xl font-bold text-[#164a5f] mb-4">
                Testear Interprete
                </h1>
                <input className="border-2 border-gray-300 p-2" type="text" value={inputUsuario} onChange={(e) => setInputUsuario(e.target.value)} />
                <button className="bg-[#164a5f] px-8 text-white p-2.5 mb-4" onClick={() => {
                handleButtonClick();
                }
                }>Probar</button>

                <TablaGenerica
                    data={evaluarSimilitud(frasesValidas, inputUsuario)}
                    columns={[
                        { header: "Frase ingresada", accessor: "fraseInput" },
                        { header: "Frase válida", accessor: "fraseValida" },
                        { header: "Confianza", accessor: "similarityRating"}
                    ]}
                />

            </div>
            <ToastContainer />
        </div>
    );
}
export default TestearInterprete;