import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore authentication state from localStorage
    const savedToken = localStorage.getItem('bit_token');
    const savedUser = localStorage.getItem('bit_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post('/recrutadores/login', { email, senha });
      const { token: receivedToken, usuario } = response.data;

      // The login response has 'usuario': { nome, email, permissao_id }
      // But we also need their empresa_id which is inside the JWT payload.
      // We can decode the JWT to extract 'empresa_id' and 'id'.
      const payloadBase64 = receivedToken.split('.')[1];
      const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
      const padding = '='.repeat((4 - (base64.length % 4)) % 4);
      const decodedPayload = JSON.parse(atob(base64 + padding));
      
      const fullUser = {
        ...usuario,
        id: decodedPayload.id,
        empresa_id: decodedPayload.empresa_id,
        permissao_id: decodedPayload.permissao_id || usuario.permissao_id,
      };

      localStorage.setItem('bit_token', receivedToken);
      localStorage.setItem('bit_user', JSON.stringify(fullUser));

      setToken(receivedToken);
      setUser(fullUser);

      return fullUser;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('bit_token');
    localStorage.removeItem('bit_user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
