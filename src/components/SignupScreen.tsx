import { Mail, Lock, Eye, EyeOff, Check, Star, Cloud, Heart, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { useState } from 'react';

interface SignupScreenProps {
  onNavigate: (screen: string) => void;
}

export function SignupScreen({ onNavigate }: SignupScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-primary p-6 border-b-8 border-foreground">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-foreground flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-background" />
              </div>
              <div>
                <h1 className="text-primary-foreground font-black text-xl tracking-wide">SIGN UP</h1>
                <p className="text-primary-foreground/80 text-sm font-bold">CREATE ACCOUNT</p>
              </div>
            </div>
            <div className="text-primary-foreground font-black">NEW</div>
          </div>
        </div>

        {/* Main content */}
        <div className="bg-card border-8 border-foreground border-t-0 p-8 max-h-[calc(100vh-100px)] overflow-y-auto">
          <div className="mb-8">
            <h2 className="font-black text-foreground text-xl mb-4 tracking-wide">새 계정 만들기</h2>
            <div className="border-l-8 border-primary pl-4 bg-accent p-4">
              <p className="text-muted-foreground font-bold">
                데이터 동기화를 위해 계정을 생성하세요
              </p>
            </div>
          </div>

          {/* SNS 회원가입 버튼 */}
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

          {/* 입력 필드 */}
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

            <div>
              <label className="block font-black text-foreground mb-3 text-lg">CONFIRM PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full py-4 pl-12 pr-16 border-4 border-foreground focus:border-primary focus:outline-none transition-colors font-bold text-lg"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* 체크박스 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4 p-4 border-4 border-foreground bg-accent">
              <button
                onClick={() => setAgreeTerms(!agreeTerms)}
                className={`w-8 h-8 border-4 border-foreground flex items-center justify-center flex-shrink-0 transition-colors ${
                  agreeTerms ? 'bg-primary' : 'bg-background hover:bg-accent'
                }`}
              >
                {agreeTerms && <Check className="w-5 h-5 text-primary-foreground" />}
              </button>
              <div>
                <span className="font-black text-foreground block text-lg">TERMS OF SERVICE</span>
                <span className="text-muted-foreground font-bold">이용약관에 동의합니다</span>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 border-4 border-foreground bg-accent">
              <button
                onClick={() => setAgreePrivacy(!agreePrivacy)}
                className={`w-8 h-8 border-4 border-foreground flex items-center justify-center flex-shrink-0 transition-colors ${
                  agreePrivacy ? 'bg-primary' : 'bg-background hover:bg-accent'
                }`}
              >
                {agreePrivacy && <Check className="w-5 h-5 text-primary-foreground" />}
              </button>
              <div>
                <span className="font-black text-foreground block text-lg">PRIVACY POLICY</span>
                <span className="text-muted-foreground font-bold">개인정보 처리방침에 동의합니다</span>
              </div>
            </div>
          </div>

          {/* 시작하기 버튼 */}
          <button 
            onClick={() => onNavigate('setup')}
            disabled={!agreeTerms || !agreePrivacy}
            className="w-full py-5 bg-primary text-primary-foreground border-4 border-foreground font-black text-xl tracking-wide hover:bg-primary/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed mb-6"
          >
            CREATE ACCOUNT →
          </button>

          {/* 로그인 링크 */}
          <div className="text-center mb-6">
            <span className="text-muted-foreground font-bold">이미 계정이 있나요? </span>
            <button 
              onClick={() => onNavigate('login')}
              className="text-primary hover:text-primary/80 transition-colors font-black tracking-wide"
            >
              SIGN IN
            </button>
          </div>

          {/* 안내 메시지 */}
          <div className="border-4 border-foreground bg-accent p-4 text-center">
            <p className="text-muted-foreground font-black">
              ⚠ 의료 진단 목적이 아닌 정보 제공용입니다
            </p>
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