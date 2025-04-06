import StudentSidebar from "./StudentSidebar";

function Simulacion(){
    return (
        <div className="flex">
            <div>
                <StudentSidebar></StudentSidebar>
            </div>

            <div className="ml-80 mt-12 mr-36 w-[50%]">
                <h2 className="text-3xl font-bold text-[#164a5f] mb-4">Simulación de Caso</h2>
            </div>
        </div>
    );

}

export default Simulacion;