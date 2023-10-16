import { User } from 'lucide-react';
import { supabaseClient } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;

    navigate('/auth');
  };
  return (
    <div className='navbar px-8 border-b bg-base-100'>
      <div className='flex-1'>
        <p className='text-xl'>Name</p>
      </div>
      <div className='flex-none'>
        <div className='dropdown dropdown-end'>
          <label tabIndex={0} className='btn btn-ghost btn-circle avatar'>
            <User />
          </label>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
