import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';

export const AllJobs = () => {
  const { data = [], isLoading } = useQuery({
    queryKey: ['allJobs'],
    queryFn: jobService.getAllJobs,
  });

  if (isLoading) return <div className="text-gray-500 mb-6">작업 정보를 불러오는 중...</div>;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">전체 작업 수</h2>
      <p className="text-4xl font-bold text-indigo-600">{data.length}</p>
    </div>
  );
};
