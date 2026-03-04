import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Save, Mail, Phone, MapPin, Globe } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import * as api from '../../lib/api';

export function ContactManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    address: '',
    website: '',
    instagram: '',
    youtube: '',
    additionalInfo: ''
  });

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    setIsLoading(true);
    try {
      const data = await api.getContactInfo();
      if (data) {
        setFormData(data);
      }
    } catch (error: any) {
      console.error('연락처 정보 로드 오류:', error);
      toast.error('연락처 정보를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.email && !formData.phone) {
      toast.error('이메일 또는 전화번호를 최소 하나 입력해주세요');
      return;
    }

    setIsSaving(true);
    try {
      await api.updateContactInfo(formData);
      toast.success('연락처 정보가 저장되었습니다');
    } catch (error: any) {
      console.error('연락처 정보 저장 오류:', error);
      toast.error(error.message || '저장에 실패했습니다');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>연락처 정보</CardTitle>
          <CardDescription>
            Contact 페이지에 표시될 연락처 정보를 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">
                <Mail className="w-4 h-4 inline mr-2" />
                이메일
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                <Phone className="w-4 h-4 inline mr-2" />
                전화번호
              </Label>
              <Input
                id="phone"
                placeholder="010-1234-5678"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">
                <Globe className="w-4 h-4 inline mr-2" />
                웹사이트
              </Label>
              <Input
                id="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram</Label>
              <Input
                id="instagram"
                placeholder="@username"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="youtube">YouTube</Label>
              <Input
                id="youtube"
                placeholder="https://youtube.com/@username"
                value={formData.youtube}
                onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">
              <MapPin className="w-4 h-4 inline mr-2" />
              주소
            </Label>
            <Input
              id="address"
              placeholder="서울시 강남구..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalInfo">추가 정보</Label>
            <Textarea
              id="additionalInfo"
              placeholder="영업 시간, 위치 안내 등 추가 정보를 입력하세요"
              rows={4}
              value={formData.additionalInfo}
              onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
            />
          </div>

          <Button 
            onClick={handleSave} 
            className="bg-black text-white hover:bg-gray-800"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? '저장 중...' : '저장하기'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
