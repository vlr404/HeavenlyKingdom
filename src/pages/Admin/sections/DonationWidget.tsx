import { useState } from 'react';
import type { DonationWidgetProps } from '../../../types/admin';

export const DonationWidget = ({
  goal,
  onUpdateGoal,
  onAddProgress,
  onReset,
}: DonationWidgetProps) => {
  const [title, setTitle] = useState<string>(goal.title);
  const [target, setTarget] = useState<number>(goal.target);
  const [amount, setAmount] = useState<number>(1000);

  const pct = Math.min(100, Math.round((goal.current / Math.max(1, goal.target)) * 100));

  const saveGoal = () => {
    onUpdateGoal({ title: title.trim() || 'Сбор', target: Math.max(1, target) });
  };

  return (
    <section>
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Виджет пожертвований</h1>
          <p className="admin__subtitle">Настройте цель сбора и следите за прогрессом</p>
        </div>
      </div>

      <div className="card">
        <h2 className="card__title">Предпросмотр</h2>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <strong>{goal.title}</strong>
            <span style={{ color: 'var(--admin-text-dim)' }}>
              {goal.current.toLocaleString('ru-RU')} ₽ / {goal.target.toLocaleString('ru-RU')} ₽
            </span>
          </div>
          <div className="progress">
            <div className="progress__bar" style={{ width: `${pct}%` }} />
          </div>
          <div style={{ textAlign: 'right', marginTop: 8, color: 'var(--admin-accent)', fontWeight: 600 }}>
            {pct}%
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="card__title">Параметры цели</h2>
        <div className="row">
          <div className="field">
            <label htmlFor="d-title">Название сбора</label>
            <input
              id="d-title"
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="На восстановление храма"
            />
          </div>
          <div className="field">
            <label htmlFor="d-target">Целевая сумма (₽)</label>
            <input
              id="d-target"
              type="number"
              className="input"
              min={1}
              value={target}
              onChange={(e) => setTarget(Number(e.target.value))}
            />
          </div>
          <button className="btn" onClick={saveGoal}>Сохранить</button>
        </div>
      </div>

      <div className="card">
        <h2 className="card__title">Добавить прогресс (ручная имитация)</h2>
        <div className="row">
          <div className="field">
            <label htmlFor="d-amount">Сумма (₽)</label>
            <input
              id="d-amount"
              type="number"
              className="input"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
          <button className="btn" onClick={() => onAddProgress(Math.max(0, amount))}>
            + Добавить
          </button>
          <button className="btn btn--ghost" onClick={() => onAddProgress(500)}>
            +500 ₽
          </button>
          <button className="btn btn--ghost" onClick={() => onAddProgress(5000)}>
            +5000 ₽
          </button>
          <button className="btn btn--danger btn--sm" onClick={onReset}>
            Сбросить
          </button>
        </div>
      </div>
    </section>
  );
};
