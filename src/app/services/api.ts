import axios from 'axios';
import { getCookie } from 'cookies-next';

const token = getCookie('account-token')

export const api = axios.create({
    baseURL: 'http://localhost:3333'
})

api.interceptors.request.use(config => {
    return config;
})

if (token) {
    api.defaults.headers['Authorization'] = `Bearer ${token}`
}