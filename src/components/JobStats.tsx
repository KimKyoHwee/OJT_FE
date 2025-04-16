import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';

export interface BatchJob {
  id: string;
  name: string;
  endpointUrl: string;
  description?: string; // Add optional description property
}

interface Job {
  id: number;
  name: string;
  description: string;
  endpointUrl: string;
}

export const AllJobs: React.FC = () => {
  const { data, isLoading } = useQuery<{ content: Job[] }>({
    queryKey: ['allJobs'],
    queryFn: async () => {
      const batchJobs = await jobService.getAllJobs();
      const jobs: Job[] = batchJobs.map(batchJob => ({
        id: Number(batchJob.id), // Convert id to number
        name: batchJob.name,
        description: batchJob.description || '', // Ensure description exists
        endpointUrl: batchJob.endpointUrl || '', // Ensure endpointUrl exists
      }));
      return { content: jobs }; // Wrap the jobs array in an object with a 'content' property
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading jobs...</div>;
  }

  const jobs = data?.content || []; // content 배열 가져오기

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Total Jobs</h3>
        <p className="mt-2 text-3xl font-bold text-indigo-600">{jobs.length}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
        <ul className="mt-2 text-gray-700">
          {jobs.map(job => (
            <li key={job.id} className="text-sm">
              <strong>{job.name}</strong>: {job.description} (<a href={job.endpointUrl} target="_blank" rel="noopener noreferrer">Endpoint</a>)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};