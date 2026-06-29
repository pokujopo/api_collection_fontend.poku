import axios from 'axios'

const BASE_URL = 'https://api-collection-poku.onrender.com'

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexus_token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor — handle global errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('nexus_token')
      localStorage.removeItem('nexus_user')
      window.dispatchEvent(new CustomEvent('nexus:unauthorized'))
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (data) => api.post('/api/v1/register/', data),
  login: (data) => api.post('/api/v1/login/', data),
}

export const keyApi = {
  generate: () => api.post('/api/v1/generate-key/'),
}

export const downloadApi = {
  start: (data, apiKey) =>
    api.post('/api/v1/download/', data, {
      headers: { 'X-API-Key': apiKey },
    }),
  status: (id) => api.get(`/api/v1/download/status/${id}/`),
}
