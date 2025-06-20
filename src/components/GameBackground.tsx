import React from 'react';
import { generateStars } from '../lib/game-utils';

interface GameBackgroundProps {
  width: number;
  height: number;
}

const GameBackground: React.FC<GameBackgroundProps> = ({ width, height }) => {
  // Generate 100 stars with randomized positions
  const [stars] = React.useState(() => generateStars(100, width, height));
  
  return (
    <div 
      className="stars" 
      aria-hidden="true"
      style={{ width, height }}
    >
      {/* Center dividing line */}
      <div 
        style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          height: '100%',
          width: '2px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          transform: 'translateX(-50%)',
          zIndex: 1
        }}
      />
      
      {/* Nebula-like gradient backgrounds */}
      <div
        style={{
          position: 'absolute',
          left: '10%',
          top: '20%',
          width: '40%',
          height: '50%',
          background: 'radial-gradient(circle, rgba(123, 31, 162, 0.1) 0%, rgba(32, 0, 44, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          zIndex: 1
        }}
      />
      
      <div
        style={{
          position: 'absolute',
          right: '20%',
          bottom: '15%',
          width: '35%',
          height: '40%',
          background: 'radial-gradient(circle, rgba(0, 82, 212, 0.1) 0%, rgba(0, 18, 50, 0) 70%)',
          borderRadius: '50%',
          filter: 'blur(30px)',
          zIndex: 1
        }}
      />
      
      {/* Stars with twinkling effect */}
      {stars.map((star, index) => (
        <div
          key={index}
          className="star"
          style={{
            left: `${star.x}px`,
            top: `${star.y}px`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            zIndex: 2
          }}
        />
      ))}
    </div>
  );
};

export default GameBackground;