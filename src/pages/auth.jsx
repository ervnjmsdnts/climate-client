import { Link } from 'react-router-dom';
import { useAuth } from '../components/auth-provider';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { user } = useAuth();

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
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups
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
                  type=''
                  placeholder='mail@gmail.com'
                />
              </div>
              <div className='space-y-2'>
                <label className='mb-5 text-sm font-medium text-gray-700 tracking-wide'>
                  Password
                </label>
                <input
                  className='w-full content-center text-base px-4 py-2 border  border-gray-300 rounded-lg focus:outline-none focus:border-primary'
                  type=''
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
                <button type='submit' className='btn btn-primary w-full'>
                  Sign in
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
