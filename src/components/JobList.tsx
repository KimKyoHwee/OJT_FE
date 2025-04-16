import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';
import { BatchJob } from '@/types/job';

export const JobList: React.FC = () => {
  const queryClient = useQueryClient();

  // Job 목록 조회
  const { data: jobs, isLoading } = useQuery<BatchJob[]>({
    queryKey: ['jobs'],
    queryFn: jobService.getAllJobs,
  });

  // Job 실행 mutation
  const runJobMutation = useMutation({
    mutationFn: jobService.runJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  // Job 삭제 mutation
  const deleteJobMutation = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endpoint URL</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {jobs?.map((job) => (
            <tr key={job.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{job.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{job.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-500">
                <a href={job.endpointUrl} target="_blank" rel="noopener noreferrer">
                  {job.endpointUrl}
                </a>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => runJobMutation.mutate(String(job.id))}
                  className="text-indigo-600 hover:text-indigo-900 disabled:text-gray-400"
                >
                  Run Now
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this job?')) {
                      deleteJobMutation.mutate(String(job.id));
                    }
                  }}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};