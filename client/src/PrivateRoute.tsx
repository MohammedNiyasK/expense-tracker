import { useAppSelector } from './hooks/hooks';
import { Navigate, useLocation } from 'react-router-dom';
import { ReactNode } from 'react';

const PrivateRoute = ({ children }: { children: ReactNode }) => {
  const token = useAppSelector((state) => state.auth.accessToken);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/signin" state={{ path: location.pathname }} />;
  }

  return children;
};

export default PrivateRoute;
