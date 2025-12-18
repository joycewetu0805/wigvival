import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

const HeroCarousel = ({ slides, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => 
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  }, [slides.length]);

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    let intervalId;
    if (isPlaying) {
      intervalId = setInterval(nextSlide, interval);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, interval, nextSlide]);

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.95
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.95
    })
  };

  return (
    <div className="relative h-[80vh] overflow-hidden rounded-3xl group">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
            scale: { duration: 0.3 }
          }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gold-400/20 via-noir-900/70 to-noir-900">
            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center">
              <div className="container mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="max-w-3xl"
                >
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gold-400/10 border border-gold-400/30 rounded-full mb-6 backdrop-blur-sm">
                    <span className="text-gold-400 text-sm font-medium">
                      {slides[currentIndex].badge}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gold-400 mb-6 leading-tight">
                    {slides[currentIndex].title}
                  </h1>
                  <p className="text-xl text-beige-300 mb-8 max-w-2xl">
                    {slides[currentIndex].description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-noir-900 font-bold rounded-xl hover:from-gold-600 hover:to-gold-700 transition-all duration-300 transform hover:scale-105">
                      {slides[currentIndex].cta}
                    </button>
                    <button className="px-8 py-4 border-2 border-gold-400/30 text-gold-400 font-bold rounded-xl hover:bg-gold-400/10 transition-all duration-300">
                      En savoir plus
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4">
        <button
          onClick={prevSlide}
          className="p-3 bg-noir-900/70 backdrop-blur-sm rounded-full text-gold-400 hover:bg-gold-400/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 bg-noir-900/70 backdrop-blur-sm rounded-full text-gold-400 hover:bg-gold-400/20 transition-all"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        
        <button
          onClick={nextSlide}
          className="p-3 bg-noir-900/70 backdrop-blur-sm rounded-full text-gold-400 hover:bg-gold-400/20 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Progress Indicators */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className="focus:outline-none"
          >
            <div className="relative">
              <div className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-gold-400 scale-125' 
                  : 'bg-beige-400/30 hover:bg-beige-400/50'
              }`} />
              {index === currentIndex && (
                <motion.div
                  className="absolute -inset-1 border-2 border-gold-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-noir-800/50">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-500 to-gold-600"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ 
            duration: interval / 1000,
            ease: 'linear' 
          }}
          key={currentIndex}
        />
      </div>
    </div>
  );
};

export default HeroCarousel;