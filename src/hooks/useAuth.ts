// src/hooks/useAuth.ts

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCredentials, AuthState, AuthUser, AuthError } from '@/types/auth';
import { authService } from '@/services/authService';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const useAuth = () => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(initialState);

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (!accessToken) {
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      try {
        // 토큰 유효성 검증 및 사용자 정보 가져오기
        const tokens = await authService.refreshToken();
        const user = await authService.getMe();
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await authService.login(credentials);
      setState({
        user: response.user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      router.push('/');
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: {
          message: '로그인에 실패했습니다.',
          code: 'INVALID_CREDENTIALS',
        },
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      router.push('/login');
    }
  };

  return {
    ...state,
    login,
    logout,
  };
};

export default useAuth;