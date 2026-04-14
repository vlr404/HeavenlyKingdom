import './Hero.css';
import { eventsBase } from '../../../components/Home/CountdownTimer/holidays';
import { CountdownTimer } from '../../../components/Home/CountdownTimer/CountdownTimer';
import { Space } from '../../../components/common/Space/Space';
import type { EventItem } from '../../../components/Home/CountdownTimer/holidays';

// Возвращает ближайшее будущее событие ИЛИ событие которое идёт сегодня
const getNextEvent = (events: EventItem[]): EventItem | null => {
    if (!events || events.length === 0) return null;

    const now   = new Date();

    // Конец сегодняшнего дня — 23:59:59
    const endOfToday = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        23, 59, 59
    );

    const activeEvents = events
        .filter(event => new Date(event.date) <= endOfToday)  // уже наступило или сегодня
        .filter(event => {
            // Оставляем только если это сегодня или в будущем (не вчера и раньше)
            const eventDate = new Date(event.date);
            return (
                eventDate.getFullYear() === now.getFullYear() &&
                eventDate.getMonth()    === now.getMonth()    &&
                eventDate.getDate()     === now.getDate()
            ) || eventDate > now;
        });

    const futureEvents = events.filter(event => new Date(event.date) > now);

    // Приоритет: сначала сегодняшнее событие, потом ближайшее будущее
    const todayEvent = activeEvents[0] ?? null;
    const nextEvent  = futureEvents.sort(
        (a, b) => +new Date(a.date) - +new Date(b.date)
    )[0] ?? null;

    return todayEvent ?? nextEvent;
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