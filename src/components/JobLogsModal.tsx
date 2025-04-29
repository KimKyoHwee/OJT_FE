'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { jobService } from '@/services/jobService';
import { BatchLog, PageResponse } from '@/types/job';

const PAGE_SIZE = 10;

interface Props {
  jobId: string;
}

export const JobLogsModal: React.FC<Props> = ({ jobId }) => {
  const [page, setPage] = useState(0);

  const { data, isLoading } = useQuery<
  PageResponse<BatchLog>,            // 서버에서 반환되는 전체 페이징 결과
  Error,                             // 에러 타입
  PageResponse<BatchLog>,            // 선택된 데이터 타입
  ['jobLogs', string, number]        // 쿼리 키 튜플
>({
  queryKey: ['jobLogs', jobId, page],
  queryFn: () => jobService.getJobLogs(jobId, page, PAGE_SIZE),
  staleTime: 60_000,
})

  

  const logs = data?.content || [];
  const totalPages = data?.totalPages ?? 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-gray-500 hover:text-green-600">로그 보기</button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>실행 로그</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto text-sm text-gray-700">
          {isLoading ? (
            <p>로그 불러오는 중...</p>
          ) : logs.length === 0 ? (
            <p>로그가 없습니다.</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="border-b pb-2">
                <div className="flex justify-between text-xs">
                  <span
                    className={`font-medium ${
                      log.status === 'SUCCESS' ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="text-gray-400">
                    {new Date(log.executedAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-1">{log.message}</p>
              </div>
            ))
          )}
        </div>

        {/* 페이징 컨트롤 */}
        {totalPages > 1 && (
          <div className="mt-4 flex justify-center items-center space-x-4">
            <Button
              size="sm"
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(p - 1, 0))}
            >
              이전
            </Button>
            <span className="text-sm text-gray-600">
              {page + 1} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={page + 1 >= totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            >
              다음
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
