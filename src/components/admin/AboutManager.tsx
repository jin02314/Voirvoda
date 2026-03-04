import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Save, Upload, User, Briefcase } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import * as api from '../../lib/api';

export function AboutManager() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    bio: '',
    experience: '',
    skills: '',
    achievements: '',
    profileImage: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadAboutInfo();
  }, []);

  const loadAboutInfo = async () => {
    setIsLoading(true);
    try {
      const data = await api.getAboutInfo();
      if (data) {
        setFormData(data);
      }
    } catch (error: any) {
      console.error('About 정보 로드 오류:', error);
      toast.error('About 정보를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // 미리보기
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ ...formData, profileImage: event.target?.result as string });
      };
      reader.readAsDataURL(file);
      toast.success('이미지가 선택되었습니다');
    }
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('제목을 입력해주세요');
      return;
    }

    setIsSaving(true);
    try {
      await api.updateAboutInfo(formData, imageFile);
      toast.success('About 정보가 저장되었습니다');
      setImageFile(null);
    } catch (error: any) {
      console.error('About 정보 저장 오류:', error);
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
          <CardTitle>About 페이지 정보</CardTitle>
          <CardDescription>
            About 페이지에 표시될 프로필 정보를 관리하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                <User className="w-4 h-4 inline mr-2" />
                제목 / 이름 *
              </Label>
              <Input
                id="title"
                placeholder="예: 홍길동"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">
                <Briefcase className="w-4 h-4 inline mr-2" />
                부제 / 직함
              </Label>
              <Input
                id="subtitle"
                placeholder="예: 포토그래퍼 & 비디오그래퍼"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="profileImage">프로필 이미지</Label>
            <Input
              id="profileImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.profileImage && (
              <div className="mt-2">
                <img 
                  src={formData.profileImage} 
                  alt="프로필 미리보기" 
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">소개 / Bio</Label>
            <Textarea
              id="bio"
              placeholder="자신에 대한 간단한 소개를 입력하세요"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">경력</Label>
            <Textarea
              id="experience"
              placeholder="주요 경력 사항을 입력하세요 (각 줄마다 하나씩)"
              rows={4}
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">기술 / 스킬</Label>
            <Textarea
              id="skills"
              placeholder="보유 기술이나 스킬을 입력하세요 (쉼표로 구분)"
              rows={3}
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="achievements">수상 경력 / 성과</Label>
            <Textarea
              id="achievements"
              placeholder="수상 경력이나 주요 성과를 입력하세요"
              rows={4}
              value={formData.achievements}
              onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
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
