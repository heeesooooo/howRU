import { useState, useEffect } from 'react';
import { CalendarView } from './components/CalendarView';
import { SetupScreen } from './components/SetupScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Toaster } from "sonner";
import { getUserData } from './utils/storage';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'setup' | 'calendar'>('welcome');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUserData();
  }, []);

  const checkUserData = async () => {
    try {
      const userData = await getUserData();
      if (userData && userData.lastPeriodDate && userData.cycleLength) {
        setCurrentScreen('calendar');
      } else {
        setCurrentScreen('welcome');
      }
    } catch (error) {
      console.error('Error checking user data:', error);
      setCurrentScreen('welcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDayClick = (day: number) => {
    console.log(`Selected day: ${day}`);
  };

  const handleNavigate = (screen: 'welcome' | 'setup' | 'calendar') => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-pulse text-foreground">Loading...</div>
        </div>
      );
    }

    switch (currentScreen) {
      case 'welcome':
        return <WelcomeScreen onNavigate={handleNavigate} />;
      case 'setup':
        return <SetupScreen onNavigate={handleNavigate} />;
      case 'calendar':
        return <CalendarView onDayClick={handleDayClick} onNavigate={handleNavigate} />;
      default:
        return <WelcomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {renderScreen()}
      <Toaster />
    </div>
  );
}