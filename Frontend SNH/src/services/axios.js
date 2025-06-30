import axios from 'axios';
import API_URL from './api';

const instance = axios.create({
    baseURL: API_URL,
    headers: {
    'Content-Type': 'application/json',
    },
});
// / Interceptor para agregar el token automáticamente
instance.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});
export default instance;