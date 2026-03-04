import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Admin } from './components/Admin';
import { AdminLogin } from './components/AdminLogin';
import { Toaster } from './components/ui/sonner';
import { WorkItem, Equipment } from './lib/sharedState';
import { toast } from 'sonner@2.0.3';
import * as api from './lib/api';

export default function AdminPage() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await api.getSession();
        if (session) {
          setIsAdminLoggedIn(true);
          // Load data from API
          await loadData();
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const loadData = async () => {
    try {
      const [works, equipmentData] = await Promise.all([
        api.getWorks(),
        api.getEquipment(),
      ]);
      setWorkItems(works);
      setEquipment(equipmentData);
    } catch (error: any) {
      console.error('Data loading error:', error);
      toast.error('데이터 로드에 실패했습니다.');
    }
  };

  const handleAdminLogin = async () => {
    setIsAdminLoggedIn(true);
    await loadData();
  };

  const handleAdminLogout = async () => {
    try {
      await api.signOut();
      setIsAdminLoggedIn(false);
      toast.success('로그아웃되었습니다.');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {isAdminLoggedIn ? (
        <Admin 
          onLogout={handleAdminLogout}
          workItems={workItems}
          setWorkItems={setWorkItems}
          equipment={equipment}
          setEquipment={setEquipment}
        />
      ) : (
        <AdminLogin onLogin={handleAdminLogin} />
      )}
      <Toaster />
    </div>
  );
}