import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { supabaseClient } from '../lib/supabase';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().min(1, 'Field is required').email('Enter valid email'),
});

export default function ForgotPasswordPage() {
  const form = useForm({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);

  const submit = async (data) => {
    setLoading(true);
    const { error } = await supabaseClient.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: 'https://climate-bsu.vercel.app/update-password',
      },
    );

    setLoading(false);
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

  return (
    <div className='h-full'>
      <div className='flex flex-col items-center justify-center h-full  p-4 space-y-4 antialiased text-gray-900 bg-gray-100'>
        <div className='w-full px-8 max-w-lg space-y-6 bg-white rounded-md py-16'>
          <h1 className=' mb-6 text-3xl font-bold text-center'>
            Don&apos;t worry
          </h1>
          <p className='text-center mx-12'>
            We are here to help you to recover your password. Enter the email
            address you used when you joined and we&apos;ll send you
            instructions to reset your password.
          </p>
          <div className='space-y-6 w-ful'>
            <input
              className='w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-primary'
              type='email'
              name='email'
              placeholder='Email address'
              {...form.register('email')}
            />
            <div>
              <button
                className='btn btn-primary w-full'
                disabled={loading}
                onClick={form.handleSubmit(submit)}>
                {loading ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  'Send'
                )}
              </button>
            </div>
          </div>
          <div className='text-sm text-gray-600 items-center flex justify-between'>
            <Link
              to='/'
              className='text-gray-800 cursor-pointer hover:text-blue-500 inline-flex items-center ml-4'>
              <ArrowLeft className='h-4 w-4 mr-3' />
              Back
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
