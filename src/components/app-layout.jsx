import { Outlet } from 'react-router-dom';

export default function AppLayout({ children }) {
  return <div>{children ? children : <Outlet />}</div>;
}
