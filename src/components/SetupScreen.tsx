import { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { saveUserData } from '../utils/storage';
import { toast } from 'sonner@2.0.3';
import { CalendarIcon } from 'lucide-react';

interface SetupScreenProps {
  onNavigate: (screen: 'welcome' | 'setup' | 'calendar') => void;
}

export function SetupScreen({ onNavigate }: SetupScreenProps) {
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [cycleLength, setCycleLength] = useState('28');
  const [periodLength, setPeriodLength] = useState('5');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lastPeriodDate) {
      toast.error('Please select your last period date');
      return;
    }

    const cycle = parseInt(cycleLength);
    const period = parseInt(periodLength);

    if (cycle < 21 || cycle > 35) {
      toast.error('Cycle length should be between 21-35 days');
      return;
    }

    if (period < 3 || period > 8) {
      toast.error('Period length should be between 3-8 days');
      return;
    }

    if (period >= cycle) {
      toast.error('Period length cannot be longer than cycle length');
      return;
    }

    setIsLoading(true);

    try {
      await saveUserData({
        lastPeriodDate,
        cycleLength: cycle,
        periodLength: period,
      });
      
      toast.success('Your data has been saved!');
      setTimeout(() => {
        onNavigate('calendar');
      }, 1000);
    } catch (error) {
      console.error('Error saving user data:', error);
      toast.error('Failed to save your data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get today's date for max date validation
  const today = new Date().toISOString().split('T')[0];
  // Get date 60 days ago for min date validation
  const minDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto"
            >
              <CalendarIcon className="w-8 h-8 text-primary" />
            </motion.div>
            
            <CardTitle className="text-2xl">Set Up Your Cycle</CardTitle>
            <CardDescription>
              Help us understand your menstrual cycle to provide personalized insights
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="lastPeriod">When did your last period start?</Label>
                <Input
                  id="lastPeriod"
                  type="date"
                  value={lastPeriodDate}
                  onChange={(e) => setLastPeriodDate(e.target.value)}
                  min={minDate}
                  max={today}
                  className="w-full"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Select the first day of your most recent period
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="space-y-2"
              >
                <Label htmlFor="cycleLength">How long is your cycle?</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="cycleLength"
                    type="number"
                    min="21"
                    max="35"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Average is 28 days (21-35 days is normal)
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <Label htmlFor="periodLength">How long does your period last?</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="periodLength"
                    type="number"
                    min="3"
                    max="8"
                    value={periodLength}
                    onChange={(e) => setPeriodLength(e.target.value)}
                    className="flex-1"
                    required
                  />
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Average is 5 days (3-8 days is normal)
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Continue to Calendar'
                  )}
                </Button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 bg-muted/50 rounded-lg"
            >
              <p className="text-sm text-muted-foreground text-center">
                🔒 Your data is stored securely on your device and never shared
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}