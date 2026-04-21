import { useState } from 'react';
import styles from './DonationBar.module.css';

interface DonationBarProps {
  goal?:     number;
  currency?: string;
}

export const DonationBar = ({ goal = 1000, currency = 'MDL' }: DonationBarProps) => {
  const [raised, setRaised]               = useState<number>(0);
  const [inputValue, setInputValue]       = useState<string>('');
  const [errorMsg, setErrorMsg]           = useState<string | null>(null);
  const [isGoalReached, setIsGoalReached] = useState<boolean>(false);

  const progressPercent = Math.min((raised / goal) * 100, 100);

  const handleDonate = () => {
    const value = Number(inputValue);
    if (!inputValue || isNaN(value)) { setErrorMsg('Введи сумму'); return; }
    if (value <= 0)                  { setErrorMsg('Сумма должна быть > 0'); return; }
    const newRaised = Math.min(raised + value, goal);
    setRaised(newRaised);
    setInputValue('');
    setErrorMsg(null);
    if (newRaised >= goal) setIsGoalReached(true);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inner}>
        <h3>Пожертвования</h3>

        <div className={styles.track}>
          <div className={styles.fill} style={{ width: `${progressPercent}%` }} />
        </div>

        <p className={styles.amount}>
          <strong>{raised}</strong> / {goal} {currency}
        </p>

        {isGoalReached && (
          <p className={styles.success}>Цель достигнута! 🎉</p>
        )}

        {!isGoalReached && (
          <div className={styles.form}>
            <input
              type="number"
              min={1}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Сумма (${currency})`}
            />
            {errorMsg && <span className={styles.error}>{errorMsg}</span>}
            <button onClick={handleDonate}>Пожертвовать</button>
          </div>
        )}
      </div>
    </div>
  );
};
