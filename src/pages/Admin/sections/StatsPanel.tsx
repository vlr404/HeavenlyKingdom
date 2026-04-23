import type { AdminStats } from '../../../types/admin';

interface StatsPanelProps {
  stats: AdminStats;
}

export const StatsPanel = ({ stats }: StatsPanelProps) => (
  <section>
    <div className="admin__header">
      <div>
        <h1 className="admin__title">Статистика</h1>
        <p className="admin__subtitle">Краткая сводка по разделам администрирования</p>
      </div>
    </div>

    <div className="card">
      <h2 className="card__title">Показатели</h2>
      <div className="grid-3">
        <div className="stat">
          <div className="stat__value">{stats.totalProducts}</div>
          <div className="stat__label">Всего товаров</div>
        </div>
        <div className="stat">
          <div className="stat__value">{stats.saleProducts}</div>
          <div className="stat__label">Товары со скидкой</div>
        </div>
        <div className="stat">
          <div className="stat__value">{stats.futureHolidays}</div>
          <div className="stat__label">Предстоящие праздники</div>
        </div>
        <div className="stat">
          <div className="stat__value">{stats.donationProgress}%</div>
          <div className="stat__label">Прогресс сбора</div>
        </div>
      </div>
    </div>
  </section>
);
