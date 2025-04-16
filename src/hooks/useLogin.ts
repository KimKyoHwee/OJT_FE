import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem('authenticated') === 'true';
  }); // 초기 상태를 localStorage에서 가져오기
  const router = useRouter();

  // authenticated 상태 변경 감지
  useEffect(() => {
    console.log('Authenticated state changed:', authenticated);
  }, [authenticated]);

  const login = async (credentials: { username: string; password: string; id: number }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8080/api/v1/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials), // JSON 데이터 전송
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

      const data = await response.json();

      // 서버에서 반환된 데이터 처리
      const userId = data.content.id;

      // id를 문자열로 변환하여 localStorage에 저장
      localStorage.setItem('userId', userId.toString());
      console.log('Stored userId:', localStorage.getItem('userId'));

      // authenticated 상태를 true로 설정
      setAuthenticated(true);
      localStorage.setItem('authenticated', 'true'); // 상태를 localStorage에 저장

      // 로그인 성공 시 메인 화면으로 이동
      router.push('/');
    } catch (err) {
      setError('아이디, 비밀번호를 확인하세요.');
      setAuthenticated(false); // 로그인 실패 시 authenticated를 false로 설정
      localStorage.setItem('authenticated', 'false'); // 상태를 localStorage에 저장
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading, error, authenticated };
};