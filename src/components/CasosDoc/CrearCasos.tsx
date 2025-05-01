import DocenteSidebar from "../DocenteSidebar";

function CrearCasos(){
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
            <div className="w-full md:w-[21.25%] bg-white shadow-md">
                <DocenteSidebar />
            </div>

            <div className="flex-1 p-6 sm:p-8 mt-10 md:mt-0 md:pr-40">
                <h2 className="text-3xl font-bold text-[#164a5f] mb-4">Crear casos clínicos</h2>
            </div>
        </div>
    );

}

export default CrearCasos;