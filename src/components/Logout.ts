import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

//cierra la sesion del usuario
//limpia la cache y redirige al usuario al login
const Logout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.clear();

    navigate('/');
  }, [navigate]);

  return null;
};

export default Logout;