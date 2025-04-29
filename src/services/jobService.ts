import axios from 'axios';
import { BatchJob, JobStats, BatchLog, CreateJobRequest, BatchJobListDto, PageResponse } from '@/types/job';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const jobService = {
  // 모든 Job 목록 조회
  async getAllJobs(): Promise<BatchJobListDto[]> {
    const userId = localStorage.getItem('userId');
    if (!userId) throw new Error('User ID가 없습니다.');

    const res = await axios.get<{
      statusCode: string;
      message: string;
      content: BatchJobListDto[];
    }>(`${API_BASE_URL}/batch-job/${userId}`);

    return res.data.content;
  },

  // Job 통계 조회
  async getJobStats(): Promise<JobStats> {
    const response = await axios.get<{ statusCode: string; message: string; content: JobStats }>(
      `${API_BASE_URL}/batch-job/stats`
    );
    return response.data.content;
  },

  // Job 생성
  async createJob(jobData: CreateJobRequest): Promise<BatchJob> {
    const response = await axios.post<{ statusCode: string; message: string; content: BatchJob }>(
      `${API_BASE_URL}/batch-job`,
      jobData
    );
    return response.data.content;
  },

  // Job 수정 (✅ 이 부분)
  async updateJob(jobId: number, updatedData: CreateJobRequest): Promise<BatchJob> {
    const response = await axios.put<{ statusCode: string; message: string; content: BatchJob }>(
      `${API_BASE_URL}/batch-job/${jobId}`,
      updatedData
    );
    return response.data.content;
  },

  // Job 즉시 실행
  async runJob(jobId: string): Promise<{ success: boolean; message: string }> {
    const response = await axios.post<{ success: boolean; message: string }>(
      `${API_BASE_URL}/jobs/${jobId}/run`
    );
    return response.data;
  },

  // Job 삭제
  async deleteJob(jobId: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
  },

  // 페이징된 로그 조회
  async getJobLogs(
    jobId: string,
    page: number,
    size: number
  ): Promise<PageResponse<BatchLog>> {
    const res = await axios.get<{ statusCode: string; message: string; content: PageResponse<BatchLog> }>(
      `${API_BASE_URL}/logs/job/${jobId}?page=${page}&size=${size}`
    );
    return res.data.content;
  },


};
