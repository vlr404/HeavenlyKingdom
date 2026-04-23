import { useMemo, useState } from 'react';
import './AdminPage.css';
import type { Holiday } from '../../types/holiday';
import type {
  AdminProduct,
  AdminSection,
  AdminSectionId,
  DonationGoal,
} from '../../types/admin';
import { SHOP_PRODUCTS } from '../../data/shopData';
import { StatsPanel } from './sections/StatsPanel';
import { HolidayManager } from './sections/HolidayManager';
import { DonationWidget } from './sections/DonationWidget';
import { StoreManager } from './sections/StoreManager';

const SECTIONS: AdminSection[] = [
  { id: 'stats',     label: 'Статистика', icon: '📊' },
  { id: 'holidays',  label: 'Праздники',  icon: '🎉' },
  { id: 'donations', label: 'Донаты',     icon: '💛' },
  { id: 'store',     label: 'Магазин',    icon: '🛍️' },
];

const initialHolidays = (): Holiday[] => {
  const y = new Date().getFullYear();
  return [
    { id: 1, name: 'День Независимости', date: new Date(y, 7, 27) },
    { id: 2, name: 'Рождество Христово', date: new Date(y, 11, 25) },
    { id: 3, name: 'Новый год',          date: new Date(y + 1, 0, 1) },
    { id: 4, name: 'Пасха',              date: new Date(y, 3, 20) },
  ];
};

const initialProducts = (): AdminProduct[] =>
  SHOP_PRODUCTS.map((p) => ({ ...p, onSale: false }));

const initialCategories = (): string[] =>
  Array.from(new Set(SHOP_PRODUCTS.map((p) => p.cat)));

const initialGoal: DonationGoal = {
  id: 1,
  title: 'На восстановление храма',
  target: 100000,
  current: 25000,
};

const AdminPage = () => {
  const [active, setActive] = useState<AdminSectionId>('stats');
  const [holidays, setHolidays] = useState<Holiday[]>(initialHolidays);
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [goal, setGoal] = useState<DonationGoal>(initialGoal);

  const stats = useMemo(() => {
    const now = new Date();
    return {
      totalProducts: products.length,
      saleProducts: products.filter((p) => p.onSale).length,
      futureHolidays: holidays.filter((h) => h.date > now).length,
      donationProgress: Math.min(100, Math.round((goal.current / Math.max(1, goal.target)) * 100)),
    };
  }, [products, holidays, goal]);

  const addHoliday = (name: string, date: Date) => {
    setHolidays((prev) => [
      ...prev,
      { id: Date.now(), name, date },
    ]);
  };

  const removeHoliday = (id: number) => {
    setHolidays((prev) => prev.filter((h) => h.id !== id));
  };

  const toggleSale = (id: number, onSale: boolean) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, onSale, salePrice: onSale ? p.salePrice ?? Math.round(p.price * 0.8) : undefined }
          : p,
      ),
    );
  };

  const updateSalePrice = (id: number, salePrice: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, salePrice } : p)),
    );
  };

  const addCategory = (name: string) => {
    setCategories((prev) => (prev.includes(name) ? prev : [...prev, name]));
  };

  const removeCategory = (name: string) => {
    setCategories((prev) => prev.filter((c) => c !== name));
  };

  const updateGoal = (patch: Partial<Omit<DonationGoal, 'id'>>) => {
    setGoal((prev) => ({ ...prev, ...patch }));
  };

  const addProgress = (amount: number) => {
    setGoal((prev) => ({ ...prev, current: Math.max(0, prev.current + amount) }));
  };

  const resetProgress = () => setGoal((prev) => ({ ...prev, current: 0 }));

  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <div className="admin__brand">Админ-панель</div>
        <nav className="admin__nav">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`admin__nav-item ${active === s.id ? 'is-active' : ''}`}
              onClick={() => setActive(s.id)}
            >
              <span className="admin__nav-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="admin__content">
        {active === 'stats' && <StatsPanel stats={stats} />}
        {active === 'holidays' && (
          <HolidayManager
            holidays={holidays}
            onAdd={addHoliday}
            onRemove={removeHoliday}
          />
        )}
        {active === 'donations' && (
          <DonationWidget
            goal={goal}
            onUpdateGoal={updateGoal}
            onAddProgress={addProgress}
            onReset={resetProgress}
          />
        )}
        {active === 'store' && (
          <StoreManager
            products={products}
            categories={categories}
            onToggleSale={toggleSale}
            onUpdateSalePrice={updateSalePrice}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
