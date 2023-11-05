import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { supabaseClient } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const schema = z
  .object({
    password: z.string().min(1, 'required'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export default function UpdatePasswordPage() {
  const form = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (data) => {
    setLoading(true);

    const { error } = await supabaseClient.auth.updateUser({
      password: data.password,
    });

    setLoading(false);
    if (error) {
      return toast.error(error.message, {
        position: 'top-right',
        hideProgressBar: true,
        theme: 'colored',
      });
    }

    toast.success('Password has been updated', {
      position: 'top-right',
      hideProgressBar: true,
      theme: 'colored',
    });

    return navigate('/', { replace: true });
  };
  return (
    <div className='h-full'>
      <div className='flex flex-col items-center justify-center h-full  p-4 space-y-4 antialiased text-gray-900 bg-gray-100'>
        <div className='w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16'>
          <h1 className=' mb-6 text-3xl font-bold text-center'>
            Update Password
          </h1>
          <p className='text-center mx-12'>
            Boost security now. Enter your new password, and click &apos;Update
            Password&apos; to save.
          </p>
          <div className='space-y-6 w-ful'>
            <div className='space-y-3'>
              <input
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary'
                type='password'
                placeholder='New Password'
                {...form.register('password')}
              />
              <input
                className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary'
                type='password'
                placeholder='Confirm Password'
                {...form.register('confirmPassword')}
              />
            </div>
            <div>
              <button
                className='btn btn-primary w-full'
                disabled={loading}
                onClick={form.handleSubmit(submit)}>
                {loading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  'Update Password'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
