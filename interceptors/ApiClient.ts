import { useAuthStore } from "@/store/authStore";
import axios from "axios";

const ApiClient = axios.create({
    baseURL: process.env.BASE_URL,
    withCredentials: true
});

// Request Interceptor (Add the accessToken to every request)
ApiClient.interceptors.request.use(
    (config) => {
        const token = "Get accessToken from zustand";
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config;
    });

// Response Interceptor
ApiClient.interceptors.response.use(
    (response) => {
        const newToken = response.headers['authorization'];
        if (newToken) {
            const token = newToken.replace('Bearer ', '').trim();
            // Store this new accessToken in zustand
            useAuthStore.getState().setAccessToken(token)
        }
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            useAuthStore.getState().clearAuth();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
)

export default ApiClient;