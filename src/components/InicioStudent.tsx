import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Tostadas from "./Tostadas";
import StudentSidebar from "./StudentSidebar";


function InicioStudent() {
    const location = useLocation()
    useEffect(() => {
        if(location.state?.showToast) {
            Tostadas.ToastSuccess('Ingreso exitoso!');
        }
    }, [location.state]);

    return(
        <div className="flex">
            <div>
                <StudentSidebar></StudentSidebar>
            </div>

            <div className='ml-80 mt-12 mr-36 w-[50%]'>
                <h2 className="text-2xl font-bold text-[#164a5f]">¡Bienvenid@ {location.state?.userName} al Sistema de Simulación!</h2>
                <p className="mt-6 text-justify">
                Este es un sistema de simulación el cual es una plataforma destinada a facilitar la preparación de los 
                estudiantes de Enfermería de la Universidad Cátolica del Norte 
                en la atención de pacientes críticos.
                Este sistema permite a los estudiantes practicar y mejorar sus habilidades 
                de recopilación de información crítica de los pacientes en un entorno seguro y controlado, 
                lo que les ayuda a adquirir confianza y competencia antes de enfrentarse a situaciones reales en el ámbito de la salud.
                </p>
        </div>
            <ToastContainer></ToastContainer>
        </div>

    )
}


export default InicioStudent;