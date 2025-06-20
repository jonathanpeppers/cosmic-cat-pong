import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, ArrowClockwise } from '@phosphor-icons/react';

interface GameControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
}

const GameControls: React.FC<GameControlsProps> = ({ 
  isPlaying, 
  onTogglePlay, 
  onReset 
}) => {
  return (
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
  );
};

export default GameControls;