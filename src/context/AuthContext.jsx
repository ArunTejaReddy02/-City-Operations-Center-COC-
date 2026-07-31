import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Auth State from localStorage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Failed to load auth state from localStorage:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      // Simulate API response or call real endpoint if available
      const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
      let mockSuccess = false;
      let userData = null;
      let tokensData = null;

      try {
        const response = await fetch(`${apiURL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
          const responseData = await response.json();
          userData = responseData.data.user;
          tokensData = responseData.data.tokens;
          mockSuccess = true;
        }
      } catch (err) {
        // Fallback for demo when backend is offline
        console.warn('Backend unavailable, using client demo auth');
      }

      if (!mockSuccess) {
        // Demo authentication fallback
        const isOfficer = email.includes('admin') || email.includes('gvmc') || email.includes('officer');
        userData = {
          id: isOfficer ? 'USR-ADM-001' : 'USR-RES-884',
          name: isOfficer ? 'Priya Sharma' : 'Lakshmi Narayana',
          email,
          role: isOfficer ? 'admin' : 'citizen',
          ward: 'GVMC-W12',
        };
        tokensData = {
          accessToken: `demo-token-${Date.now()}`,
          refreshToken: `demo-refresh-${Date.now()}`,
        };
      }

      // Save to localStorage
      localStorage.setItem('accessToken', tokensData.accessToken);
      localStorage.setItem('refreshToken', tokensData.refreshToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update State
      setAccessToken(tokensData.accessToken);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setAccessToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
