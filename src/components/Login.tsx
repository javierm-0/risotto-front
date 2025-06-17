import { GoogleLogin } from '@react-oauth/google';
import ucnLogo from '../assets/ucnLogo.png';
import enfLogo from '../assets/logoMedUcn_circular.png';
import { useNavigate } from 'react-router-dom';
import Tostadas from '../utils/Tostadas';
import { ToastContainer } from 'react-toastify';
import { verificarUsuario } from '../api/userAux';
import { jwtDecode } from 'jwt-decode';
function Login() {
  const navigate = useNavigate();

 async function handleGoogleSuccess(credentialResponse: any) {
  try {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      Tostadas.ToastError('No se pudo obtener el id_token de Google.');
      return;
    }
    localStorage.setItem('token', idToken);
    const decoded: any = jwtDecode(idToken);

    if (!decoded.email) {
      Tostadas.ToastError('No se pudo obtener el correo electrónico de Google. Intente con otra cuenta.');
      return;
    }

    const email = decoded.email;
    const domain = email.split('@')[1];
    const dominiosPermitidos = ['alumnos.ucn.cl', 'ucn.cl', 'ce.ucn.cl'];
    if (!dominiosPermitidos.includes(domain)) {
      Tostadas.ToastError('Alerta: Cuenta de correo no autorizada para acceder al sistema.');
      return;
    }
    await verificarUsuario(email, decoded, domain === 'alumnos.ucn.cl' ? 'Estudiante' : 'Docente');
  
    navigate('/inicioEstudiante', { state: { showToast: true } });
  } catch (error) {
    Tostadas.ToastError('Error en login con Google: ' + String(error));
  }
}

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
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => Tostadas.ToastError('Error en login con Google')}
          useOneTap
        />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
