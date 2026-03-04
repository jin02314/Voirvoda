import { useState } from 'react';
import { WorkArchiveManager } from './admin/WorkArchiveManager';
import { EquipmentManager } from './admin/EquipmentManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { LogOut, Home } from 'lucide-react';
import { WorkItem, Equipment } from '../lib/sharedState';
import { toast } from 'sonner';

interface AdminProps {
  onLogout: () => void;
  workItems: WorkItem[];
  setWorkItems: React.Dispatch<React.SetStateAction<WorkItem[]>>;
  equipment: Equipment[];
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
}

export function Admin({ onLogout, workItems, setWorkItems, equipment, setEquipment }: AdminProps) {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">관리자 페이지</h1>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/'} variant="outline">
              <Home className="w-4 h-4 mr-2" />
              홈으로
            </Button>
            <Button onClick={onLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              로그아웃
            </Button>
          </div>
        </div>

        <Tabs defaultValue="archive" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="archive">워크 아카이브</TabsTrigger>
            <TabsTrigger value="equipment">장비 관리</TabsTrigger>
          </TabsList>
          
          <TabsContent value="archive" className="mt-6">
            <WorkArchiveManager 
              workItems={workItems}
              setWorkItems={setWorkItems}
            />
          </TabsContent>
          
          <TabsContent value="equipment" className="mt-6">
            <EquipmentManager 
              equipment={equipment}
              setEquipment={setEquipment}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}