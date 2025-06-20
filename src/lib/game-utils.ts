// Game physics and helper functions

/**
 * Calculate new velocity after a collision
 */
export const calculateBounce = (
  velocity: { x: number; y: number },
  normal: { x: number; y: number },
  speedIncrease = 1.02
): { x: number; y: number } => {
  // Calculate the dot product of velocity and normal
  const dot = velocity.x * normal.x + velocity.y * normal.y;

  // Calculate the reflection vector and apply a speed increase
  const newVelocity = {
    x: (velocity.x - 2 * dot * normal.x) * speedIncrease,
    y: (velocity.y - 2 * dot * normal.y) * speedIncrease
  };
  
  // Limit the maximum speed to prevent it from getting too fast
  const speed = Math.sqrt(newVelocity.x * newVelocity.x + newVelocity.y * newVelocity.y);
  const maxSpeed = 12; // Cap the maximum speed
  
  if (speed > maxSpeed) {
    const ratio = maxSpeed / speed;
    newVelocity.x *= ratio;
    newVelocity.y *= ratio;
  }
  
  return newVelocity;
};

/**
 * Check if two objects are colliding using basic rectangle collision
 */
export const checkCollision = (
  obj1: { x: number; y: number; width: number; height: number },
  obj2: { x: number; y: number; width: number; height: number }
): boolean => {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
};

/**
 * Get a random number between min and max
 */
export const randomNumber = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

/**
 * Calculate initial velocity for the planet with a random direction
 */
export const getInitialVelocity = (speed = 3): { x: number; y: number } => {
  // Generate a random angle in radians, but limit it to avoid very shallow angles
  const minAngle = Math.PI / 6; // 30 degrees
  const maxAngle = Math.PI / 3; // 60 degrees
  
  const randomAngle = randomNumber(minAngle, maxAngle);
  
  // Randomly choose direction (left or right)
  const direction = Math.random() > 0.5 ? 1 : -1;
  
  // Convert angle to velocity components
  return {
    x: Math.cos(randomAngle) * speed * direction,
    y: Math.sin(randomAngle) * speed * (Math.random() > 0.5 ? 1 : -1)
  };
};

/**
 * Generate randomized star positions for the background
 */
export const generateStars = (
  count: number, 
  width: number, 
  height: number
): Array<{ x: number; y: number; size: number; delay: number }> => {
  const stars = [];
  
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1, // 1-3px
      delay: Math.random() * 3 // 0-3s delay for twinkling
    });
  }
  
  return stars;
};

/**
 * Generate cat paddle svg paths with random features
 * Returns an array of paths for cat ears, face, and other features
 */
export const generateCatFeatures = (isLeftPaddle: boolean): string[] => {
  // Base cat face is a rounded rectangle
  const face = `M0,10 
    a10,10 0 0 1 10,-10 
    h30 
    a10,10 0 0 1 10,10 
    v80 
    a10,10 0 0 1 -10,10 
    h-30 
    a10,10 0 0 1 -10,-10 
    z`;
    
  // Create ear shape based on paddle side
  const leftEar = isLeftPaddle
    ? "M10,10 L0,0 L20,0 Z" 
    : "M15,10 L5,0 L25,0 Z";
    
  const rightEar = isLeftPaddle
    ? "M40,10 L30,0 L50,0 Z" 
    : "M35,10 L25,0 L45,0 Z";
    
  // Eyes (x position varies slightly by paddle side)
  const eyeX1 = isLeftPaddle ? 15 : 13;
  const eyeX2 = isLeftPaddle ? 35 : 33;
  const leftEye = `M${eyeX1},30 a3,4 0 1 1 0,8 a3,4 0 1 1 0,-8`;
  const rightEye = `M${eyeX2},30 a3,4 0 1 1 0,8 a3,4 0 1 1 0,-8`;
  
  // Nose
  const nose = "M25,45 l-3,5 h6 Z";
  
  // Whiskers (slightly curve based on paddle side)
  const whiskerCurve = isLeftPaddle ? 5 : -5;
  const whiskers = [
    `M15,45 q${whiskerCurve},-5 -10,-5`,
    `M15,50 q${whiskerCurve},0 -10,0`,
    `M15,55 q${whiskerCurve},5 -10,5`,
    `M35,45 q${-whiskerCurve},-5 10,-5`,
    `M35,50 q${-whiskerCurve},0 10,0`,
    `M35,55 q${-whiskerCurve},5 10,5`
  ];
  
  // Mouth (small curve)
  const mouth = "M22,60 q3,4 6,0";
  
  return [face, leftEar, rightEar, leftEye, rightEye, nose, mouth, ...whiskers];
};

/**
 * Generate planet features - simple circles of varying sizes and positions
 */
export const generatePlanetFeatures = (
  planetSize: number
): Array<{ cx: number; cy: number; r: number; color: string }> => {
  const features = [];
  const radius = planetSize / 2;
  
  // Generate 5-8 features
  const featureCount = Math.floor(Math.random() * 4) + 5;
  
  // Color options for features
  const colors = [
    "oklch(0.6 0.1 30)",  // Reddish
    "oklch(0.7 0.15 80)",  // Yellowish
    "oklch(0.4 0.1 180)", // Blueish
    "oklch(0.5 0.1 130)", // Greenish
    "oklch(0.3 0.05 30)"  // Dark reddish
  ];
  
  for (let i = 0; i < featureCount; i++) {
    // Keep features within reasonable bounds from center
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (radius * 0.6);
    
    features.push({
      cx: radius + Math.cos(angle) * distance,
      cy: radius + Math.sin(angle) * distance,
      r: Math.random() * (radius * 0.2) + (radius * 0.05),
      color: colors[Math.floor(Math.random() * colors.length)]
    });
  }
  
  return features;
};