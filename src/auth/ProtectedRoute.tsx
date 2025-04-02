import { JSX } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = localStorage.getItem('user');

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default ProtectedRoute;
