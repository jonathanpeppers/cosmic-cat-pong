import React from 'react';
import { generatePlanetFeatures } from '../lib/game-utils';
import { cn } from '../lib/utils';

interface PlanetBallProps {
  position: { x: number; y: number };
  size: number;
}

const PlanetBall: React.FC<PlanetBallProps> = ({ position, size }) => {
  // Generate planet features once on component creation
  const [planetFeatures] = React.useState(() => generatePlanetFeatures(size));
  
  // Randomly select a base color for the planet
  const [baseColor] = React.useState(() => {
    const colors = [
      'oklch(0.7 0.2 30)',   // Mars-like red
      'oklch(0.85 0.15 85)',  // Jupiter-like tan
      'oklch(0.8 0.1 200)',   // Neptune-like blue
      'oklch(0.7 0.2 120)',   // Green gas giant
      'oklch(0.6 0.15 300)',  // Purple alien planet
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  });
  
  // Random planet name for accessibility
  const [planetName] = React.useState(() => {
    const prefixes = ['Nova', 'Stella', 'Cosmo', 'Astra', 'Lunar', 'Nebula'];
    const suffixes = ['X', 'Prime', '9', 'B612', 'Void', 'Orbit'];
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${suffixes[Math.floor(Math.random() * suffixes.length)]}`;
  });
  
  // Planet style with current position
  const planetStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
  };
  
  // Calculate the planet's radius for SVG coordinates
  const radius = size / 2;
  
  return (
    <div 
      className="planet absolute"
      style={planetStyle}
      aria-label={`Planet ${planetName}`}
      role="img"
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Base planet circle */}
        <circle 
          cx={radius} 
          cy={radius} 
          r={radius} 
          fill={baseColor}
          filter="drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))"
        />
        
        {/* Planet rings - 50% chance to have rings */}
        {Math.random() > 0.5 && (
          <ellipse 
            cx={radius} 
            cy={radius} 
            rx={radius * 1.2} 
            ry={radius * 0.3}
            fill="none"
            stroke="oklch(0.85 0.1 80)"
            strokeWidth={radius * 0.05}
            strokeOpacity="0.7"
            transform={`rotate(${Math.floor(Math.random() * 180)} ${radius} ${radius})`}
          />
        )}
        
        {/* Planet surface features */}
        {planetFeatures.map((feature, index) => (
          <circle 
            key={index}
            cx={feature.cx}
            cy={feature.cy}
            r={feature.r}
            fill={feature.color}
            opacity="0.7"
          />
        ))}
        
        {/* Highlight to give 3D effect */}
        <circle 
          cx={radius * 0.7} 
          cy={radius * 0.7} 
          r={radius * 0.15} 
          fill="white"
          opacity="0.2"
        />
      </svg>
    </div>
  );
};

export default PlanetBall;