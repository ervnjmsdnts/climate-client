import { Route } from 'react-router-dom';
import { Routes } from 'react-router-dom';
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './components/auth-provider';
import ProtectedRoute from './components/protected-route';
import AppLayout from './components/app-layout';
import Dashboard from './pages/dashboard';
import Auth from './pages/auth';
import ForgotPasswordPage from './pages/forgot-password';
import UpdatePasswordPage from './pages/update-password';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path='/' element={<Auth />} />
          <Route path='/forgot-password' element={<ForgotPasswordPage />} />
          <Route path='/update-password' element={<UpdatePasswordPage />} />
          <Route
            path='app'
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
