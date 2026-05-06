import { useMemo, useState } from 'react';
import './AdminPage.css';
import type { Holiday } from '../../types/holiday';
import type {
  AdminProduct,
  AdminSection,
  AdminSectionId,
  DonationGoal,
} from '../../types/admin';
import type { CeremonyItem, MusicTrack } from '../../types/media';
import { SHOP_PRODUCTS } from '../../data/shopData';
import { SHOP_CATEGORIES } from '../../data/categoryData';
import { StatsPanel } from './sections/StatsPanel';
import { HolidayManager } from './sections/HolidayManager';
import { DonationWidget } from './sections/DonationWidget';
import { StoreManager } from './sections/StoreManager';
import { MediaManager } from './sections/MediaManager';
import { useMedia } from '../../context/MediaContext';

const SECTIONS: AdminSection[] = [
  {
    id: 'stats',
    label: 'Статистика',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6"  y1="20" x2="6"  y2="14" />
        <line x1="2"  y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
  {
    id: 'holidays',
    label: 'Праздники',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8"  y1="2" x2="8"  y2="6" />
        <line x1="3"  y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    id: 'donations',
    label: 'Донаты',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    id: 'store',
    label: 'Магазин',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    id: 'media',
    label: 'Медиа',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
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

const initialCategories = (): string[] => [...SHOP_CATEGORIES];

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

  const { ceremonyItems, setCeremonyItems, musicTracks, setMusicTracks, videoUrls, setVideoUrls } = useMedia();

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

  const updateCeremony = (id: string, patch: Partial<CeremonyItem>) => {
    setCeremonyItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item));
  };

  const addTrack = (track: MusicTrack) => {
    setMusicTracks(prev => [...prev, track]);
  };

  const removeTrack = (id: string) => {
    setMusicTracks(prev => prev.filter(t => t.id !== id));
  };

  const addVideo = (url: string) => {
    setVideoUrls(prev => prev.includes(url) ? prev : [...prev, url]);
  };

  const removeVideo = (url: string) => {
    setVideoUrls(prev => prev.filter(u => u !== url));
  };

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
        {active === 'media' && (
          <MediaManager
            ceremonyItems={ceremonyItems}
            musicTracks={musicTracks}
            videoUrls={videoUrls}
            onUpdateCeremony={updateCeremony}
            onAddTrack={addTrack}
            onRemoveTrack={removeTrack}
            onAddVideo={addVideo}
            onRemoveVideo={removeVideo}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
