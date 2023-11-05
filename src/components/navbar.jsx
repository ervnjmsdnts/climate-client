import { User } from 'lucide-react';
import { supabaseClient } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth-provider';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  name: z.string().min(1, 'Field is required'),
});

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: user.user_metadata.name, email: user.email },
  });

  const logout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;

    navigate('/');
  };

  const updatePassword = async () => {
    setPasswordLoading(true);
    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      user.email,
      {
        redirectTo: 'https://climate-bsu.vercel.app/update-password',
      },
    );

    setPasswordLoading(false);
    if (error) {
      return toast.error(error.message, {
        position: 'top-right',
        hideProgressBar: true,
        theme: 'colored',
      });
    }

    return toast.success('An email has been sent to you', {
      position: 'top-right',
      hideProgressBar: true,
      theme: 'colored',
    });
  };

  const updateName = async (data) => {
    setNameLoading(true);
    const { error } = await supabaseClient.auth.updateUser({
      data: { name: data.name },
    });
    if (error) throw error;
    setNameLoading(false);

    return toast.success('Successfully updated name', {
      position: 'top-right',
      hideProgressBar: true,
      theme: 'colored',
    });
  };

  return (
    <>
      <dialog id='my_modal_1' className='modal'>
        <div className='modal-box'>
          <div className='flex w-full items-center justify-between'>
            <h3 className='font-bold text-lg'>Profile</h3>
            <form method='dialog'>
              <button className='btn btn-circle btn-sm'>
                <X />
              </button>
            </form>
          </div>
          <div className='modal-action'>
            <div className='flex flex-col w-full'>
              <h3 className='text-lg font-semibold'>Details</h3>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Name</span>
                </label>
                <input
                  className='input input-bordered w-full'
                  disabled={nameLoading}
                  {...form.register('name')}
                />
              </div>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input
                  className='input input-bordered w-full'
                  disabled
                  {...form.register('email')}
                />
              </div>
              <div className='flex justify-end mt-4 items-center gap-2'>
                <button
                  className='btn btn-primary btn-sm'
                  disabled={passwordLoading}
                  onClick={updatePassword}>
                  {passwordLoading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    'Update Password'
                  )}
                </button>
                <button
                  className='btn btn-primary btn-sm'
                  disabled={nameLoading}
                  onClick={form.handleSubmit(updateName)}>
                  {nameLoading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    'Save'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </dialog>
      <div className='navbar px-8 border-b bg-base-100'>
        <div className='flex-1'>
          <p className='text-xl'>RC Jacobe</p>
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
                <button
                  onClick={() =>
                    document.getElementById('my_modal_1').showModal()
                  }>
                  Profile
                </button>
              </li>
              <li>
                <button onClick={logout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
