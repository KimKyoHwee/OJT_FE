'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { jobService } from '@/services/jobService';
import { BatchJob } from '@/types/job';

interface Props {
  job: BatchJob;
  onUpdated: () => void;
}

export const EditJobModal: React.FC<Props> = ({ job, onUpdated }) => {
  const [name, setName] = useState(job.name);
  const [description, setDescription] = useState(job.description || '');
  const [endpointUrl, setEndpointUrl] = useState(job.endpointUrl);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await jobService.updateJob(String(job.id), { name, description, endpointUrl });
      onUpdated();
    } catch (err) {
      console.error('수정 실패:', err);
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
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="작업 이름" />
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="설명" />
          <Input value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} placeholder="엔드포인트 URL" />
          <Button onClick={handleUpdate} disabled={loading} className="w-full">
            {loading ? '수정 중...' : '저장'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
