'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AddJobModal } from '@/components/AddJobModal';
import { AllJobs } from '@/components/AllJobs';
import { JobList } from '@/components/JobList';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5000,
      staleTime: 1000,
    },
  },
});

function AuthenticatedHome() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authenticated = localStorage.getItem('authenticated') === 'true';
    if (!authenticated) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    router.push('/login');
  };

  if (isLoading) return <div className="text-center text-gray-500 mt-20">불러오는 중...</div>;
  if (!isAuthenticated) return null;

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-1">배치 작업 관리</h1>
          <p className="text-gray-500 text-sm">등록된 작업을 조회하고 실행할 수 있어요.</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-gray-500 hover:text-red-500 transition font-medium"
        >
          로그아웃
        </button>
      </header>
      <AddJobModal />
      <AllJobs />
      <JobList />
    </main>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthenticatedHome />
    </QueryClientProvider>
  );
}
