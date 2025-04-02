import { useNavigate } from "react-router-dom";


function InicioStudent() {
    const navigate = useNavigate();
    const clickLogout = () =>{
        localStorage.removeItem('user');
        navigate('/');
    };

    return(
        <div>
            <p>hola estudiante xd</p>
            <button
                    onClick={clickLogout}
                    className="p-3 px-8 border-none rounded bg-[#00001a] text-white relative top-2 cursor-pointer hover:bg-[#1559a180] active:font-extrabold"
                >
                    Cerrar Sesión
            </button>
        </div>
    )
}


export default InicioStudent;