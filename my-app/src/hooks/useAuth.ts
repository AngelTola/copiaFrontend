// hooks/useAuth.ts (simplificado sin JWT)
import { useState, useEffect } from 'react';

interface User {
  id: string;
  nombre: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // En un caso real, aquí harías una petición al backend
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) throw new Error('Error de autenticación');

      const userData = await response.json();
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Error al iniciar sesión:', error.message);
      }
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

   // Para fines de prueba, podrías necesitar un usuario mock
   const setMockUser = () => {
   const mockUser: User = {
    id:'1234', 
    nombre: 'mockup',
    email: '3241234@gmail.com'
  };
  setUser(mockUser);
  localStorage.setItem('user', JSON.stringify(mockUser));
  };

  return {
    user,
    loading,
    login,
    logout,
    setMockUser
  };
}

