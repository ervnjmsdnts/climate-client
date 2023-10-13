import { useState } from 'react';
import Login from '../components/login';
import SignUp from '../components/sign-up';
import { useAuth } from '../components/auth-provider';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (user) return <Navigate to='/app' />;

  return (
    <>
      <button
        onClick={() => setIsLogin((prev) => !prev)}
        className='btn btn-primary'>
        {isLogin ? 'Log in' : 'Sign up'}
      </button>
      {isLogin ? <Login /> : <SignUp action={() => setIsLogin(true)} />}
    </>
  );
}
