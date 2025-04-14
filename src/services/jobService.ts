import axios from 'axios';
import { BatchJob, JobStats } from '@/types/job';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const jobService = {
  // 모든 Job 목록 조회
  async getAllJobs(): Promise<BatchJob[]> {
    const response = await axios.get<BatchJob[]>(`${API_BASE_URL}/jobs`);
    return response.data;
  },

  // Job 통계 조회
  async getJobStats(): Promise<JobStats> {
    const response = await axios.get<JobStats>(`${API_BASE_URL}/jobs/stats`);
    return response.data;
  },

  // 새로운 Job 생성
  async createJob(jobData: Omit<BatchJob, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<BatchJob> {
    const response = await axios.post<BatchJob>(`${API_BASE_URL}/jobs`, jobData);
    return response.data;
  },

  // Job 즉시 실행
  async runJob(jobId: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.post<{ success: boolean; message: string }>(`${API_BASE_URL}/jobs/${jobId}/run`);
    return response.data;
  },

  // Job 상태 업데이트
  async updateJobStatus(jobId: string, status: BatchJob['status']): Promise<BatchJob> {
    const response = await axios.patch<BatchJob>(`${API_BASE_URL}/jobs/${jobId}/status`, { status });
    return response.data;
  },

  // Job 삭제
  async deleteJob(jobId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
  }
}; 