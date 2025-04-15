// src/services/authService.ts

import axios from 'axios';
import { LoginCredentials, LoginResponse, AuthTokens, AuthUser } from '@/types/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// axios 인스턴스 생성
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // refresh token을 위한 쿠키 전송 설정
});

// 액세스 토큰 인터셉터
authApi.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// 리프레시 토큰 인터셉터
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response = await authApi.post<AuthTokens>('/auth/refresh');
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await authApi.post<LoginResponse>('/auth/login', credentials);
    const { accessToken } = response.data.tokens;
    localStorage.setItem('accessToken', accessToken);
    return response.data;
  },

  async logout(): Promise<void> {
    await authApi.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async refreshToken(): Promise<AuthTokens> {
    const response = await authApi.post<AuthTokens>('/auth/refresh');
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return response.data;
  },

  async getMe(): Promise<AuthUser> {
    const response = await authApi.get<AuthUser>('/auth/me');
    return response.data;
  }
};

export default authService;