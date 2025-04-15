// src/types/auth.ts

export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthTokens {
    accessToken: string;
    tokenType: 'Bearer';
  }
  
  export interface AuthUser {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
  }
  
  export interface LoginResponse {
    user: AuthUser;
    tokens: AuthTokens;
  }
  
  export interface AuthError {
    message: string;
    code: 'INVALID_CREDENTIALS' | 'EXPIRED_TOKEN' | 'NETWORK_ERROR' | 'UNKNOWN_ERROR';
  }
  
  export interface AuthState {
    user: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: AuthError | null;
  }