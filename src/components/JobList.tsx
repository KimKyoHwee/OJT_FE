import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';
import { BatchJob } from '@/types/job';
import { EditJobModal } from '@/components/EditJobModal';
import { JobLogsModal } from '@/components/JobLogsModal';


export const JobList = () => {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery<BatchJob[]>({
    queryKey: ['jobs'],
    queryFn: jobService.getAllJobs,
  });

  const runJobMutation = useMutation({
    mutationFn: jobService.runJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  const deleteJobMutation = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] }),
  });

  if (isLoading) return <div className="text-gray-500">작업 목록을 불러오는 중...</div>;

  return (
    <div className="space-y-4">
      {data.map((job) => (
        <div key={job.id} className="p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-medium text-gray-900">{job.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{job.description}</p>
          <a
            href={job.endpointUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 underline"
          >
            {job.endpointUrl}
          </a>

          <div className="mt-4 flex gap-3">
            <button
              onClick={() => runJobMutation.mutate(String(job.id))}
              className="text-indigo-600 hover:underline"
            >
              즉시 실행
            </button>

            <EditJobModal
              job={job}
              onUpdated={() => queryClient.invalidateQueries({ queryKey: ['jobs'] })}
            />

            <JobLogsModal jobId={String(job.id)} /> {/* 👈 로그 모달 */}

            <button
              onClick={() => {
                if (confirm('정말 삭제할까요?')) deleteJobMutation.mutate(String(job.id));
              }}
              className="text-red-500 hover:underline"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
