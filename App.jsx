import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import LoadingScreen from './components/LoadingScreen.jsx';
import LoginPage from './components/LoginPage.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import ClienteLayout from './components/cliente/ClienteLayout.jsx';

function AppShell() {
  const { usuario, loading, dbError } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (dbError) {
    return <LoadingScreen error />;
  }

  if (!usuario) {
    return <LoginPage />;
  }

  return usuario.tipo === 'admin' ? <AdminLayout /> : <ClienteLayout />;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppShell />
      </AuthProvider>
    </ThemeProvider>
  );
}
