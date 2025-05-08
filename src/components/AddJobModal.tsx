'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { jobService } from '@/services/jobService';
import { CreateJobRequest } from '@/types/job';

export const AddJobModal: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [jobType, setJobType] = useState<'REST' | 'SPRING_BATCH'>('REST');       // ← 추가
  const [scheduleType, setScheduleType] = useState<'interval' | 'cron'>('interval');
  const [repeatIntervalMinutes, setRepeatIntervalMinutes] = useState<number | ''>('');
  const [cronExpression, setCronExpression] = useState('');
  const [startTime, setStartTime] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddJob = async () => {
    if (!name || !endpointUrl || !startTime) {
      alert('필수 입력값을 채워주세요.');
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('로그인이 필요합니다.');
      return;
    }

    setLoading(true);
    try {
      const payload: CreateJobRequest = {
        name,
        description,
        endpointUrl,
        userId: Number(userId),
        startTime,
        cronExpression: scheduleType === 'cron' ? cronExpression : undefined,
        repeatIntervalMinutes:
          scheduleType === 'interval' && repeatIntervalMinutes !== ''
            ? Number(repeatIntervalMinutes)
            : undefined,
        jobType,   // ← 추가
      };

      await jobService.createJob(payload);
      location.reload();
    } catch (error: any) {
      console.error('작업 생성 중 오류:', error);
      const err = error.response?.data;
      alert(`${err?.error || 'ERROR'}: ${err?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mb-6 w-full text-lg py-3">+ 새 작업 추가</Button>
      </DialogTrigger>
      <DialogContent className="p-6 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">새 배치 작업 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* 1) Job Type 선택 */}
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

          {/* 2) 나머지 기존 폼 */}
          <Input placeholder="작업 이름" value={name} onChange={e => setName(e.target.value)} />
          <Input placeholder="설명 (선택)" value={description} onChange={e => setDescription(e.target.value)} />
          <Input placeholder="엔드포인트 URL" value={endpointUrl} onChange={e => setEndpointUrl(e.target.value)} />

          <div className="flex gap-4 text-sm">
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
            onChange={e => setStartTime(e.target.value)}
          />

          {scheduleType === 'interval' && (
            <Input
              type="number"
              placeholder="반복 주기 (분) - 단발성은 비워두세요"
              value={repeatIntervalMinutes}
              onChange={e =>
                setRepeatIntervalMinutes(e.target.value === '' ? '' : Number(e.target.value))
              }
            />
          )}
          {scheduleType === 'cron' && (
            <Input
              placeholder="Cron 표현식 (예: 0 0/5 * * * ?)"
              value={cronExpression}
              onChange={e => setCronExpression(e.target.value)}
            />
          )}

          <Button onClick={handleAddJob} disabled={loading} className="w-full mt-2">
            {loading ? '추가 중...' : '추가하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
