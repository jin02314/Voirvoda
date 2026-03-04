import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import * as api from '../lib/api';

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        // 회원가입
        if (password !== confirmPassword) {
          toast.error('비밀번호가 일치하지 않습니다.');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          toast.error('비밀번호는 최소 6자 이상이어야 합니다.');
          setIsLoading(false);
          return;
        }
        await api.signUp(email, password, name);
        toast.success('회원가입 성공! 로그인해주세요.');
        setIsSignUp(false);
        setPassword('');
        setConfirmPassword('');
      } else {
        // 로그인
        await api.signIn(email, password);
        toast.success('로그인 성공!');
        onLogin();
      }
    } catch (error: any) {
      console.error(isSignUp ? '회원가입 오류:' : '로그인 오류:', error);
      toast.error(error.message || (isSignUp ? '회원가입에 실패했습니다.' : '로그인에 실패했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              {isSignUp ? (
                <UserPlus className="w-6 h-6 text-white" />
              ) : (
                <Lock className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl">
            {isSignUp ? '관리자 회원가입' : '관리자 로그인'}
          </CardTitle>
          <CardDescription>
            {isSignUp 
              ? '새로운 관리자 계정을 생성하세요' 
              : '관리자 페이지에 접근하려면 이메일과 비밀번호를 입력하세요'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="name">이름</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="홍길동"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isSignUp ? '최소 6자 이상' : '비밀번호를 입력하세요'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호 재입력"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !email || !password || (isSignUp && (!name || !confirmPassword))}
            >
              {isLoading 
                ? (isSignUp ? '가입 중...' : '로그인 중...') 
                : (isSignUp ? '회원가입' : '로그인')
              }
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPassword('');
                  setConfirmPassword('');
                  setName('');
                }}
                className="text-sm text-gray-600 hover:text-black underline"
              >
                {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}