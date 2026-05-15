import { useState, useEffect } from 'react';
import { useCountdown } from '../../hooks/useCountdown';
import styles from './HolidayTimer.module.css';
import '../../styles/tokens.module.css';
import { HOLIDAYS } from '../../data/holidaysData';

export const HolidayTimer = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showBanner, setShowBanner]     = useState<boolean>(false);

  useEffect(() => {
    const sorted = [...HOLIDAYS].sort((a, b) => a.date.getTime() - b.date.getTime());
    const now    = new Date();
    const next   = sorted.find((h) => h.date > now);
    if (next) {
      setCurrentIndex(HOLIDAYS.findIndex((h) => h.id === next.id));
    }
  }, []);

  const { days, hours, minutes, seconds, isExpired } = useCountdown(
    HOLIDAYS[currentIndex].date,
  );

  useEffect(() => {
    if (!isExpired) return;
    setShowBanner(true);
    const id = setTimeout(() => {
      setShowBanner(false);
      setCurrentIndex((prev) => (prev + 1) % HOLIDAYS.length);
    }, 5000);
    return () => clearTimeout(id);
  }, [isExpired]);

  return (
    <div className={styles.wrapper}>
      {showBanner ? (
        <div className={styles.banner}>
          <span className={styles.emoji}>🎉</span>
          <h2>С праздником! {HOLIDAYS[currentIndex].name}</h2>
        </div>
      ) : (
        <div className={styles.timer}>
          <h3>{HOLIDAYS[currentIndex].name}</h3>
          <div className={styles.countdown}>
            <div className={styles.unit}><span>{days}</span><p>Дней</p></div>
            <div className={styles.unit}><span>{hours}</span><p>Часов</p></div>
            <div className={styles.unit}><span>{minutes}</span><p>Минут</p></div>
            <div className={styles.unit}><span>{seconds}</span><p>Секунд</p></div>
          </div>
        </div>
      )}
    </div>
  );
};
