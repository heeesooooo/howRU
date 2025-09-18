import { Calendar, Settings, ChevronLeft, ChevronRight, X, Star, Cloud, Heart, Sparkles, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getUserData, calculatePhases, clearUserData } from '../utils/storage';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';

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

  // Get phase details for selected day
  const getPhaseDetails = (day: number) => {
    const phase = getCyclePhaseForDate(day);
    
    switch (phase) {
      case 'menstrual':
        return {
          phase: 'Menstrual Phase',
          description: `This is your period time. Your body is shedding the uterine lining, and hormone levels (estrogen and progesterone) are at their lowest.

You might experience cramps, back pain, headaches, and fatigue. Mood swings and increased sensitivity are also common.

Take it easy with gentle activities. Avoid intense exercise and cold foods. Use heating pads for comfort and get plenty of rest.

Try warm teas, iron-rich foods like spinach, magnesium-rich dark chocolate, and anti-inflammatory ginger tea. Light stretching and meditation can help you feel more comfortable.`
        };
      case 'follicular':
        return {
          phase: 'Follicular Phase',
          description: `Your estrogen levels are gradually rising as your ovaries prepare to release an egg. This is a time of renewal and growth.

You'll likely feel more energetic, focused, and optimistic. Your skin condition improves, and you feel more social and confident.

This is a great time for exercise and new challenges. Your body can handle more intense workouts.

Focus on protein-rich foods like chicken breast, vitamin B-rich brown rice, and plenty of fresh fruits and vegetables. This is perfect for starting new projects or social activities.`
        };
      case 'ovulation':
        return {
          phase: 'Ovulation Phase',
          description: `Estrogen peaks and LH (luteinizing hormone) surges, triggering ovulation. This is your most fertile time.

Your energy and confidence are at their highest. You might notice increased libido and a slight rise in body temperature. Some women experience ovulation pain.

You're at your peak performance, so engage actively in most activities, but avoid excessive stress.

Eat antioxidant-rich berries, omega-3 rich salmon and nuts, and folate-rich leafy greens. This is ideal for high-intensity workouts, new projects, or important meetings.`
        };
      case 'luteal':
        return {
          phase: 'Luteal Phase',
          description: `Progesterone levels rise, causing body temperature to increase and various physical changes. This is the PMS phase.

You might experience bloating, breast tenderness, mood changes, increased appetite, and irritability. Sleep quality may decrease.

Choose lighter activities over intense exercise. Reduce caffeine and sodium intake while staying well hydrated.

Try magnesium-rich almonds, vitamin B6-rich bananas, serotonin-boosting turkey, and anti-inflammatory turmeric tea. Yoga, gentle walks, and reading can help calm your mind.`
        };
      default:
        return { phase: '', description: '' };
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

        {/* Current cycle status */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-card border-b-4 border-foreground p-4"
        >
          <div className="text-center">
            <p className="text-sm font-bold text-muted-foreground">CYCLE DAY</p>
            <p className="text-3xl font-black text-foreground">{cycleInfo.currentCycleDay}</p>
            <p className="text-xs font-bold text-muted-foreground tracking-wide">
              {cycleInfo.currentPhase.toUpperCase()} PHASE
            </p>
          </div>
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
                  <span className="text-card-foreground font-bold">Menstrual (Days 1-{userData.periodLength})</span>
                </div>
                <div className="flex items-center gap-4 p-4 border-4 border-foreground bg-accent">
                  <div className="w-6 h-6 bg-[#F2AF5C] border-2 border-foreground rounded-full"></div>
                  <span className="text-card-foreground font-bold">Follicular (Days {userData.periodLength + 1}-13)</span>
                </div>
                <div className="flex items-center gap-4 p-4 border-4 border-foreground bg-accent">
                  <div className="w-6 h-6 bg-[#F2CA50] border-2 border-foreground rounded-full"></div>
                  <span className="text-card-foreground font-bold">Ovulation (Days 14-15)</span>
                </div>
                <div className="flex items-center gap-4 p-4 border-4 border-foreground bg-accent">
                  <div className="w-6 h-6 bg-[#74A65D] border-2 border-foreground rounded-full"></div>
                  <span className="text-card-foreground font-bold">Luteal (Days 16-{userData.cycleLength})</span>
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
              <h3 className="font-black text-foreground text-xl tracking-wide">DAY {selectedDay} INFO</h3>
              <p className="text-sm text-muted-foreground font-bold tracking-wide">
                {getPhaseDetails(selectedDay).phase.toUpperCase()}
              </p>
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