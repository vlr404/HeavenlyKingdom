import { useMemo, useState } from 'react';
import type { Holiday } from '../../../types/holiday';
import type { HolidayManagerProps, HolidayFormValues } from '../../../types/admin';

export const HolidayManager = ({ holidays, onAdd, onRemove }: HolidayManagerProps) => {
  const [form, setForm] = useState<HolidayFormValues>({ name: '', date: '' });
  const [notice, setNotice] = useState<string>('');

  const { future, past, active } = useMemo(() => {
    const now = new Date();
    const sorted = [...holidays].sort((a, b) => a.date.getTime() - b.date.getTime());
    const fut = sorted.filter((h) => h.date > now);
    return {
      future: fut,
      past: sorted.filter((h) => h.date <= now),
      active: fut[0] ?? null,
    };
  }, [holidays]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.date) return;
    const date = new Date(form.date);
    if (Number.isNaN(date.getTime())) return;
    onAdd(form.name.trim(), date);
    setForm({ name: '', date: '' });
    setNotice(`Праздник "${form.name}" добавлен`);
    setTimeout(() => setNotice(''), 2500);
  };

  return (
    <section>
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Управление праздниками</h1>
          <p className="admin__subtitle">
            Таймер автоматически переключится на ближайший будущий праздник
          </p>
        </div>
      </div>

      {notice && <div className="notice">{notice}</div>}

      <div className="card">
        <h2 className="card__title">Добавить новый праздник</h2>
        <form onSubmit={handleSubmit} className="row">
          <div className="field">
            <label htmlFor="h-name">Название</label>
            <input
              id="h-name"
              className="input"
              placeholder="Например, Троица"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="field">
            <label htmlFor="h-date">Дата</label>
            <input
              id="h-date"
              type="date"
              className="input"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <button type="submit" className="btn">Добавить</button>
        </form>
      </div>

      <div className="card">
        <h2 className="card__title">
          Активный таймер
          {active && <span className="badge badge--sale" style={{ marginLeft: 8 }}>В эфире</span>}
        </h2>
        {active ? (
          <div className="row">
            <strong style={{ fontSize: 18 }}>{active.name}</strong>
            <span style={{ color: 'var(--admin-text-dim)' }}>
              {active.date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
            </span>
          </div>
        ) : (
          <p style={{ color: 'var(--admin-text-dim)' }}>Нет предстоящих праздников</p>
        )}
      </div>

      <div className="card">
        <h2 className="card__title">Предстоящие ({future.length})</h2>
        {future.length === 0 ? (
          <p style={{ color: 'var(--admin-text-dim)' }}>Список пуст</p>
        ) : (
          <ul className="list">
            {future.map((h) => (
              <HolidayRow key={h.id} holiday={h} onRemove={onRemove} />
            ))}
          </ul>
        )}
      </div>

      {past.length > 0 && (
        <div className="card">
          <h2 className="card__title">Прошедшие ({past.length})</h2>
          <ul className="list">
            {past.map((h) => (
              <HolidayRow key={h.id} holiday={h} onRemove={onRemove} muted />
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

interface HolidayRowProps {
  holiday: Holiday;
  onRemove: (id: number) => void;
  muted?: boolean;
}

const HolidayRow = ({ holiday, onRemove, muted }: HolidayRowProps) => (
  <li className="list__item" style={muted ? { opacity: 0.6 } : undefined}>
    <div>
      <strong>{holiday.name}</strong>
      <div style={{ color: 'var(--admin-text-dim)', fontSize: 13 }}>
        {holiday.date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}
      </div>
    </div>
    <button className="btn btn--danger btn--sm" onClick={() => onRemove(holiday.id)}>
      Удалить
    </button>
  </li>
);
