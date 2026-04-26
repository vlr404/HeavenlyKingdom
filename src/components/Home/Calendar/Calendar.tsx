/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from 'react';
import './Calendar.css';
import { eventsBase } from '../CountdownTimer/holidays';
import type { EventItem } from '../CountdownTimer/holidays';

type CalendarDay = {
    day: number;
    current: boolean;
    isToday?: boolean;
    events: EventItem[];
};

type JumpData = {
    d: string;
    m: string;
    y: string;
};

export const Calendar = () => {
    const [date, setDate]               = useState<Date>(new Date());
    const [isPickerOpen, setIsPickerOpen] = useState<boolean>(false);
    const [jumpData, setJumpData]       = useState<JumpData>({ d: '', m: '', y: '' });

    const today = new Date();
    const monthName     = date.toLocaleString('ru-RU', { month: 'long' });
    const formattedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

    const handleJump = () => {
        const d = parseInt(jumpData.d) || 1;
        const m = jumpData.m ? parseInt(jumpData.m) - 1 : date.getMonth();
        let y   = parseInt(jumpData.y) || date.getFullYear();

        if (y > 0 && y < 100) y += 2000;

        const newDate = new Date(y, m, d);
        if (!isNaN(newDate.getTime())) {
            setDate(newDate);
            setIsPickerOpen(false);
            setJumpData({ d: '', m: '', y: '' });
        }
    };

    const changeMonth = (offset: number) => {
        setDate(new Date(date.getFullYear(), date.getMonth() + offset, 1));
    };

    const calendarDays = useMemo<CalendarDay[]>(() => {
        const year  = date.getFullYear();
        const month = date.getMonth();
        const firstDay      = new Date(year, month, 1).getDay();
        const offset        = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth   = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate();

        const grid: CalendarDay[] = [];

        for (let i = offset; i > 0; i--) {
            grid.push({ day: prevMonthDays - i + 1, current: false, events: [] });
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            grid.push({
                day: i,
                current: true,
                isToday: i === today.getDate() && month === today.getMonth() && year === today.getFullYear(),
                events: eventsBase.filter(e => e.date.startsWith(dateStr)),
            });
        }

        let nextD = 1;
        while (grid.length < 42) {
            grid.push({ day: nextD++, current: false, events: [] });
        }
        return grid;
    }, [date]);

    return (
        <div className="heaven-cal-container">
            <header className="cal-header-top">
                <div className="cal-nav-btns">
                    <button onClick={() => changeMonth(-1)} type="button">
                        <svg className="arrow-icon left" width="9" height="17" viewBox="0 0 9 17" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.65368 9.38538L1.88843 16.7628C0.0252936 17.3527 -0.289876 16.8798 0.215884 14.9229L6.14486 8.46544L0.290339 2.09278C-0.249399 0.0255254 0.155557 -0.332194 1.96289 0.252911L8.65368 7.54551C8.87543 7.78952 9 8.12042 9 8.46544C9 8.81047 8.87543 9.14137 8.65368 9.38538Z" fill="white" />
                        </svg>
                    </button>

                    <div className="icon-wrapper">
                        <img
                            className="cal-icon-orange"
                            src="icons/Vector.png"
                            alt="Jump"
                            onClick={() => setIsPickerOpen(!isPickerOpen)}
                        />
                        {isPickerOpen && (
                            <div className="date-jump-panel">
                                <input
                                    placeholder="ММ"
                                    maxLength={2}
                                    value={jumpData.m}
                                    onChange={e => setJumpData({ ...jumpData, m: e.target.value })}
                                />
                                <input
                                    placeholder="ГГГГ"
                                    maxLength={4}
                                    value={jumpData.y}
                                    onChange={e => setJumpData({ ...jumpData, y: e.target.value })}
                                />
                                <button onClick={handleJump} className="jump-confirm-btn" type="button">OK</button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => changeMonth(1)} type="button">
                        <svg className="arrow-icon" width="9" height="17" viewBox="0 0 9 17">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.65368 9.38538L1.88843 16.7628C0.0252936 17.3527 -0.289876 16.8798 0.215884 14.9229L6.14486 8.46544L0.290339 2.09278C-0.249399 0.0255254 0.155557 -0.332194 1.96289 0.252911L8.65368 7.54551C8.87543 7.78952 9 8.12042 9 8.46544C9 8.81047 8.87543 9.14137 8.65368 9.38538Z" fill="white" />
                        </svg>
                    </button>
                </div>

                <div className="cal-divider" />
                <h2 className="cal-month-label">{formattedMonth} {date.getFullYear()}</h2>
            </header>

            <main className="cal-grid-frame">
                {calendarDays.map((item, idx) => {
                    const isLastColumns = (idx % 7) >= 4;
                    const hasHoliday    = item.events.some(e => e.type === 'holiday');
                    const visible       = item.events.slice(0, 2);
                    const overflow      = item.events.length - 2;

                    const sidebarClass = [
                        'cell-sidebar',
                        item.isToday               ? 'today-highlight'   : '',
                        !item.isToday && hasHoliday ? 'holiday-highlight' : '',
                    ].filter(Boolean).join(' ');

                    const bodyClass = [
                        'cell-body',
                        hasHoliday              ? 'body-has-holiday' :
                        item.events.length > 0  ? 'body-has-event'   : 'body-no-event',
                    ].join(' ');

                    return (
                        <div key={idx} className="cal-cell-unit">
                            <div className={sidebarClass}>
                                <span className={item.current ? 'day-num-active' : 'day-num-off'}>
                                    {item.day < 10 ? `0${item.day}` : item.day}
                                </span>
                            </div>
                            <div className={bodyClass}>
                                {item.events.length > 0 && (
                                    <div className="event-item-container">
                                        <div className="event-chips">
                                            {visible.map((ev) => (
                                                <div key={ev.id} className={`event-chip event-chip--${ev.type}`}>
                                                    <span className="event-chip-title">{ev.title}</span>
                                                </div>
                                            ))}
                                            {overflow > 0 && (
                                                <span className="event-more">+{overflow} ещё</span>
                                            )}
                                        </div>
                                        <div className={`event-huge-tooltip ${isLastColumns ? 'align-right' : ''}`}>
                                            {item.events.map((ev, i) => (
                                                <div key={ev.id} className="tooltip-event">
                                                    {i > 0 && <hr className="tooltip-divider" />}
                                                    <div className="tooltip-event-header">
                                                        <strong className="tooltip-title">{ev.title}</strong>
                                                        <span className={`tooltip-badge tooltip-badge--${ev.type}`}>
                                                            {ev.type === 'holiday' ? 'Праздник' : 'Событие'}
                                                        </span>
                                                    </div>
                                                    {ev.description && (
                                                        <p className="tooltip-full-text">{ev.description}</p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </main>
        </div>
    );
};