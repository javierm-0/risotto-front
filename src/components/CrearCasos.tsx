import DocenteSidebar from "./DocenteSidebar";

function CrearCasos(){
    return (
        <div className="flex">
            <div>
                <DocenteSidebar></DocenteSidebar>
            </div>

            <div className="ml-80 mt-12 mr-36 w-[50%]">
                <h2 className="text-3xl font-bold text-[#164a5f] mb-4">Crear casos clínicos</h2>
            </div>
        </div>
    );

}

export default CrearCasos;