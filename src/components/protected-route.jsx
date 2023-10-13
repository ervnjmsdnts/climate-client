import { Navigate } from 'react-router-dom';
import { useAuth } from './auth-provider';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to='/auth' />;
  }

  return <>{children}</>;
}
