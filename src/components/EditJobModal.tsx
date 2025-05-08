'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { jobService } from '@/services/jobService';
import { CreateJobRequest } from '@/types/job';

interface Props {
  jobId: number;
  job: CreateJobRequest;
  onUpdated: () => void;
}

export const EditJobModal: React.FC<Props> = ({ jobId, job, onUpdated }) => {
  const router = useRouter();

  // 모달 열림/닫힘 상태
  const [open, setOpen] = useState(false);

  // 1) Job Type 상태 추가
  const [jobType, setJobType] = useState<'REST' | 'SPRING_BATCH'>(job.jobType);

  // 2) 기존 폼 필드
  const [name, setName] = useState(job.name);
  const [description, setDescription] = useState(job.description || '');
  const [endpointUrl, setEndpointUrl] = useState(job.endpointUrl);
  const [startTime, setStartTime] = useState(job.startTime.substring(0, 16));
  const [scheduleType, setScheduleType] = useState<'interval' | 'cron'>(
    job.cronExpression ? 'cron' : 'interval'
  );
  const [repeatIntervalMinutes, setRepeatIntervalMinutes] = useState<number | ''>(
    job.repeatIntervalMinutes ?? ''
  );
  const [cronExpression, setCronExpression] = useState(job.cronExpression || '');
  const [loading, setLoading] = useState(false);

  // 3) 열 때마다 폼 초기화
  useEffect(() => {
    if (open) {
      setJobType(job.jobType);
      setName(job.name);
      setDescription(job.description || '');
      setEndpointUrl(job.endpointUrl);
      setStartTime(job.startTime.substring(0, 16));
      setScheduleType(job.cronExpression ? 'cron' : 'interval');
      setRepeatIntervalMinutes(job.repeatIntervalMinutes ?? '');
      setCronExpression(job.cronExpression || '');
    }
  }, [open, job]);

  // 업데이트 핸들러
  const handleUpdate = async () => {
    if (!name || !endpointUrl || !startTime) {
      alert('필수 입력값을 모두 채워주세요.');
      return;
    }
    setLoading(true);

    try {
      const payload: CreateJobRequest = {
        name,
        description,
        endpointUrl,
        userId: job.userId,
        jobType, // 추가된 필드
        startTime,
        cronExpression: scheduleType === 'cron' ? cronExpression : undefined,
        repeatIntervalMinutes:
          scheduleType === 'interval' && repeatIntervalMinutes !== ''
            ? Number(repeatIntervalMinutes)
            : undefined,
      };

      await jobService.updateJob(jobId, payload);

      onUpdated();
      setOpen(false);
    } catch (err: any) {
      console.error('수정 실패:', err);
      const msg = err.response?.data?.message || err.message;
      alert(`ERROR: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="text-gray-500 hover:text-blue-500">수정</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>작업 수정</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Job Type 선택 */}
          <div className="flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="REST"
                checked={jobType === 'REST'}
                onChange={() => setJobType('REST')}
              />
              REST 호출
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                value="SPRING_BATCH"
                checked={jobType === 'SPRING_BATCH'}
                onChange={() => setJobType('SPRING_BATCH')}
              />
              Spring Batch
            </label>
          </div>

          {/* 나머지 입력 폼 */}
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="작업 이름"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="설명"
          />
          <Input
            value={endpointUrl}
            onChange={(e) => setEndpointUrl(e.target.value)}
            placeholder="엔드포인트 URL"
          />

          <div className="flex gap-4 text-sm mt-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={scheduleType === 'interval'}
                onChange={() => setScheduleType('interval')}
              />
              반복 주기(분)
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={scheduleType === 'cron'}
                onChange={() => setScheduleType('cron')}
              />
              Cron 표현식
            </label>
          </div>

          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          {scheduleType === 'interval' ? (
            <Input
              type="number"
              placeholder="반복 주기 (분)"
              value={repeatIntervalMinutes}
              onChange={(e) =>
                setRepeatIntervalMinutes(
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
            />
          ) : (
            <Input
              placeholder="Cron 표현식"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
            />
          )}

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full mt-4"
          >
            {loading ? '수정 중...' : '저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
