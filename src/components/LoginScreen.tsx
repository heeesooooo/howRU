import { Mail, Lock, Eye, EyeOff, Star, Cloud, Heart, Sparkles, LogIn, UserPlus } from 'lucide-react';
import { useState } from 'react';

interface LoginScreenProps {
  onNavigate: (screen: string) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-primary p-6 border-b-8 border-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-foreground flex items-center justify-center">
                <LogIn className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-primary-foreground font-black text-xl tracking-wide">SIGN IN</h1>
                <p className="text-primary-foreground/80 text-sm font-bold">ACCOUNT ACCESS</p>
              </div>
            </div>
            <div className="text-primary-foreground font-black">SECURE</div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-card border-8 border-foreground border-t-0 p-8">
          <div className="mb-8">
            <h2 className="font-black text-foreground text-xl mb-4 tracking-wide">계정 로그인</h2>
            <div className="border-l-8 border-primary pl-4 bg-accent p-4">
              <p className="text-muted-foreground font-bold">
                데이터 동기화를 위해 로그인하거나 계정을 생성하세요
              </p>
            </div>
          </div>

          {/* SNS 로그인 버튼 */}
          <div className="space-y-4 mb-8">
            <button className="w-full py-4 px-6 border-4 border-foreground flex items-center justify-center gap-4 hover:bg-accent transition-colors">
              <div className="w-8 h-8 bg-red-500 flex items-center justify-center border-2 border-foreground">
                <span className="text-white font-black">G</span>
              </div>
              <span className="font-black text-lg tracking-wide">CONTINUE WITH GOOGLE</span>
            </button>
            
            <button className="w-full py-4 px-6 bg-[#FEE500] border-4 border-foreground flex items-center justify-center gap-4 hover:bg-[#FDD700] transition-colors">
              <div className="w-8 h-8 bg-black flex items-center justify-center border-2 border-foreground">
                <span className="text-yellow-400 font-black">K</span>
              </div>
              <span className="font-black text-lg tracking-wide text-black">CONTINUE WITH KAKAO</span>
            </button>
          </div>

          {/* 분리선 */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-1 bg-foreground"></div>
            <span className="text-foreground font-black bg-background px-4 py-2 border-4 border-foreground">OR</span>
            <div className="flex-1 h-1 bg-foreground"></div>
          </div>

          {/* 이메일/비밀번호 입력 */}
          <div className="space-y-6 mb-8">
            <div>
              <label className="block font-black text-foreground mb-3 text-lg">EMAIL ADDRESS</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-4 pl-12 pr-4 border-4 border-foreground focus:border-primary focus:outline-none transition-colors font-bold text-lg"
                />
              </div>
            </div>
            
            <div>
              <label className="block font-black text-foreground mb-3 text-lg">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-4 pl-12 pr-16 border-4 border-foreground focus:border-primary focus:outline-none transition-colors font-bold text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button 
            onClick={() => onNavigate('calendar')}
            className="w-full py-5 bg-primary text-primary-foreground border-4 border-foreground font-black text-xl tracking-wide hover:bg-primary/90 transition-colors mb-6"
          >
            SIGN IN →
          </button>

          {/* 하단 링크 */}
          <div className="flex justify-between mb-8">
            <button className="text-muted-foreground hover:text-primary transition-colors font-bold tracking-wide">
              FORGOT PASSWORD?
            </button>
            <button 
              onClick={() => onNavigate('signup')}
              className="text-muted-foreground hover:text-primary transition-colors font-bold tracking-wide"
            >
              CREATE ACCOUNT
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="border-4 border-foreground bg-accent p-6">
            <div className="text-center">
              <h4 className="font-black text-foreground mb-2 text-lg tracking-wide">GUEST ACCESS</h4>
              <p className="text-muted-foreground font-bold mb-4">
                로그인 없이도 모든 기능을 사용할 수 있습니다
              </p>
              <button 
                onClick={() => onNavigate('calendar')}
                className="bg-primary text-primary-foreground px-6 py-3 border-4 border-foreground hover:bg-primary/90 transition-colors font-black tracking-wide"
              >
                START WITHOUT SIGN IN →
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-foreground p-6 text-center border-8 border-foreground border-t-0">
          <div className="flex justify-center gap-6 text-background">
            <button className="hover:text-primary transition-colors font-black tracking-wide">PRIVACY</button>
            <span className="font-black">•</span>
            <button className="hover:text-primary transition-colors font-black tracking-wide">TERMS</button>
          </div>
        </div>
      </div>
    </div>
  );
}