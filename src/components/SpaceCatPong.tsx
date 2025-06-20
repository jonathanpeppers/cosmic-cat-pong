import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useKV } from '@github/spark/hooks';
import { Button } from '@/components/ui/button';
import { Info } from '@phosphor-icons/react';
import CatPaddle from './CatPaddle';
import PlanetBall from './PlanetBall';
import GameBackground from './GameBackground';
import ScoreDisplay from './ScoreDisplay';
import GameControls from './GameControls';
import GameInstructions from './GameInstructions';
import { 
  calculateBounce, 
  checkCollision, 
  getInitialVelocity 
} from '@/lib/game-utils';

const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 50;
const PLANET_SIZE = 40;
const PADDLE_SPEED = 10;
const INITIAL_PLANET_SPEED = 3;
const WINNING_SCORE = 10;

// Speed multipliers for different speed settings
const SPEED_MULTIPLIERS = {
  slow: 0.6,
  normal: 1.0,
  fast: 1.5
};

// Bounce speed increase for different speed settings
const BOUNCE_INCREASE = {
  slow: 1.01,
  normal: 1.02,
  fast: 1.03
};

const SpaceCatPong: React.FC = () => {
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 800, height: 600 });
  
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [leftPaddlePos, setLeftPaddlePos] = useState(0);
  const [rightPaddlePos, setRightPaddlePos] = useState(0);
  const [planetPos, setPlanetPos] = useState({ x: 0, y: 0 });
  const [planetVelocity, setPlanetVelocity] = useState({ x: 0, y: 0 });
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [winner, setWinner] = useState<'left' | 'right' | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [speedSetting, setSpeedSetting] = useKV('space-cat-pong-speed', 'slow' as 'slow' | 'normal' | 'fast');
  
  // Persistent high score from KV storage
  const [highScore, setHighScore] = useKV('space-cat-pong-high-score', 0);
  
  // Track pressed keys to allow smooth movement
  const pressedKeys = useRef<{ [key: string]: boolean }>({});
  
  // Animation frame ID for cleanup
  const animationFrameId = useRef<number | null>(null);
  
  // Calculate current speed based on speed setting
  const getAdjustedSpeed = useCallback((baseSpeed: number) => {
    return baseSpeed * SPEED_MULTIPLIERS[speedSetting];
  }, [speedSetting]);
  
  // Initialize the game
  const initializeGame = useCallback(() => {
    if (!gameContainerRef.current) return;
    
    const rect = gameContainerRef.current.getBoundingClientRect();
    setContainerSize({ width: rect.width, height: rect.height });
    
    // Center paddles vertically
    const initialPaddlePos = (rect.height - PADDLE_HEIGHT) / 2;
    setLeftPaddlePos(initialPaddlePos);
    setRightPaddlePos(initialPaddlePos);
    
    // Position planet in the center
    setPlanetPos({
      x: (rect.width - PLANET_SIZE) / 2,
      y: (rect.height - PLANET_SIZE) / 2
    });
    
    // Set initial velocity adjusted for speed setting
    setPlanetVelocity(getInitialVelocity(getAdjustedSpeed(INITIAL_PLANET_SPEED)));
    
    // Reset scores and winner
    setLeftScore(0);
    setRightScore(0);
    setWinner(null);
  }, [getAdjustedSpeed]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!gameContainerRef.current) return;
      
      const rect = gameContainerRef.current.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
      
      // Also reposition paddles and planet proportionally
      const widthRatio = rect.width / containerSize.width;
      const heightRatio = rect.height / containerSize.height;
      
      setLeftPaddlePos(leftPaddlePos * heightRatio);
      setRightPaddlePos(rightPaddlePos * heightRatio);
      
      setPlanetPos({
        x: planetPos.x * widthRatio,
        y: planetPos.y * heightRatio
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [containerSize.height, containerSize.width, leftPaddlePos, planetPos.x, planetPos.y, rightPaddlePos]);
  
  // Initialize game when component mounts
  useEffect(() => {
    initializeGame();
  }, [initializeGame]);
  
  // Handle speed setting changes
  useEffect(() => {
    if (!isPlaying) {
      // Adjust planet velocity based on new speed setting
      setPlanetVelocity(prev => {
        const currentSpeed = Math.sqrt(prev.x * prev.x + prev.y * prev.y);
        if (currentSpeed === 0) return prev;
        
        const newSpeed = getAdjustedSpeed(INITIAL_PLANET_SPEED);
        const ratio = newSpeed / currentSpeed;
        
        return {
          x: prev.x * ratio,
          y: prev.y * ratio
        };
      });
    }
  }, [speedSetting, isPlaying, getAdjustedSpeed]);
  
  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setIsPlaying(playing => !playing);
        return;
      }
      
      pressedKeys.current[e.key] = true;
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Main game loop
  useEffect(() => {
    if (!isPlaying || winner) return;
    
    const gameLoop = () => {
      // Update paddle positions based on pressed keys
      const keys = pressedKeys.current;
      
      // Left paddle (W/S keys)
      if (keys['w'] || keys['W']) {
        setLeftPaddlePos(pos => Math.max(0, pos - PADDLE_SPEED));
      }
      if (keys['s'] || keys['S']) {
        setLeftPaddlePos(pos => Math.min(containerSize.height - PADDLE_HEIGHT, pos + PADDLE_SPEED));
      }
      
      // Right paddle (Arrow keys)
      if (keys['ArrowUp']) {
        setRightPaddlePos(pos => Math.max(0, pos - PADDLE_SPEED));
      }
      if (keys['ArrowDown']) {
        setRightPaddlePos(pos => Math.min(containerSize.height - PADDLE_HEIGHT, pos + PADDLE_SPEED));
      }
      
      // Update planet position
      setPlanetPos(pos => ({
        x: pos.x + planetVelocity.x,
        y: pos.y + planetVelocity.y
      }));
      
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };
    
    animationFrameId.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [containerSize.height, isPlaying, planetVelocity.x, planetVelocity.y, winner]);
  
  // Handle collisions and boundaries
  useEffect(() => {
    if (!isPlaying) return;
    
    // Check for top/bottom wall collision
    if (planetPos.y <= 0 || planetPos.y + PLANET_SIZE >= containerSize.height) {
      setPlanetVelocity(velocity => ({
        x: velocity.x,
        y: -velocity.y
      }));
    }
    
    // Check for paddle collisions
    const leftPaddleObj = {
      x: 10,
      y: leftPaddlePos,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    };
    
    const rightPaddleObj = {
      x: containerSize.width - 10 - PADDLE_WIDTH,
      y: rightPaddlePos,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT
    };
    
    const planetObj = {
      x: planetPos.x,
      y: planetPos.y,
      width: PLANET_SIZE,
      height: PLANET_SIZE
    };
    
    // Check for collision with left paddle
    if (checkCollision(planetObj, leftPaddleObj) && planetVelocity.x < 0) {
      // Calculate bounce based on where on the paddle it hit
      const hitPosition = (planetPos.y + PLANET_SIZE / 2) - (leftPaddlePos + PADDLE_HEIGHT / 2);
      const normalizedHit = hitPosition / (PADDLE_HEIGHT / 2);
      
      // Adjust the bounce angle based on where it hit the paddle
      const bounceVelocity = calculateBounce(
        planetVelocity,
        { x: 1, y: normalizedHit * 0.5 },  // Tilting the normal based on hit position
        BOUNCE_INCREASE[speedSetting]  // Speed increase based on difficulty
      );
      
      setPlanetVelocity(bounceVelocity);
    }
    
    // Check for collision with right paddle
    if (checkCollision(planetObj, rightPaddleObj) && planetVelocity.x > 0) {
      // Calculate bounce based on where on the paddle it hit
      const hitPosition = (planetPos.y + PLANET_SIZE / 2) - (rightPaddlePos + PADDLE_HEIGHT / 2);
      const normalizedHit = hitPosition / (PADDLE_HEIGHT / 2);
      
      // Adjust the bounce angle based on where it hit the paddle
      const bounceVelocity = calculateBounce(
        planetVelocity,
        { x: -1, y: normalizedHit * 0.5 },  // Tilting the normal based on hit position
        BOUNCE_INCREASE[speedSetting]  // Speed increase based on difficulty
      );
      
      setPlanetVelocity(bounceVelocity);
    }
    
    // Check for scoring (planet out of bounds)
    if (planetPos.x < 0) {
      // Right player scores
      setRightScore(prev => {
        const newScore = prev + 1;
        
        // Check for win
        if (newScore >= WINNING_SCORE) {
          setWinner('right');
          setIsPlaying(false);
          
          // Check if this is a new high score
          const totalScore = newScore + leftScore;
          if (totalScore > highScore) {
            setHighScore(totalScore);
          }
        }
        
        return newScore;
      });
      
      // Reset planet position
      resetPlanet('right');
    }
    else if (planetPos.x + PLANET_SIZE > containerSize.width) {
      // Left player scores
      setLeftScore(prev => {
        const newScore = prev + 1;
        
        // Check for win
        if (newScore >= WINNING_SCORE) {
          setWinner('left');
          setIsPlaying(false);
          
          // Check if this is a new high score
          const totalScore = newScore + rightScore;
          if (totalScore > highScore) {
            setHighScore(totalScore);
          }
        }
        
        return newScore;
      });
      
      // Reset planet position
      resetPlanet('left');
    }
  }, [
    containerSize.height, 
    containerSize.width, 
    highScore, 
    isPlaying, 
    leftPaddlePos, 
    leftScore,
    planetPos.x, 
    planetPos.y, 
    planetVelocity, 
    rightPaddlePos, 
    rightScore,
    setHighScore,
    speedSetting
  ]);
  
  // Reset planet position after scoring
  const resetPlanet = (scorer: 'left' | 'right') => {
    // Position planet in the center
    setPlanetPos({
      x: (containerSize.width - PLANET_SIZE) / 2,
      y: (containerSize.height - PLANET_SIZE) / 2
    });
    
    // Set initial velocity in the direction of whoever just scored
    const direction = scorer === 'left' ? -1 : 1;
    const angle = (Math.random() * Math.PI / 4) - (Math.PI / 8); // -22.5 to 22.5 degrees
    
    const speed = getAdjustedSpeed(INITIAL_PLANET_SPEED);
    
    setPlanetVelocity({
      x: Math.cos(angle) * speed * direction,
      y: Math.sin(angle) * speed * (Math.random() > 0.5 ? 1 : -1)
    });
    
    // Short pause before continuing
    setIsPlaying(false);
    setTimeout(() => setIsPlaying(true), 1000);
  };
  
  const handleGameReset = () => {
    initializeGame();
    setIsPlaying(false);
  };
  
  const handleSpeedChange = (speed: 'slow' | 'normal' | 'fast') => {
    setSpeedSetting(speed);
  };
  
  return (
    <div 
      ref={gameContainerRef}
      className="game-container bg-background relative w-full h-full min-h-screen overflow-hidden"
    >
      {/* Game background */}
      <GameBackground 
        width={containerSize.width}
        height={containerSize.height}
      />
      
      {/* Score display */}
      <ScoreDisplay 
        leftScore={leftScore}
        rightScore={rightScore}
        highScore={highScore}
      />
      
      {/* Game elements */}
      <CatPaddle 
        isLeft={true}
        position={leftPaddlePos}
        height={PADDLE_HEIGHT}
        width={PADDLE_WIDTH}
      />
      
      <CatPaddle 
        isLeft={false}
        position={rightPaddlePos}
        height={PADDLE_HEIGHT}
        width={PADDLE_WIDTH}
      />
      
      <PlanetBall 
        position={planetPos}
        size={PLANET_SIZE}
      />
      
      {/* Game controls */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-3">
        <GameControls 
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onReset={handleGameReset}
          speed={speedSetting}
          onSpeedChange={handleSpeedChange}
        />
        
        <Button
          className="text-xs text-muted-foreground flex items-center gap-1 bg-transparent hover:bg-card/20"
          onClick={() => setShowInstructions(true)}
        >
          <Info size={12} />
          How to Play
        </Button>
      </div>
      
      {/* Game over message */}
      {winner && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="bg-card p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-2 font-exo">
              {winner === 'left' ? 'Left Cat' : 'Right Cat'} Wins!
            </h2>
            <p className="mb-4">Final Score: {leftScore} - {rightScore}</p>
            <button
              onClick={handleGameReset}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium shadow-md"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {/* Instructions modal */}
      <GameInstructions
        visible={showInstructions}
        onClose={() => setShowInstructions(false)}
      />
    </div>
  );
};

export default SpaceCatPong;
