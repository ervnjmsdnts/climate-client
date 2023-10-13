import { useNavigate } from 'react-router-dom';
import { supabaseClient } from '../lib/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;

    navigate('/auth');
  };

  return (
    <div>
      Dashboard
      <button className='btn btn-primary' onClick={logout}>
        Sign out
      </button>
    </div>
  );
}
