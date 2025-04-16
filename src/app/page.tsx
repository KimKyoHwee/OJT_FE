'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobList } from '@/components/JobList';
import { AllJobs } from '@/components/JobStats'; // JobStats를 AllJobs로 변경
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5000, // 5초마다 데이터 자동 갱신
      staleTime: 1000,
    },
  },
});

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // localStorage에서 authenticated 값 확인
    const authenticated = localStorage.getItem('authenticated') === 'true';
    console.log('Authenticated from localStorage:', authenticated);

    if (!authenticated) {
      console.log('User is not authenticated, redirecting to login page...');
      router.push('/login'); // 로그인 페이지로 리다이렉트
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false); // 로딩 상태 해제
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 상태 표시
  }

  if (!isAuthenticated) {
    return null; // 인증되지 않은 경우 아무것도 렌더링하지 않음
  }

  return (
    <QueryClientProvider client={queryClient}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Batch Job Management</h1>
        <AllJobs /> {/* AllJobs 컴포넌트로 변경 */}
        <JobList />
      </main>
    </QueryClientProvider>
  );
}