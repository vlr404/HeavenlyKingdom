import { useState, useEffect } from 'react';
import './CountdownTimer.css';
import type { EventPoster } from '../../../data/eventsData';

type TimeLeft = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

type TimeUnit = keyof TimeLeft;

type CountdownTimerProps = {
    targetDate: string;
    title: string;
    poster?: EventPoster;
};

type TimerState = 'countdown' | 'poster' | 'frozen' | 'finished';

const TIME_UNITS: TimeUnit[] = ['days', 'hours', 'minutes', 'seconds'];

const calculateTimeLeft = (targetDate: string): TimeLeft => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
        days:    Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
    };
};

const isCelebrationDay = (targetDate: string): boolean => {
    const now    = new Date();
    const target = new Date(targetDate);
    return (
        now.getFullYear() === target.getFullYear() &&
        now.getMonth()    === target.getMonth()    &&
        now.getDate()     === target.getDate()
    );
};

const getTimerState = (targetDate: string, poster?: EventPoster): TimerState => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0)                return 'countdown';
    if (!isCelebrationDay(targetDate)) return 'finished';
    return poster ? 'poster' : 'frozen';
};

const formatNumber = (num: number): string => String(num).padStart(2, '0');

const CONFETTI = Array.from({ length: 35 }, (_, i) => ({
    id:       i,
    left:     `${Math.random() * 100}%`,
    delay:    `${Math.random() * 3}s`,
    duration: `${2.5 + Math.random() * 2}s`,
    color:    ['#ef6c00', '#ffd54f', '#fff', '#ff8a65', '#ffe0b2'][Math.floor(Math.random() * 5)],
    size:     `${6 + Math.random() * 8}px`,
}));

export const CountdownTimer = ({ targetDate, title, poster }: CountdownTimerProps) => {
    const [timeLeft,   setTimeLeft]   = useState<TimeLeft>(() => calculateTimeLeft(targetDate));
    const [timerState, setTimerState] = useState<TimerState>(() => getTimerState(targetDate, poster));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
            setTimerState(getTimerState(targetDate, poster));
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate, poster]);

    // --- POSTER ---
    if (timerState === 'poster' && poster) {
        return (
            <div className="timer-section--celebrating">
                {/* Название праздника над баннером */}
                <span className="celebration-label">• {title} •</span>

                {/* Баннер на всю ширину */}
                <div className="celebration-banner-wrap">
                    <img
                        src={poster.image}
                        alt={title}
                        className="celebration-poster-img"
                    />
                    {/* Конфетти поверх картинки */}
                    <div className="confetti-wrap" aria-hidden="true">
                        {CONFETTI.map(p => (
                            <span
                                key={p.id}
                                className="confetti-piece"
                                style={{
                                    left:              p.left,
                                    animationDelay:    p.delay,
                                    animationDuration: p.duration,
                                    backgroundColor:   p.color,
                                    width:             p.size,
                                    height:            p.size,
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // --- FROZEN (праздник, постера нет) ---
    if (timerState === 'frozen') {
        return (
            <div className="timer-section">
                <h2 className="timer-title">• {title} •</h2>
                <div className="timer-container">
                    {TIME_UNITS.map((unit) => (
                        <div className="timer-box" key={unit}>
                            <span className="timer-number">00</span>
                            <span className="timer-label">{unit}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // --- FINISHED ---
    if (timerState === 'finished') {
        return (
            <div className="timer-section timer-section--finished">
                <h2 className="timer-title">• {title} •</h2>
                <p className="timer-finished-text">Праздник завершён</p>
            </div>
        );
    }

    // --- COUNTDOWN ---
    return (
        <div className="timer-section">
            <h2 className="timer-title">• UPCOMING: {title} •</h2>
            <div className="timer-container">
                {TIME_UNITS.map((unit) => (
                    <div className="timer-box" key={unit}>
                        <span className="timer-number">{formatNumber(timeLeft[unit])}</span>
                        <span className="timer-label">{unit}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};