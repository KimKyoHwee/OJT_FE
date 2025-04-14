import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobService } from '@/services/jobService';
import { JobStats as JobStatsType } from '@/types/job';

export const JobStats: React.FC = () => {
  const { data: stats, isLoading } = useQuery<JobStatsType>({
    queryKey: ['jobStats'],
    queryFn: jobService.getJobStats
  });

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading stats...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Total Jobs</h3>
        <p className="mt-2 text-3xl font-bold text-indigo-600">{stats?.totalJobs || 0}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Running Jobs</h3>
        <p className="mt-2 text-3xl font-bold text-green-600">{stats?.runningJobs || 0}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Success Rate</h3>
        <p className="mt-2 text-3xl font-bold text-blue-600">
          {stats ? `${Math.round(stats.successRate * 100)}%` : '0%'}
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900">Avg Response Time</h3>
        <p className="mt-2 text-3xl font-bold text-orange-600">
          {stats ? `${Math.round(stats.averageResponseTime)}ms` : '0ms'}
        </p>
      </div>
    </div>
  );
}; 