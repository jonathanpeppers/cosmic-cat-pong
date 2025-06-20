import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  ArrowClockwise,
  Gauge
} from '@phosphor-icons/react';

interface GameControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  speed: 'slow' | 'normal' | 'fast';
  onSpeedChange: (speed: 'slow' | 'normal' | 'fast') => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  onReset,
  speed,
  onSpeedChange
}) => {
  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="controls flex gap-3">
        <Button
          variant="secondary"
          size="sm"
          className="backdrop-blur-sm bg-secondary/80"
          onClick={onTogglePlay}
          aria-label={isPlaying ? "Pause game" : "Play game"}
        >
          {isPlaying ? <Pause weight="fill" /> : <Play weight="fill" />}
          <span className="ml-2">{isPlaying ? "Pause" : "Play"}</span>
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="backdrop-blur-sm bg-card/30"
          onClick={onReset}
          aria-label="Reset game"
        >
          <ArrowClockwise weight="bold" />
          <span className="ml-2">Reset</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-2">
        <Gauge size={16} className="text-muted-foreground" />
        <div className="flex bg-card/30 rounded-md backdrop-blur-sm">
          <Button
            variant={speed === 'slow' ? "secondary" : "ghost"}
            size="sm"
            className={`h-7 px-2 ${speed === 'slow' ? 'bg-secondary/80' : 'bg-transparent'}`}
            onClick={() => onSpeedChange('slow')}
          >
            Slow
          </Button>
          <Button
            variant={speed === 'normal' ? "secondary" : "ghost"}
            size="sm" 
            className={`h-7 px-2 ${speed === 'normal' ? 'bg-secondary/80' : 'bg-transparent'}`}
            onClick={() => onSpeedChange('normal')}
          >
            Normal
          </Button>
          <Button
            variant={speed === 'fast' ? "secondary" : "ghost"}
            size="sm"
            className={`h-7 px-2 ${speed === 'fast' ? 'bg-secondary/80' : 'bg-transparent'}`}
            onClick={() => onSpeedChange('fast')}
          >
            Fast
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameControls;