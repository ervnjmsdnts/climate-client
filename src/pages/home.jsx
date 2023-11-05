import { Navigate } from 'react-router-dom';
import { useAuth } from '../components/auth-provider';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to='/app' />;
  return (
    <div>
      <button className='btn btn-primary' onClick={() => navigate('/')}>
        Go to Auth
      </button>
    </div>
  );
}
