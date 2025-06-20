import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  leftScore: number;
  rightScore: number;
  highScore: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  leftScore, 
  rightScore, 
  highScore 
}) => {
  // Track previous scores to animate when they change
  const [prevLeftScore, setPrevLeftScore] = React.useState(leftScore);
  const [prevRightScore, setPrevRightScore] = React.useState(rightScore);
  
  // Animation states
  const [leftFlash, setLeftFlash] = React.useState(false);
  const [rightFlash, setRightFlash] = React.useState(false);
  
  React.useEffect(() => {
    // If left score changed, trigger animation
    if (leftScore !== prevLeftScore) {
      setLeftFlash(true);
      setPrevLeftScore(leftScore);
      
      // Reset animation after it completes
      const timer = setTimeout(() => setLeftFlash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [leftScore, prevLeftScore]);
  
  React.useEffect(() => {
    // If right score changed, trigger animation
    if (rightScore !== prevRightScore) {
      setRightFlash(true);
      setPrevRightScore(rightScore);
      
      // Reset animation after it completes
      const timer = setTimeout(() => setRightFlash(false), 500);
      return () => clearTimeout(timer);
    }
  }, [rightScore, prevRightScore]);
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4 items-center">
      <Card className="bg-card/60 backdrop-blur-md p-3 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <h3 className="font-exo text-sm text-muted-foreground">LEFT</h3>
            <p 
              className={cn(
                "text-3xl font-bold font-exo text-secondary", 
                leftFlash && "score-flash"
              )}
            >
              {leftScore}
            </p>
          </div>
          
          <div className="text-center text-muted-foreground">VS</div>
          
          <div className="text-center">
            <h3 className="font-exo text-sm text-muted-foreground">RIGHT</h3>
            <p 
              className={cn(
                "text-3xl font-bold font-exo text-primary", 
                rightFlash && "score-flash"
              )}
            >
              {rightScore}
            </p>
          </div>
        </div>
      </Card>
      
      {highScore > 0 && (
        <Card className="bg-card/30 backdrop-blur-sm p-2 shadow-md">
          <div className="text-center">
            <h3 className="font-exo text-xs text-muted-foreground">HIGH</h3>
            <p className="text-xl font-bold font-exo text-accent">{highScore}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ScoreDisplay;