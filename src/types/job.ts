export interface BatchJob {
  id: number; // id를 number로 변경
  name: string; // Job 이름
  description: string; // Job 설명
  endpointUrl: string; // Job 실행 엔드포인트 URL
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