'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { jobService } from '@/services/jobService';
import { CreateJobRequest } from '@/types/job'; // ✅ CreateJobRequest 기준으로 받는다

interface Props {
  jobId: number;            // 수정할 대상 Job ID
  job: CreateJobRequest;    // CreateJobRequest 타입으로 props 받음
  onUpdated: () => void;    // 수정 후 리프레시용 콜백
}

export const EditJobModal: React.FC<Props> = ({ jobId, job, onUpdated }) => {
  const [name, setName] = useState(job.name);
  const [description, setDescription] = useState(job.description || '');
  const [endpointUrl, setEndpointUrl] = useState(job.endpointUrl);
  const [startTime, setStartTime] = useState(job.startTime ? job.startTime.substring(0, 16) : '');
  const [scheduleType, setScheduleType] = useState<'interval' | 'cron'>(job.cronExpression ? 'cron' : 'interval');
  const [repeatIntervalMinutes, setRepeatIntervalMinutes] = useState<number | ''>(job.repeatIntervalMinutes || '');
  const [cronExpression, setCronExpression] = useState(job.cronExpression || '');
  const [loading, setLoading] = useState(false);

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
        startTime,
        cronExpression: scheduleType === 'cron' ? cronExpression : undefined,
        repeatIntervalMinutes: scheduleType === 'interval' && repeatIntervalMinutes !== '' ? Number(repeatIntervalMinutes) : undefined,
        userId: job.userId, // userId 유지
      };

      await jobService.updateJob(jobId, payload);

      onUpdated(); // 수정 성공 시 콜백 호출
    } catch (error: any) {
      console.error('수정 실패:', error);
      const err = error.response?.data;
      alert(`${err?.error || 'ERROR'}: ${err?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="text-gray-500 hover:text-blue-500">수정</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>작업 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* 기본 정보 */}
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="작업 이름" />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" />
          <Input value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} placeholder="엔드포인트 URL" />

          {/* 스케줄 타입 */}
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

          {/* 시작 시간 */}
          <Input
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />

          {/* 반복 주기 / 크론 입력 */}
          {scheduleType === 'interval' && (
            <Input
              type="number"
              placeholder="반복 주기 (분)"
              value={repeatIntervalMinutes}
              onChange={(e) => setRepeatIntervalMinutes(e.target.value === '' ? '' : Number(e.target.value))}
            />
          )}
          {scheduleType === 'cron' && (
            <Input
              placeholder="Cron 표현식 (예: 0 0/5 * * * ?)"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
            />
          )}

          {/* 저장 버튼 */}
          <Button onClick={handleUpdate} disabled={loading} className="w-full mt-4">
            {loading ? '수정 중...' : '저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
