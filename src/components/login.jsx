import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'react-query';
import { supabaseClient } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Enter a valid email').min(1, 'Field is required'),
  password: z.string().min(6, 'Minimum of 6 characters is required'),
});

export default function Login() {
  const form = useForm({ resolver: zodResolver(schema) });
  const navigate = useNavigate();

  const { mutate: login, isLoading } = useMutation(
    async ({ email, password }) => {
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      navigate('/app');
    },
  );

  const submit = async (data) => {
    login({ ...data });
  };

  return (
    <>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Email</span>
        </label>
        <input
          className='input input-bordered w-full max-w-xs'
          {...form.register('email')}
        />
      </div>
      <div className='form-control'>
        <label className='label'>
          <span className='label-text'>Password</span>
        </label>
        <input
          type='password'
          className='input input-bordered w-full max-w-xs'
          {...form.register('password')}
        />
      </div>
      <button
        className='btn btn-primary mt-2'
        disabled={isLoading}
        onClick={form.handleSubmit(submit)}>
        {isLoading ? <Loader2 className='h-4 w-4 animate-spin' /> : 'Submit'}
      </button>
    </>
  );
}
