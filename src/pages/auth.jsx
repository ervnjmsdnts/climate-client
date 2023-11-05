import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth-provider';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { supabaseClient } from '../lib/supabase';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const schema = z.object({
  email: z.string().email('Enter a valid email').min(1, 'Field is required'),
  password: z.string().min(6, 'Minimum of 6 characters is required'),
});

export default function Auth() {
  const { user } = useAuth();

  const form = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation(
    async ({ email, password }) => {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        return toast.error(error.message, {
          position: 'top-right',
          hideProgressBar: true,
          theme: 'colored',
        });
      }

      navigate('/app');
    },
  );

  const submit = async (data) => {
    login({ ...data });
  };

  if (user) return <Navigate to='/app' />;

  return (
    <div className='bg-no-repeat bg-cover bg-center relative'>
      <div className='relative sm:absolute bg-gradient-to-b from-primary to-primary/50 opacity-75 inset-0 z-0'></div>
      <div className='min-h-screen sm:flex sm:flex-row mx-0 justify-center'>
        <div className='flex-col flex  self-center p-10 sm:max-w-5xl xl:max-w-2xl  z-10'>
          <div className='self-start hidden lg:flex flex-col  text-white'>
            <h1 className='mb-3 font-bold text-5xl'>
              Welcome RC Jacobe Pharmacy and Medical Supplies
            </h1>
            <p className='pr-3'>
              Pharmacy is the health profession that has the responsibility for
              ensuring the safe, effective, and rational use of medicines. As
              such it plays a vital part in the delivery of health care
              worldwide. However, there remain wide variations in the practice
              of pharmacy, not only between countries but also within countries.
            </p>
          </div>
        </div>
        <div className='flex justify-center self-center  z-10'>
          <div className='p-12 bg-white mx-auto rounded-2xl w-100 '>
            <div className='mb-4'>
              <h3 className='font-semibold text-2xl text-gray-800'>Sign In </h3>
              <p className='text-gray-500'>Please sign in to your account.</p>
            </div>
            <div className='space-y-5'>
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700 tracking-wide'>
                  Email
                </label>
                <input
                  className=' w-full text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-primary'
                  type='email'
                  {...form.register('email')}
                  placeholder='mail@gmail.com'
                />
              </div>
              <div className='space-y-2'>
                <label className='mb-5 text-sm font-medium text-gray-700 tracking-wide'>
                  Password
                </label>
                <input
                  className='w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-primary'
                  type='password'
                  {...form.register('password')}
                  placeholder='Enter your password'
                />
              </div>
              <div className='flex items-center justify-end'>
                <div className='text-sm'>
                  <Link
                    to='/forgot-password'
                    className='text-primary hover:text-primary/80'>
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <div>
                <button
                  disabled={isLoading}
                  onClick={form.handleSubmit(submit)}
                  className='btn btn-primary w-full'>
                  {isLoading ? (
                    <Loader2 className='h-4 w-4 animate-spin' />
                  ) : (
                    'Submit'
                  )}
                </button>
              </div>
            </div>
            <div className='pt-5 text-center text-gray-400 text-xs'>
              <span>Copyright © 2023 RC Jacobe. All rights reserved</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
