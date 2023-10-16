import { Outlet } from 'react-router-dom';
import Navbar from './navbar';

export default function AppLayout({ children }) {
  return (
    <div className='h-full flex flex-col w-full'>
      <Navbar />
      {children ? children : <Outlet />}
    </div>
  );
}
