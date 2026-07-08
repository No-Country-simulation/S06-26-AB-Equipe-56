import axios from 'axios';

const STORAGE_KEYS = {
  token: 'bit_token',
  user: 'bit_user',
  saudeToken: 'bit_saude_token',
  saudeUser: 'bit_saude_user',
};

const limparSessao = () => {
  Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const isSaudeRequest = config.url?.startsWith('/saude');
    const token = isSaudeRequest
      ? localStorage.getItem(STORAGE_KEYS.saudeToken) || localStorage.getItem(STORAGE_KEYS.token)
      : localStorage.getItem(STORAGE_KEYS.token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      limparSessao();
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/registro-convite')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
