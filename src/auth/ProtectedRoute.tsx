import { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { User } from '../types/User';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: User['type'][];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const userData = localStorage.getItem('user');
  if (!userData) {
    return <Navigate to="/" replace />;
  }
  try {
    const user: User = JSON.parse(userData);
    if (allowedRoles && !allowedRoles.includes(user.type)) {
      //si el rol del usuario no coincide con el rol permitido de la ruta
      //se redirige a la pagina de inicio
      return <Navigate to="/" replace />;
    }    
  } catch (error) {
    console.error('Error al parsear el usuario:', error);
    return <Navigate to="/" replace />;
  }

  return children;

};

export default ProtectedRoute;
