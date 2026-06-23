import axios from 'axios'

// Backend API URL එක
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5038/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// For every request, token will be added to the headers if it exists in localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// For every response, if the status is 401 (Unauthorized), clear localStorage and redirect to login page
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance