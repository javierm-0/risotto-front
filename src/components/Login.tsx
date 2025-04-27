import { useGoogleLogin } from '@react-oauth/google';
import ucnLogo from '../assets/ucnLogo.png';
import { useNavigate } from 'react-router-dom';
import Tostadas from './Tostadas';
import { ToastContainer } from 'react-toastify';

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
        const email: string = userInfo.email;
        const domain: string = email.split('@')[1];
        const dominiosPermitidos = ['alumnos.ucn.cl', 'ucn.cl', 'ce.ucn.cl'];

        if (dominiosPermitidos.includes(domain)) {
          localStorage.setItem('user', JSON.stringify(userInfo));

          if (domain === "alumnos.ucn.cl") {
            navigate('/inicioEstudiante', { state: { showToast: true, userName: userInfo.name } });
          } else {
            navigate('/inicioDocente');
            Tostadas.ToastSuccess('Bienvenido Docente: ' + userInfo.name);
            console.log('Bienvenido Docente: ' + userInfo.name);
          }
        } else {
          console.warn('Dominio no permitido:', domain);
          Tostadas.ToastError('Alerta: Cuenta de correo no autorizada para acceder al sistema.');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      }
    },
    onError: (error) => {
      console.error('Error en login con Google:', error);
      Tostadas.ToastError('Error en login con Google:' + error);
    },
  });

  return (
    <div className="min-h-screen bg-[#0d5c71] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#164a5f] rounded-2xl p-6 flex flex-col items-center">
        <img
          src={ucnLogo}
          className="w-24 h-24 mb-6"
          alt="Logo UCN"
        />
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
