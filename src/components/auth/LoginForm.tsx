'use client';

import React, { useState } from 'react';
import { useLogin } from '@/hooks/useLogin';

export const LoginForm: React.FC = () => {
  const { login, isLoading, error } = useLogin();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login({ ...credentials, id: 0 });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">배치 관리 시스템</h1>
          <p className="text-sm text-gray-500 mt-1">로그인하여 시작하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            id="username"
            name="username"
            type="text"
            required
            placeholder="아이디"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.username}
            onChange={handleChange}
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="비밀번호"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={credentials.password}
            onChange={handleChange}
          />

          {error && (
            <div className="rounded-md bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-blue-500 px-4 py-3 text-white font-medium hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isLoading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500 mt-6">
          계정이 없으신가요?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            회원가입
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
