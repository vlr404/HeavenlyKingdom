import { useState, useEffect } from 'react';

interface CountdownResult {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

const calculate = (targetDate: Date): CountdownResult => {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  return {
    days:      Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:     Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes:   Math.floor((diff / (1000 * 60)) % 60),
    seconds:   Math.floor((diff / 1000) % 60),
    isExpired: false,
  };
};

export const useCountdown = (targetDate: Date): CountdownResult => {
  const [state, setState] = useState<CountdownResult>(() => calculate(targetDate));

  useEffect(() => {
    const id = setInterval(() => setState(calculate(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return state;
};
