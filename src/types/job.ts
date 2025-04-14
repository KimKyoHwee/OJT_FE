export interface BatchJob {
  id: string;
  name: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PENDING';
  schedule: string;
  lastRun?: string;
  nextRun?: string;
  apiEndpoint: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobStats {
  totalJobs: number;
  runningJobs: number;
  successRate: number;
  averageResponseTime: number;
}

export interface JobError {
  message: string;
  timestamp: string;
  jobId: string;
  details?: string;
} 