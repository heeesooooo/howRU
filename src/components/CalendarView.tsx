import { Calendar, Settings, ChevronLeft, ChevronRight, X, Star, Cloud, Heart, Sparkles, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserData, calculatePhases, clearUserData } from '../utils/storage';
import { motion } from 'motion/react';
import { toast } from 'sonner';

interface CalendarViewProps {
  onDayClick: (day: number) => void;
  onNavigate: (screen: 'welcome' | 'setup' | 'calendar') => void;
}

interface UserData {
  lastPeriodDate: string;
  cycleLength: number;
  periodLength: number;
}

export function CalendarView({ onDayClick, onNavigate }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(0);
  const [showLegend, setShowLegend] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const data = await getUserData();
      if (data) {
        setUserData(data);
      } else {
        // No user data found, redirect to setup
        onNavigate('setup');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      onNavigate('setup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await clearUserData();
      toast.success('Data cleared successfully');
      onNavigate('welcome');
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  // Localized phase label and short tip for current status UI
  const getPhaseMeta = (phaseKey: string) => {
    switch (phaseKey) {
      case 'menstrual':
        return { phase: '휴식 기간', shortTip: '몸을 쉬게 하고 따뜻하게 챙겨주세요' };
      case 'follicular':
        return { phase: '에너지 업 기간', shortTip: '새로운 도전을 시작하기 좋은 때예요' };
      case 'ovulation':
        return { phase: '스파크 기간', shortTip: '활력이 최고조! 하지만 무리하지 않게' };
      case 'luteal':
        return { phase: '컨트롤 기간', shortTip: '컨디션 조절에 신경써주세요' };
      default:
        return { phase: '', shortTip: '' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-foreground">Loading your cycle data...</div>
      </div>
    );
  }

  if (!userData) {
    return null; // This shouldn't happen as we redirect to setup
  }

  const cycleInfo = calculatePhases(userData.lastPeriodDate, userData.cycleLength, userData.periodLength);
  
  // Get current date info
  const today = new Date();
  const currentDate = today.getDate();
  const currentMonthIndex = today.getMonth();

  // Generate calendar for current month
  const generateCalendarDays = () => {
    const year = today.getFullYear();
    const month = currentMonthIndex + currentMonth;
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sunday

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };

  // Get cycle phase for a specific date
  const getCyclePhaseForDate = (day: number) => {
    if (!userData) return 'neutral';
    
    const year = today.getFullYear();
    const month = currentMonthIndex + currentMonth;
    const date = new Date(year, month, day);
    const lastPeriodDate = new Date(userData.lastPeriodDate);
    
    // Calculate days since last period
    const daysSinceStart = Math.floor((date.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentCycleDay = ((daysSinceStart % userData.cycleLength) + userData.cycleLength) % userData.cycleLength + 1;
    
    if (currentCycleDay >= 1 && currentCycleDay <= userData.periodLength) return 'menstrual';
    if (currentCycleDay >= userData.periodLength + 1 && currentCycleDay <= 13) return 'follicular';
    if (currentCycleDay >= 14 && currentCycleDay <= 15) return 'ovulation';
    if (currentCycleDay >= 16 && currentCycleDay <= userData.cycleLength) return 'luteal';
    
    return 'neutral';
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'menstrual': return 'bg-[#F2762E]'; // Warm Orange
      case 'follicular': return 'bg-[#F2AF5C]'; // Golden Peach  
      case 'ovulation': return 'bg-[#F2CA50]'; // Sunny Yellow
      case 'luteal': return 'bg-[#74A65D]'; // Sage Green
      default: return 'bg-muted';
    }
  };

  // Format selected day into 'YYYY년 M월 D일 요일'
  const formatSelectedDate = (day: number) => {
    const date = new Date(today.getFullYear(), currentMonthIndex + currentMonth, day);
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const w = weekdays[date.getDay()];
    return `${y}년 ${m}월 ${d}일 ${w}`;
  };

  // Get phase details for selected day
 const getPhaseDetails = (day: number) => {
  const phase = getCyclePhaseForDate(day);

  switch (phase) {
    case 'menstrual':
      return {
        phase: '휴식 기간',
        shortTip: '몸을 쉬게 하고 따뜻하게 챙겨주세요',
        description: `몸을 비우고 회복하는 시기예요. 에스트로겐과 프로게스테론이 가장 낮아
컨디션이 쉽게 떨어질 수 있습니다.

복통이나 허리 통증, 두통, 피로감, 감정 기복이 올 수 있으니
스스로를 잘 돌보며 푹 쉬어주세요.

무리한 운동은 피하고 가벼운 스트레칭이나 명상이 좋아요.
따뜻한 차, 철분이 풍부한 시금치, 마그네슘이 많은 다크 초콜릿,
항염 효과가 있는 생강차로 몸을 따뜻하게 챙겨보세요.`
      };
    case 'follicular':
      return {
        phase: '에너지 업 기간',
        shortTip: '새로운 도전을 시작하기 좋은 때예요',
        description: `에스트로겐이 서서히 오르면서 몸이 배란을 준비하는 단계예요.
점점 기운이 올라오고 집중력과 자신감도 함께 높아집니다.
피부 컨디션이 좋아지고 사회적 활동도 즐겁게 느껴질 수 있어요.
이 시기에는 강도 높은 운동이나 새로운 도전을 시작하기 좋습니다.
단백질이 풍부한 닭가슴살, 비타민 B가 많은 현미,
신선한 과일과 채소를 충분히 챙겨보세요.`
      };
    case 'ovulation':
      return {
        phase: '스파크 기간',
        shortTip: '활력이 최고조! 하지만 무리하지 않게',
        description: `에너지가 최고조에 이르고 배란이 일어나는 시기예요.
자신감과 활력이 가장 빛나는 때라 몸도 마음도 한층 가벼워질 수 있습니다.

체온이 살짝 오를 수 있으며, 일부는 배란통을 느끼기도 해요.
임신 가능성이 높은 시기입니다. 
활발한 활동을 즐기되 과도한 스트레스는 피해주세요.
항산화가 풍부한 베리류, 오메가3가 많은 연어와 견과류,
엽산이 많은 녹색 채소가 도움이 됩니다.`
      };
    case 'luteal':
      return {
        phase: '컨트롤 기간',
        shortTip: '컨디션 조절에 신경써주세요',
        description: `프로게스테론이 상승하면서 체온이 조금 올라가고
몸의 변화가 많은 단계입니다. PMS가 나타나기 쉬워요.

복부 팽만감, 가슴 통증, 식욕 증가, 예민함이 올 수 있으니
컨디션을 세심하게 관리해 주세요.

무리한 운동보다는 요가·가벼운 산책이 좋고,
카페인과 나트륨 섭취는 줄이며 수분을 충분히 섭취하세요.

마그네슘이 풍부한 아몬드, 비타민 B6가 많은 바나나, 항염 효과가 있는 강황차가 도움이 됩니다.`
      };
    default:
      return { phase: '', shortTip: '', description: '' };
  }
};


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const calendarDays = generateCalendarDays();
  const displayMonth = months[currentMonthIndex + currentMonth] || months[0];

  const handleDayClick = (day: number) => {
    setSelectedDay(selectedDay === day ? null : day);
    onDayClick(day);
  };

  const isToday = (day: number) => {
    return currentMonth === 0 && day === currentDate;
  };
 console.log('cycleInfo',cycleInfo)
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* Header bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary p-6 border-b-8 border-foreground"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-primary-foreground font-black text-2xl tracking-wider">HOWRU</h1>
              <p className="text-primary-foreground/80 text-sm font-bold">PERIOD TRACKER</p>
            </div>
            <div className="text-right">
              <div className="text-primary-foreground font-black text-lg">{today.getFullYear()}</div>
              <div className="text-primary-foreground/80 text-xs font-bold tracking-wide">CALENDAR</div>
            </div>
          </div>
        </motion.div>

        {/* Current cycle status - emphasize phase + short tip; Cycle Day as secondary */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border-b-4 border-foreground p-4"
        >
          {(() => {
            const meta = getPhaseMeta(cycleInfo.currentPhase);
            return (
              <div className="text-center space-y-1">
                <p className="text-2xl font-black text-foreground">
                  오늘은 {today.getFullYear()}년 {String(today.getMonth() + 1).padStart(2, '0')}월 {String(today.getDate()).padStart(2, '0')}일
                </p>
                {meta.shortTip && (
                  <p className="text-sm font-medium text-muted-foreground">{meta.shortTip}</p>
                )}
              </div>
            );
          })()}
        </motion.div>

        {/* Month navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border-b-4 border-foreground p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-foreground tracking-wider">
              {displayMonth.toUpperCase()}
            </h2>
            <div className="flex items-center border-4 border-foreground">
              <button 
                onClick={() => setCurrentMonth(currentMonth - 1)}
                className="px-4 py-2 bg-accent hover:bg-primary hover:text-primary-foreground transition-colors border-r-4 border-foreground font-black"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setCurrentMonth(currentMonth + 1)}
                className="px-4 py-2 bg-accent hover:bg-primary hover:text-primary-foreground transition-colors font-black"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Calendar content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border-8 border-foreground border-t-0"
        >
          {/* Days header */}
          <div className="grid grid-cols-7 border-b-4 border-foreground">
            {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, index) => (
              <div key={day} className="text-center py-4 border-r-4 border-foreground last:border-r-0 bg-accent">
                <span className="text-xs font-black text-foreground tracking-wide">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.01 }}
                className={`relative h-16 flex items-center justify-center cursor-pointer border-r-4 border-b-4 border-foreground last:border-r-0 transition-colors
                  ${isToday(day || 0) ? 'bg-primary text-primary-foreground font-black' : 
                    selectedDay === day ? 'bg-accent border-8 border-primary' :
                    day ? 'hover:bg-accent/70' : 'bg-muted/50'}
                `}
                onClick={() => day && handleDayClick(day)}
              >
                {day && (
                  <>
                    <span className={`font-black ${isToday(day) ? 'text-primary-foreground text-lg' : 'text-foreground'}`}>
                      {day}
                    </span>
                    {/* Period cycle indicators */}
                    {getCyclePhaseForDate(day) !== 'neutral' && (
                      <div
                        className={`absolute bottom-1 right-1 w-3 h-3 ${getPhaseColor(
                          getCyclePhaseForDate(day)
                        )} border-2 border-foreground rounded-full`}
                      />
                    )}
                  </>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Legend modal */}
        {showLegend && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLegend(false)}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card border-8 border-foreground max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary p-6 border-b-4 border-foreground">
                <div className="flex items-center justify-between">
                  <h3 className="text-primary-foreground font-black text-xl tracking-wide">CYCLE GUIDE</h3>
                  <button 
                    onClick={() => setShowLegend(false)}
                    className="w-8 h-8 bg-foreground text-background flex items-center justify-center hover:bg-foreground/80 font-black"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 border-4 border-foreground bg-accent">
                  <div className="w-6 h-6 bg-[#F2762E] border-2 border-foreground rounded-full"></div>
                  <span className="text-card-foreground font-bold">휴식 기간 (Days 1-{userData.periodLength})</span>
                </div>
                <div className="flex items-center gap-4 p-4 border-4 border-foreground bg-accent">
                  <div className="w-6 h-6 bg-[#F2AF5C] border-2 border-foreground rounded-full"></div>
                  <span className="text-card-foreground font-bold"> 에너지 업 기간 (Days {userData.periodLength + 1}-13)</span>
                </div>
                <div className="flex items-center gap-4 p-4 border-4 border-foreground bg-accent">
                  <div className="w-6 h-6 bg-[#F2CA50] border-2 border-foreground rounded-full"></div>
                  <span className="text-card-foreground font-bold">스파크 기간 (Days 14-15)</span>
                </div>
                <div className="flex items-center gap-4 p-4 border-4 border-foreground bg-accent">
                  <div className="w-6 h-6 bg-[#74A65D] border-2 border-foreground rounded-full"></div>
                  <span className="text-card-foreground font-bold">컨트롤 기간 (Days 16-{userData.cycleLength})</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Selected day details */}
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t-8 border-foreground"
          >
            <div className="bg-accent p-6 border-b-4 border-foreground">
              <h3 className="font-black text-foreground text-xl tracking-wide">{formatSelectedDate(selectedDay as number)}</h3>
              <p className="text-lg text-foreground font-black tracking-wide">
                {getPhaseDetails(selectedDay).phase}
              </p>
              {getPhaseDetails(selectedDay).shortTip && (
                <p className="text-xs text-muted-foreground font-medium tracking-wide mt-1">
                  {getPhaseDetails(selectedDay).shortTip}
                </p>
              )}
            </div>
            
            <div className="bg-card p-8 border-b-4 border-foreground">
              <div className="text-card-foreground leading-relaxed font-medium border-4 border-foreground p-4 bg-accent/50">
                {getPhaseDetails(selectedDay).description}
              </div>
            </div>
          </motion.div>
        )}

        {/* Bottom navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-foreground p-6"
        >
          <div className="flex items-center justify-center gap-4">
            <button className="px-8 py-4 bg-primary text-primary-foreground border-4 border-background hover:bg-primary/90 transition-colors font-black">
              <Calendar className="w-6 h-6" />
            </button>
            <button 
              className="px-8 py-4 border-4 border-background bg-background text-foreground hover:bg-primary hover:text-primary-foreground transition-colors font-black"
              onClick={() => setShowLegend(!showLegend)}
            >
              <Settings className="w-6 h-6" />
            </button>
            <button 
              className="px-8 py-4 border-4 border-background bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors font-black"
              onClick={handleReset}
              title="Reset all data"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}