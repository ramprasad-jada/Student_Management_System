import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' }
})

export const studentsApi = {
  dashboard: () => api.get('/api/dashboard'),
  list: (search = '') => api.get('/api/students', { params: { search } }),
  create: (data) => api.post('/api/students', data),
  update: (id, data) => api.put(`/api/students/${id}`, data),
  remove: (id) => api.delete(`/api/students/${id}`)
}

export default api
