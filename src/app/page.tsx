'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { JobList } from '@/components/JobList';
import { JobStats } from '@/components/JobStats';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 5000, // 5초마다 데이터 자동 갱신
      staleTime: 1000,
    },
  },
});

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Batch Job Management</h1>
        <JobStats />
        <JobList />
      </main>
    </QueryClientProvider>
  );
} 