/**
 * 기존 데이터 전체 삭제 스크립트
 * 
 * 사용법:
 * 1. 브라우저 콘솔을 엽니다
 * 2. 관리자 로그인 후, 아래 코드를 복사해서 붙여넣고 실행하세요
 */

async function clearAllData() {
  const projectId = 'mevcahuerkaxwrsocbxl';
  const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-93c83ab0`;
  
  // 현재 로그인된 세션에서 토큰 가져오기
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(
    `https://${projectId}.supabase.co`,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldmNhaHVlcmtheHdyc29jYnhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2OTUyNTEsImV4cCI6MjA1MjI3MTI1MX0.P4Wq_CPP5xL7HNUm_sT0RHQIrXxMRgj_50I6-Xm3otY'
  );
  
  const session = await supabase.auth.getSession();
  const token = session.data.session?.access_token;
  
  if (!token) {
    console.error('❌ 로그인이 필요합니다. 먼저 관리자 로그인을 해주세요.');
    return;
  }
  
  console.log('🗑️ 전체 데이터 삭제 시작...');
  
  try {
    // 작품 전체 삭제
    console.log('📸 작품 삭제 중...');
    const worksResponse = await fetch(`${API_BASE}/admin/clear-works`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (worksResponse.ok) {
      const result = await worksResponse.json();
      console.log(`✅ 작품 ${result.deleted}개 삭제 완료`);
    } else {
      console.error('❌ 작품 삭제 실패:', await worksResponse.text());
    }
    
    // 장비 전체 삭제
    console.log('🎥 장비 삭제 중...');
    const equipmentResponse = await fetch(`${API_BASE}/admin/clear-equipment`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (equipmentResponse.ok) {
      const result = await equipmentResponse.json();
      console.log(`✅ 장비 ${result.deleted}개 삭제 완료`);
    } else {
      console.error('❌ 장비 삭제 실패:', await equipmentResponse.text());
    }
    
    console.log('✨ 전체 삭제 완료! 페이지를 새로고침하세요.');
    
  } catch (error) {
    console.error('❌ 삭제 중 에러 발생:', error);
  }
}

// 실행
clearAllData();
