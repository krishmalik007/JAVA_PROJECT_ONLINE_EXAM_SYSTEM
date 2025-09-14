import axios from 'axios';

const userApi = axios.create({
  baseURL: 'http://localhost:8082/api',
});

const adminApi = axios.create({
  baseURL: 'http://localhost:8081/api',
});

// Add a request interceptor to attach the JWT token
const authInterceptor = (config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

userApi.interceptors.request.use(authInterceptor);
adminApi.interceptors.request.use(authInterceptor);

export { userApi, adminApi };