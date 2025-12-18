import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Confetti = ({ count = 50, duration = 3 }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    const newConfetti = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 360,
      scale: 0.5 + Math.random() * 0.5,
      delay: Math.random() * 0.5,
      duration: duration + Math.random() * 1,
      color: ['#D4AF37', '#FFD95C', '#B8941F', '#BFA791', '#A8917A'][Math.floor(Math.random() * 5)],
      shape: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)]
    }));
    setConfetti(newConfetti);
  }, [count, duration]);

  const getShape = (shape) => {
    switch(shape) {
      case 'circle': return 'rounded-full';
      case 'square': return 'rounded';
      case 'triangle': return 'triangle';
      default: return 'rounded-full';
    }
  };

  if (!confetti.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <motion.div
          key={piece.id}
          className={`absolute w-2 h-2 ${piece.shape === 'triangle' ? 'triangle' : ''}`}
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            boxShadow: `0 0 10px ${piece.color}40`
          }}
          initial={{ 
            y: piece.y, 
            x: piece.x,
            rotate: 0,
            scale: piece.scale
          }}
          animate={{ 
            y: '110vh',
            x: piece.x + (Math.random() * 100 - 50),
            rotate: piece.rotation + 360,
            scale: [piece.scale, piece.scale * 1.2, 0]
          }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: 'easeInOut'
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;