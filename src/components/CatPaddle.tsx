import React from 'react';
import { generateCatFeatures } from '../lib/game-utils';
import { cn } from '../lib/utils';

interface CatPaddleProps {
  isLeft: boolean;
  position: number;
  height: number;
  width: number;
}

const CatPaddle: React.FC<CatPaddleProps> = ({ isLeft, position, height, width }) => {
  // Generate unique cat features based on which side it's on
  const [catFeatures] = React.useState(() => generateCatFeatures(isLeft));
  
  // Determine paddle position based on whether it's left or right
  const paddleStyle: React.CSSProperties = {
    position: 'absolute',
    top: `${position}px`,
    left: isLeft ? '10px' : 'auto',
    right: isLeft ? 'auto' : '10px',
    height: `${height}px`,
    width: `${width}px`
  };
  
  // The face path is always the first element
  const facePath = catFeatures[0];
  
  // Ears are the 2nd and 3rd elements
  const [, leftEar, rightEar] = catFeatures;
  
  // Eyes are the 4th and 5th elements
  const [, , , leftEye, rightEye] = catFeatures;
  
  // Nose is the 6th element
  const [, , , , , nose] = catFeatures;
  
  // Mouth is the 7th element
  const [, , , , , , mouth] = catFeatures;
  
  // Whiskers are all the remaining elements
  const whiskers = catFeatures.slice(7);
  
  // Generate a random color for the cat from predefined options
  const [catColor] = React.useState(() => {
    const colors = [
      'oklch(0.85 0.05 80)',  // Light orange
      'oklch(0.75 0.06 85)',  // Dark orange
      'oklch(0.6 0.05 85)',   // Brown
      'oklch(0.9 0.03 85)',   // Cream
      'oklch(0.3 0.05 85)',   // Dark brown
      'oklch(0.7 0.05 0)',    // Gray
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });
  
  return (
    <div 
      className={cn("cat-paddle absolute", isLeft ? "left-paddle" : "right-paddle")}
      style={paddleStyle}
      data-side={isLeft ? "left" : "right"}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 50 100" 
        preserveAspectRatio="none"
      >
        {/* Cat face */}
        <path 
          d={facePath} 
          fill={catColor}
          stroke="oklch(0.2 0.05 85)" 
          strokeWidth="1"
        />
        
        {/* Ears */}
        <path 
          d={leftEar} 
          fill={catColor} 
          stroke="oklch(0.2 0.05 85)" 
          strokeWidth="1"
        />
        <path 
          d={rightEar} 
          fill={catColor} 
          stroke="oklch(0.2 0.05 85)" 
          strokeWidth="1"
        />
        
        {/* Eyes */}
        <path d={leftEye} fill="oklch(0.2 0 0)" />
        <path d={rightEye} fill="oklch(0.2 0 0)" />
        
        {/* Nose */}
        <path d={nose} fill="oklch(0.5 0.1 0)" />
        
        {/* Mouth */}
        <path 
          d={mouth} 
          fill="none" 
          stroke="oklch(0.2 0.05 85)" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Whiskers */}
        {whiskers.map((whisker, index) => (
          <path 
            key={index} 
            d={whisker} 
            fill="none" 
            stroke="oklch(0.8 0 0)" 
            strokeWidth="0.8"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
};

export default CatPaddle;