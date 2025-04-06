import { useGoogleLogin } from '@react-oauth/google';
import ucnLogo from '../assets/ucnLogo.png';
import { useNavigate } from 'react-router-dom';
import Tostadas from './Tostadas';
import { ToastContainer } from 'react-toastify';


//import { useState } from 'react';
//import axios from 'axios'; de momento no se usara
//import { jwtDecode } from "jwt-decode"; temporalmente dejado

function Login() {
  //const [email ,setEmail] = useState('');
  //const [password ,setPassword] = useState('');


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
        const email : string = userInfo.email;
        const domain : string = email.split('@')[1];
        const dominiosPermitidos = ['alumnos.ucn.cl', 'ucn.cl' , 'ce.ucn.cl'];
  
        if (dominiosPermitidos.includes(domain))
          {
          localStorage.setItem('user', JSON.stringify(userInfo));

          if(domain == "alumnos.ucn.cl")
            {
            //inicioEstudiante
            navigate('/inicioEstudiante', { state: { showToast: true, userName: userInfo.name } });
            }
          else
            {
            //inicioDocente
            navigate('/inicioDocente');
            Tostadas.ToastSuccess('Bienvenido Docente: ' + userInfo.name);
            console.log('Bienvenido Docente: ' + userInfo.name);
            }
          }
        else 
          {
          console.warn('Dominio no permitido:', domain);
          Tostadas.ToastError('Alerta: Cuenta de correo no autorizada para acceder al sistema.');
          }
      } catch (error)
        {
        console.error('Error al obtener datos del usuario:', error);
        }
    },
    onError: (error) => {
      console.error('Error en login con Google:', error);
      Tostadas.ToastError('Error en login con Google:' + error);
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
            Inicie sesión para acceder a las funcionalidades del sistema de simulación
          </p>

              <div className='flex items-center space-x-10 px-10 relative top-68'>
                <button
                  type="button"
                  onClick={() => loginWithGoogle()}
                  className="py-6 px-12 text-3xl border-none rounded bg-[#db4437] text-white relative top-2 cursor-pointer hover:bg-[#c23321] active:font-extrabold"
                >
                  Google
                </button>
              </div>
          
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </div>
  );
}

export default Login;
