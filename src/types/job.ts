export interface BatchJob {
  id: number;
  name: string;
  description: string;
  endpointUrl: string;
  userId: number;
  createdAt: string;     // ISO 문자열 (예: '2025-04-19T02:00:00')
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

export interface BatchLog {
  status: 'SUCCESS' | 'FAIL';
  message: string;
  executedAt: string;
}

// types/job.ts
export interface CreateJobRequest {
  name: string;
  description?: string;
  endpointUrl: string;
  userId: number;
  scheduleTime: string;            // ISO 형식 문자열
  repeatIntervalMinutes?: number;  // 선택 값 (단발성도 가능)
}

