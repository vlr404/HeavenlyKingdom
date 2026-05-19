import { useMemo, useState, useEffect } from 'react';
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
import { api } from '../../api/client';
import { StatsPanel } from './sections/StatsPanel';
import { HolidayManager } from './sections/HolidayManager';
import { DonationWidget } from './sections/DonationWidget';
import { StoreManager } from './sections/StoreManager';
import { MediaManager } from './sections/MediaManager';
import { UserManager } from './sections/UserManager';
import { AdminProfile } from './sections/AdminProfile';
import { useMedia } from '../../context/MediaContext';
import { useAuthStore } from '../../entity/auth/authStore';

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
    id: 'users',
    label: 'Пользователи',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
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

const initialProducts = (): AdminProduct[] =>
  SHOP_PRODUCTS.map((p) => ({ ...p, onSale: false }));

const initialCategories = (): string[] => [...SHOP_CATEGORIES];

const initialGoal: DonationGoal = {
  id: 1,
  title: 'На восстановление храма',
  target: 100000,
  current: 25000,
};

const PROFILE_SECTION: AdminSection = {
  id: 'adminProfile',
  label: 'Профиль',
  icon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
};

const AdminPage = () => {
  const [active, setActive] = useState<AdminSectionId>('stats');
  const { logout } = useAuthStore();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>(initialProducts);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [goal, setGoal] = useState<DonationGoal>(initialGoal);

  useEffect(() => {
    api.get<(AdminProduct & { isOnSale?: boolean })[]>('/product')
      .then(data => setProducts(data.map(p => ({ ...p, onSale: p.isOnSale ?? p.onSale ?? false }))))
      .catch(() => {});

    api.get<{ id: number; name: string; date: string }[]>('/admin/holidays')
      .then(data => setHolidays(data.map(h => ({ ...h, date: new Date(h.date) }))))
      .catch(() => {});

    api.get<DonationGoal>('/admin/donations')
      .then(setGoal)
      .catch(() => {});
  }, []);

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

  const addHoliday = async (name: string, date: Date) => {
    try {
      const created = await api.post<{ id: number; name: string; date: string }>(
        '/admin/holidays',
        { name, date: date.toISOString() },
      );
      setHolidays(prev => [...prev, { ...created, date: new Date(created.date) }]);
    } catch {
      setHolidays(prev => [...prev, { id: Date.now(), name, date }]);
    }
  };

  const removeHoliday = async (id: number) => {
    setHolidays(prev => prev.filter(h => h.id !== id));
    try { await api.delete(`/admin/holidays/${id}`); } catch { /* ignore */ }
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

  const updateGoal = async (patch: Partial<Omit<DonationGoal, 'id'>>) => {
    try {
      const updated = await api.put<DonationGoal>('/admin/donations', {
        title: patch.title ?? goal.title,
        target: patch.target ?? goal.target,
      });
      setGoal(updated);
    } catch {
      setGoal(prev => ({ ...prev, ...patch }));
    }
  };

  const addProgress = async (amount: number) => {
    try {
      const updated = await api.post<DonationGoal>('/admin/donations/progress', { amount });
      setGoal(updated);
    } catch {
      setGoal(prev => ({ ...prev, current: Math.max(0, prev.current + amount) }));
    }
  };

  const resetProgress = async () => {
    try {
      const updated = await api.post<DonationGoal>('/admin/donations/reset', {});
      setGoal(updated);
    } catch {
      setGoal(prev => ({ ...prev, current: 0 }));
    }
  };

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
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--admin-border)', paddingTop: 8 }}>
          <button
            type="button"
            className={`admin__nav-item ${active === 'adminProfile' ? 'is-active' : ''}`}
            onClick={() => setActive('adminProfile')}
          >
            <span className="admin__nav-icon">{PROFILE_SECTION.icon}</span>
            {PROFILE_SECTION.label}
          </button>
          <button
            type="button"
            className="admin__nav-item"
            style={{ color: 'var(--admin-danger)' }}
            onClick={logout}
          >
            <span className="admin__nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            Выйти
          </button>
        </div>
      </aside>

      <main className="admin__content">
        {active === 'stats'        && <StatsPanel stats={stats} />}
        {active === 'users'        && <UserManager />}
        {active === 'holidays'     && (
          <HolidayManager
            holidays={holidays}
            onAdd={addHoliday}
            onRemove={removeHoliday}
          />
        )}
        {active === 'donations'    && (
          <DonationWidget
            goal={goal}
            onUpdateGoal={updateGoal}
            onAddProgress={addProgress}
            onReset={resetProgress}
          />
        )}
        {active === 'store'        && (
          <StoreManager
            products={products}
            categories={categories}
            onToggleSale={toggleSale}
            onUpdateSalePrice={updateSalePrice}
            onAddCategory={addCategory}
            onRemoveCategory={removeCategory}
          />
        )}
        {active === 'media'        && (
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
        {active === 'adminProfile' && <AdminProfile />}
      </main>
    </div>
  );
};

export default AdminPage;
