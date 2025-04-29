export interface BatchJob {
  id: number;
  name: string;
  description: string;
  endpointUrl: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  // (조회 DTO에 포함된 스케줄 정보가 있다면 아래처럼 추가)
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
// types/job.ts

export interface CreateJobRequest {
  name: string;
  description?: string;
  endpointUrl: string;
  userId: number;
  startTime: string;          // ✅ 시작 시간 (ISO 8601)
  cronExpression?: string;        // ✅ 선택적 (Cron 기반 스케줄)
  repeatIntervalMinutes?: number; // ✅ 선택적 (분 단위 주기)
}

// 조회용 리스트 DTO
export interface BatchJobListDto {
  batchJobId: number;
  name: string;
  description?: string;
  endpointUrl: string;
  updateAt: string;             // 최근 배치 작업 실행 시간
  nextExecutionTime: string;    // 다음 배치 수행 예정 시간
  cronExpression?: string;      // Cron 표현식
  repeatIntervalMinutes?: number;// 분 단위 반복 주기
}

// types/job.ts

export interface PageResponse<T> {
  content: T[];        // 실제 아이템 배열
  page: number;        // 0-based 페이지 번호
  size: number;        // 요청한 페이지 크기
  totalElements: number; // 전체 아이템 개수
  totalPages: number;  // 전체 페이지 수
}



