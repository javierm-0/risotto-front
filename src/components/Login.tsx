import { useGoogleLogin } from '@react-oauth/google';
import ucnLogo from '../assets/ucnLogo.png';
import enfLogo from '../assets/logoMedUcn_circular.png';
import { useNavigate } from 'react-router-dom';
import Tostadas from '../utils/Tostadas';
import { ToastContainer } from 'react-toastify';
import { verificarUsuario } from '../api/userAux';

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

        const userInfoFromGoogle = await userInfoResponse.json();
        const email: string = userInfoFromGoogle.email;
        const domain: string = email.split('@')[1];
        const dominiosPermitidos = ['alumnos.ucn.cl', 'ucn.cl', 'ce.ucn.cl'];

        if (dominiosPermitidos.includes(domain)) {
          if (domain === "alumnos.ucn.cl") {
            await handleNavigateRes(email, userInfoFromGoogle, "Estudiante");
          } else {
            await handleNavigateRes(email, userInfoFromGoogle, "Docente");
          }
        } else {
          console.warn('Dominio no permitido:', domain);
          Tostadas.ToastError('Alerta: Cuenta de correo no autorizada para acceder al sistema.');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }

      async function handleNavigateRes(email : string, userInfoFromGoogle : any, tipo: "Estudiante" | "Docente") {
        const usuarioVerificado = await verificarUsuario(email, userInfoFromGoogle, tipo);
        if (!usuarioVerificado) return;

        if (tipo === "Estudiante") {
          navigate('/inicioEstudiante', { state: { showToast: true } });
        } else if (tipo === "Docente") {
          navigate('/inicioDocente', { state: { showToast: true } });
        }
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
      Tostadas.ToastError('Error en login con Google:' + String(error));
    },
  });

  
  return (
    <div className="min-h-screen bg-[#0d5c71] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#164a5f] rounded-2xl p-6 flex flex-col items-center shadow-lg">
        <div className="flex items-center justify-center gap-6 mb-6">
          <div className="w-36 h-36 bg-white rounded-full flex items-center justify-center">
            <img
              src={enfLogo}
              className="max-w-full max-h-full object-contain"
              alt="Logo ENF"
            />
          </div>
          <div className="w-38 h-38 rounded-full p-2 flex items-center justify-center">
            <img
              src={ucnLogo}
              className="max-w-full max-h-full object-contain"
              alt="Logo UCN"
            />
          </div>
        </div>
  
        <h1 className="text-2xl sm:text-xl font-bold text-white mb-4 text-center">
          ¡Bienvenid@ al Sistema!
        </h1>
        <p className="text-white text-sm sm:text-xs text-center mb-8">
          Inicie sesión para acceder al sistema de simulación de casos clínicos.
        </p>
        <button
          type="button"
          onClick={() => loginWithGoogle()}
          className="py-3 px-6 sm:px-4 text-xl sm:text-lg bg-[#db4437] text-white rounded hover:bg-[#c23321] active:font-bold transition"
        >
          Iniciar con Google
        </button>
      </div>
      <ToastContainer />
    </div>
  );
  
  
}

export default Login;
