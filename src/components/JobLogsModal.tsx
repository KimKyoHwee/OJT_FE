'use client';

import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { jobService } from '@/services/jobService';
import { BatchLog } from '@/types/job';

interface Props {
  jobId: string;
}

export const JobLogsModal: React.FC<Props> = ({ jobId }) => {
  const { data: logs = [], isLoading } = useQuery<BatchLog[]>({
    queryKey: ['jobLogs', jobId],
    queryFn: () => jobService.getJobLogs(jobId),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-gray-500 hover:text-green-600">로그 보기</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>실행 로그</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto text-sm text-gray-700">
          {isLoading ? (
            <p>로그 불러오는 중...</p>
          ) : logs.length === 0 ? (
            <p>로그가 없습니다.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="border-b pb-2">
                <div className="flex justify-between text-xs">
                  <span className={`font-medium ${log.status === 'SUCCESS' ? 'text-green-600' : 'text-red-500'}`}>
                    {log.status}
                  </span>
                  <span className="text-gray-400">{new Date(log.executedAt).toLocaleString()}</span>
                </div>
                <p className="mt-1">{log.message}</p>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
