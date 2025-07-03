import axios from 'axios';

// Configuração da API baseada no ambiente
const getApiBaseUrl = () => {
  // Em desenvolvimento local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:5001/api';
  }
  
  // Em produção, usar o mesmo domínio
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  
  return `${protocol}//${hostname}/api`;
};

// Criar instância do axios
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratamento de respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratamento de erro 401 - Token inválido ou expirado
    if (error.response?.status === 401) {
      // Remover token inválido
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      
      // Opcional: redirecionar para login ou disparar evento
      // console.warn('Token expirado ou inválido. Redirecionando para login...');
      
      // Você pode adicionar lógica para redirecionar para login aqui
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// Função helper para obter o token do localStorage
const getAuthToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.token || localStorage.getItem('authToken');
};

// Função legacy para compatibilidade (será removida gradualmente)
export const apiCall = async (endpoint, options = {}) => {
  try {
    const method = options.method || 'GET';
    const data = options.body ? JSON.parse(options.body) : undefined;
    
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
      ...options,
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await api(config);
    
    // Simular interface do fetch para compatibilidade
    return {
      ok: response.status >= 200 && response.status < 300,
      status: response.status,
      json: async () => response.data,
      data: response.data,
    };
  } catch (error) {
    // Simular interface do fetch para erros
    return {
      ok: false,
      status: error.response?.status || 500,
      json: async () => error.response?.data || { error: 'Erro de rede' },
      data: error.response?.data || { error: 'Erro de rede' },
    };
  }
};

// Nova API principal (usar preferencialmente)
export default api;

// Exportar URL para casos específicos
export const API_BASE_URL = getApiBaseUrl();
