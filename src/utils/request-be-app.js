import axios from 'axios';
import { deleteLocalStorageItem, getLocalStorageItem } from './localStoreSav.js';

const service = axios.create({
    baseURL: import.meta.env.VITE_BE_API_URL,
    timeout: 5000,
    headers: {
        'Access-Control-Allow-Origin': '*',
    },
});

// Request interceptor
service.interceptors.request.use(
    config => {
        const token = getLocalStorageItem('userLocal');
        if (token?.accessToken) {
            config.headers.Authorization = `Bearer ${token.accessToken}`;
        }
        return config;
    },
    error => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
service.interceptors.response.use(
    response => {
        if ([200, 201].includes(response.status)) {
            return response.data;
        } else if (response.status === 401) {
            deleteLocalStorageItem('userLocal');
            return Promise.reject(new Error('Unauthorized'));
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        const errRes = error?.response?.data || { message: 'Unknown error' };
        return Promise.reject(errRes);
    }
);

export default service;
