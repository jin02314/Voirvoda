import { useState } from 'react';
import { WorkArchiveManager } from './admin/WorkArchiveManager';
import { EquipmentManager } from './admin/EquipmentManager';
import { ContactManager } from './admin/ContactManager';
import { AboutManager } from './admin/AboutManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { LogOut, Home, Database } from 'lucide-react';
import { WorkItem, Equipment } from '../lib/sharedState';
import { toast } from 'sonner';
import * as api from '../lib/api';

interface AdminProps {
  onLogout: () => void;
  workItems: WorkItem[];
  setWorkItems: React.Dispatch<React.SetStateAction<WorkItem[]>>;
  equipment: Equipment[];
  setEquipment: React.Dispatch<React.SetStateAction<Equipment[]>>;
}

export function Admin({ onLogout, workItems, setWorkItems, equipment, setEquipment }: AdminProps) {
  const [isClearing, setIsClearing] = useState(false);

  const handleClearAllData = async () => {
    const confirmed = window.confirm(
      '⚠️ 경고: 모든 작품과 장비 데이터가 영구적으로 삭제됩니다.\n\n정말로 진행하시겠습니까?'
    );
    
    if (!confirmed) return;
    
    const doubleConfirm = window.confirm(
      '⚠️ 최종 확인: 삭제된 데이터는 복구할 수 없습니다.\n\n계속하시겠습니까?'
    );
    
    if (!doubleConfirm) return;
    
    setIsClearing(true);
    
    try {
      // 작품 전체 삭제
      const worksResult = await api.clearAllWorks();
      console.log('✅ 작품 삭제 완료:', worksResult);
      
      // 장비 전체 삭제
      const equipmentResult = await api.clearAllEquipment();
      console.log('✅ 장비 삭제 완료:', equipmentResult);
      
      // 로컬 state 초기화
      setWorkItems([]);
      setEquipment([]);
      
      toast.success('모든 데이터가 삭제되었습니다');
    } catch (error: any) {
      console.error('❌ 데이터 삭제 실패:', error);
      toast.error('데이터 삭제 실패: ' + error.message);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="flex-1 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">관리자 페이지</h1>
          <div className="flex gap-2">
            <Button 
              onClick={handleClearAllData} 
              variant="destructive"
              disabled={isClearing}
            >
              <Database className="w-4 h-4 mr-2" />
              {isClearing ? '삭제 중...' : '전체 데이터 삭제'}
            </Button>
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
          <TabsList className="grid w-full max-w-2xl grid-cols-4">
            <TabsTrigger value="archive">워크 아카이브</TabsTrigger>
            <TabsTrigger value="equipment">장비 관리</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
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

          <TabsContent value="about" className="mt-6">
            <AboutManager />
          </TabsContent>

          <TabsContent value="contact" className="mt-6">
            <ContactManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}