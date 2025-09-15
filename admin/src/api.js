import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Add auth interceptor
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (username, password) => api.post('/admin/login', { username, password })
};

export const homestaysApi = {
  list: () => api.get('/homestays'),
  getById: (id) => api.get(`/homestays/${id}`),
  create: (data) => api.post('/homestays', data),
  update: (id, data) => api.put(`/homestays/${id}`, data),
  delete: (id) => api.delete(`/homestays/${id}`)
};

export default api;