import { useGoogleLogin } from '@react-oauth/google';
import ucnLogo from '../assets/ucnLogo.png';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const userInfo = await userInfoResponse.json();
        console.log('Usuario de Google:', userInfo);
  
        const email = userInfo.email;
        const domain = email.split('@')[1];
  
        const dominiosPermitidos = ['alumnos.ucn.cl', 'ucn.cl'];
  
        if (dominiosPermitidos.includes(domain)) {
          console.log('Dominio valido, continuar con login');
          if(domain == "alumnos.ucn.cl"){
            //inicioEstudiante
            navigate('/inicioEstudiante');
          }
          else{
            //inicioDocente
            
          }

        } else {
          console.warn('Dominio no permitido:', domain);
          alert('Alerta: Cuenta de correo no autorizada para acceder al sistema.');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    },
    onError: (error) => {
      console.error('Error en login con Google:', error);
    },
  });
  

  return (
    <div className="min-h-screen bg-[#0d5c71] flex justify-center items-center">
      <div className="max-w-[1280px] mx-auto p-8 text-center">
        <div className="w-[400px] h-[500px] bg-[#164a5f] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-start rounded-2xl">
          <img
            src={ucnLogo}
            className="w-[120px] h-[120px] absolute top-3% translate-y-4 mb-2.5"
            alt="Logo UCN"
          />
          <h1 className="m-0 mb-1 text-[1.625rem] leading-tight relative top-40 font-bold text-[#ffffff]">
            ¡Bienvenid@ al Sistema!
          </h1>
          <p className="w-[350px] text-sm leading-none text-center absolute top-[42%] text-white">
            Inicie sesión para acceder a las funcionalidades del sistema
          </p>

          <form className="flex flex-col items-center relative top-60 w-full">
            <input
              type="text"
              placeholder="Correo"
              required
              className="w-[80%] p-2 my-2 border border-gray-300 bg-[#164e63bb] rounded hover:bg-[#2a7482]"
              autoComplete="off"
            />
            <input
              type="password"
              placeholder="Contraseña"
              required
              autoComplete="off"
              className="w-[80%] p-2 my-2 border border-gray-300 bg-[#164e63bb] rounded hover:bg-[#2a7482]"
            />
            <div className="flex items-center space-x-10 px-10">
              <button
                type="submit"
                className="p-3 px-8 border-none rounded bg-[#00001a] text-white relative top-2 cursor-pointer hover:bg-[#1559a180] active:font-extrabold"
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => loginWithGoogle()}
                className="p-3 px-8 border-none rounded bg-[#db4437] text-white relative top-2 cursor-pointer hover:bg-[#c23321] active:font-extrabold"
              >
                Google
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
