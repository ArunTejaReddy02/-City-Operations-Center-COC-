import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import CitizenPortal from './pages/CitizenPortal';

// Import design system and component styles
import './styles/design-system.css';
import './styles/components.css';
import './styles/buttons.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/citizen" element={<CitizenPortal />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
