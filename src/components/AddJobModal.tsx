import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { jobService } from '@/services/jobService';

export const AddJobModal: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddJob = async () => {
    if (!name || !endpointUrl) return;
    setLoading(true);
    try {
      await jobService.createJob({ name, description, endpointUrl });
      location.reload(); // 새로고침으로 간단히 갱신
    } catch (error) {
      console.error('작업 생성 중 오류:', error);
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
          <Input placeholder="작업 이름" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="설명 (선택)" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input placeholder="엔드포인트 URL" value={endpointUrl} onChange={(e) => setEndpointUrl(e.target.value)} />
          <Button onClick={handleAddJob} disabled={loading} className="w-full mt-2">
            {loading ? '추가 중...' : '추가하기'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
