import axios from 'axios';
import { BatchJob, JobStats, BatchLog, CreateJobRequest } from '@/types/job';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const jobService = {
  // 모든 Job 목록 조회
  async getAllJobs(): Promise<BatchJob[]> {
    // localStorage에서 userId 가져오기
    const userId = localStorage.getItem('userId');
    if (!userId) {
      throw new Error('User ID가 존재하지 않습니다.');
    }

    // userId를 URL에 포함
    const response = await axios.get<{ statusCode: string; message: string; content: BatchJob[] }>(
      `${API_BASE_URL}/batch-job/${userId}`
    );
    console.log('getAllJobs response:', response.data); // 반환값 확인

    return response.data.content;
  },

  // Job 통계 조회
  async getJobStats(): Promise<JobStats> {
    const response = await axios.get<JobStats>(`${API_BASE_URL}/batch-job/stats`);
    return response.data;
  },

  // 새로운 Job 생성
  async createJob(jobData: CreateJobRequest): Promise<BatchJob> {
    console.log(localStorage.getItem('userId')); // 값이 null 또는 '' 이라면 오류 발생함
    const response = await axios.post<BatchJob>(`${API_BASE_URL}/batch-job`, jobData);
    return response.data;
  },

  // Job 즉시 실행
  async runJob(jobId: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.post<{ success: boolean; message: string }>(`${API_BASE_URL}/jobs/${jobId}/run`);
    return response.data;
  },

  // Job 상태 업데이트
  async updateJobStatus(jobId: string): Promise<BatchJob> {
    const response = await axios.patch<BatchJob>(`${API_BASE_URL}/jobs/${jobId}/status`, { status });
    return response.data;
  },

  // Job 삭제
  async deleteJob(jobId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
  },
 
  async updateJob(jobId: string, updatedData: Partial<BatchJob>): Promise<BatchJob> {
    const response = await axios.patch<BatchJob>(`${API_BASE_URL}/jobs/${jobId}`, updatedData);
    return response.data;
  },

  // logs 조회
async getJobLogs(jobId: string): Promise<BatchLog[]> {
  const response = await axios.get<{ statusCode: string; message: string; content: BatchLog[] }>(
    `${API_BASE_URL}/logs/job/${jobId}`
  );
  return response.data.content;
}

  
};