import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Gallery } from './components/Gallery';
import { EquipmentShop } from './components/EquipmentShop';
import { Contact } from './components/Contact';
import { About } from './components/About';
import { Toaster } from './components/ui/sonner';
import { WorkItem, Equipment } from './lib/sharedState';
import * as api from './lib/api';

export default function Root() {
  const [activeCollection, setActiveCollection] = useState('all');
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from API
  const loadData = async () => {
    try {
      const [works, equipmentData] = await Promise.all([
        api.getWorks(),
        api.getEquipment(),
      ]);
      console.log('📥 [Root] 데이터 로드 완료:', works.length, '작품,', equipmentData.length, '장비');
      setWorkItems(works);
      setEquipment(equipmentData);
    } catch (error) {
      console.error('❌ [Root] 데이터 로딩 오류:', error);
      // 에러가 나도 빈 배열로 계속 진행
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load on mount
  useEffect(() => {
    loadData();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      console.log('🔄 [Root] 데이터 자동 새로고침...');
      loadData();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar 
        activeCollection={activeCollection}
        onCollectionChange={setActiveCollection}
        showAdmin={false}
      />
      {activeCollection === 'equipment' ? (
        <EquipmentShop equipment={equipment} />
      ) : activeCollection === 'contact' ? (
        <Contact />
      ) : activeCollection === 'about' ? (
        <About />
      ) : (
        <Gallery 
          activeCollection={activeCollection}
          workItems={workItems}
        />
      )}
      <Toaster />
    </div>
  );
}