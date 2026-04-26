import './Hero.css';
import { eventsBase } from '../../../components/Home/CountdownTimer/holidays';
import { CountdownTimer } from '../../../components/Home/CountdownTimer/CountdownTimer';
import { Space } from '../../../components/common/Space/Space';
import type { EventItem } from '../../../components/Home/CountdownTimer/holidays';

// Возвращает ближайший праздник (type === 'holiday') — сегодняшний или следующий будущий
const getNextEvent = (events: EventItem[]): EventItem | null => {
    const holidays = events.filter(e => e.type === 'holiday');
    if (holidays.length === 0) return null;

    const now = new Date();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const todayHoliday = holidays.find(e => {
        const d = new Date(e.date);
        return d <= endOfToday && d.getDate() === now.getDate() && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }) ?? null;

    const nextHoliday = holidays
        .filter(e => new Date(e.date) > now)
        .sort((a, b) => +new Date(a.date) - +new Date(b.date))[0] ?? null;

    return todayHoliday ?? nextHoliday;
};

export const Hero = () => {
    const activeEvent = getNextEvent(eventsBase);

    return (
        <section id="hero" className="hero section-npt">
            <div className="section-container">
                <div className="hero__preview">
                    <div className="hero__preview-title">
                        <h1>ЦАРСТВИЕ НЕБЕСНОЕ</h1>
                    </div>
                    <div className="hero__preview-subtitle">
                        <h3>Здесь начинается путь к духовному обновлению</h3>
                    </div>
                    <Space mt={30} />

                    <button className="buttonh">Посетить Церковь</button>
                    <Space mt={60} />
                    {activeEvent ? (
                        <CountdownTimer
                            targetDate={activeEvent.date}
                            title={activeEvent.title}
                            poster={activeEvent.poster}
                        />
                    ) : (
                        null
                    )}
                </div>
            </div>
        </section>
    );
};