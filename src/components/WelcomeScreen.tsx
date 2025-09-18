import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface WelcomeScreenProps {
  onNavigate: (screen: 'welcome' | 'setup' | 'calendar') => void;
}

export function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = 'HOWRU';

  useEffect(() => {
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 300); // 300ms 간격으로 한 글자씩

    return () => clearInterval(typingInterval);
  }, []);

  const handleContinue = () => {
    onNavigate('setup');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      {/* 타이핑 애니메이션 */}
      <div className="text-center mb-12">
        <h1 className="text-6xl md:text-8xl font-bold text-foreground mb-4">
          {displayedText}
          {!isTypingComplete && (
            <span className="animate-pulse">|</span>
          )}
        </h1>
        
        {/* 애니메이션 완료 후 나타나는 부제목과 버튼 */}
        {isTypingComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <p className="text-xl md:text-2xl text-muted-foreground">
              Track your cycle, understand your body
            </p>
            
            <motion.button
              onClick={handleContinue}
              className="group relative px-8 py-4 bg-primary text-primary-foreground rounded-xl 
                         hover:bg-primary/90 transition-all duration-300 transform hover:scale-105
                         shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 font-medium text-lg">
                How Are U
              </span>
              
              {/* 호버 효과 */}
              <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 
                            group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* 장식 요소 */}
      {isTypingComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-muted-foreground rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2 
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}