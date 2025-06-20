import React from 'react';
import { Card } from '@/components/ui/card';
import { Keyboard, Info, Gauge } from '@phosphor-icons/react';

interface GameInstructionsProps {
  onClose: () => void;
  visible: boolean;
}

const GameInstructions: React.FC<GameInstructionsProps> = ({ onClose, visible }) => {
  if (!visible) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-card p-6 shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <Info weight="fill" className="text-primary h-6 w-6" />
            <h2 className="text-xl font-bold font-exo">How to Play</h2>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-muted rounded-full p-1 hover:bg-muted/80 transition-colors"
            aria-label="Close instructions"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18" /><path d="m6 6 12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-4">
          <p className="text-foreground/90">
            Welcome to Space Cat Pong! Control the cat paddles to bounce the planet back and forth.
          </p>
          
          <div className="bg-muted/30 p-3 rounded-lg">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <Keyboard weight="fill" className="text-secondary" />
              Controls
            </h3>
            
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span>Left Cat:</span>
                <div className="flex gap-2">
                  <span className="bg-background px-2 py-1 rounded text-xs">W</span>
                  <span className="bg-background px-2 py-1 rounded text-xs">S</span>
                </div>
              </li>
              <li className="flex justify-between">
                <span>Right Cat:</span>
                <div className="flex gap-2">
                  <span className="bg-background px-2 py-1 rounded text-xs">↑</span>
                  <span className="bg-background px-2 py-1 rounded text-xs">↓</span>
                </div>
              </li>
              <li className="flex justify-between">
                <span>Pause Game:</span>
                <span className="bg-background px-2 py-1 rounded text-xs">Space</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-muted/30 p-3 rounded-lg">
            <h3 className="flex items-center gap-2 font-medium mb-2">
              <Gauge weight="fill" className="text-primary" />
              Game Speed
            </h3>
            <p className="text-foreground/80 text-sm">
              Adjust the planet's speed using the speed controls at the bottom of the screen:
            </p>
            <ul className="mt-2 space-y-1 text-sm">
              <li className="flex justify-between">
                <span>Slow:</span>
                <span>Beginner friendly, relaxed gameplay</span>
              </li>
              <li className="flex justify-between">
                <span>Normal:</span>
                <span>Standard challenge</span>
              </li>
              <li className="flex justify-between">
                <span>Fast:</span>
                <span>For experienced players</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Scoring:</h3>
            <p className="text-foreground/80">
              Score a point when the other player misses the planet. First to 10 wins!
            </p>
          </div>
          
          <div className="flex justify-end">
            <button 
              onClick={onClose}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow-md hover:bg-primary/90 transition-colors"
            >
              Let's Play!
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameInstructions;