import React, { useState, useEffect } from 'react';
import './progress.css';

const CircularProgressBar = ({ percentage }) => {
  const [progress, setProgress] = useState(0);
  const progressEndValue = percentage;
  const duration = 2000; // Total duration in milliseconds to reach the end value
  const interval = 10; // Interval duration in milliseconds
  const incrementStep = (progressEndValue / (duration / interval));

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const nextValue = prev + incrementStep;
        if (nextValue >= progressEndValue) {
          clearInterval(progressInterval);
          return progressEndValue;
        }
        return nextValue;
      });
    }, interval);

    return () => clearInterval(progressInterval);
  }, [incrementStep, progressEndValue]);

  return (
    <div className="circular-progress-bar-container">
      <div className="circular-progress" style={{ background: `conic-gradient(#7d2ae8 ${progress * 3.6}deg, #ededed 0deg)` }}>
        <span className="progress-value">{Math.round(progress)}%</span>
      </div>
    </div>
  );
};

export default CircularProgressBar;
