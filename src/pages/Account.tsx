import { useState, useEffect, useRef, type ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../entity/auth/authStore';
import BackButton from '../components/common/BackButton/BackButton';
import ProfileSettings from '../widgets/Account/ProfileSettings';
import OrderHistory from '../widgets/Account/OrderHistory';
import CurrentOrders from '../widgets/Account/CurrentOrders';
import Favorites from '../widgets/Account/Favorites';
import Addresses from '../widgets/Account/Addresses';
import Notifications from '../widgets/Account/Notifications';
import styles from './Account.module.scss';

type TabId = 'profile' | 'history' | 'orders' | 'favorites' | 'addresses' | 'notifications';

interface TabConfig {
  id: TabId;
  label: string;
  icon: ReactElement;
}

const TABS: TabConfig[] = [
  {
    id: 'profile',
    label: 'Профиль',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'История покупок',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z" />
      </svg>
    ),
  },
  {
    id: 'orders',
    label: 'Текущие заказы',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 6h-2.18c.07-.44.18-.86.18-1.3C18 2.57 15.43 0 12.3 0c-1.77 0-3.27.98-4.2 2.44L12 6.3l3.9-3.86C16.39 2.16 17 2.7 17 3.5c0 .66-.38 1.22-.92 1.5H8c-2.21 0-4 1.79-4 4v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-2.21-1.79-4-4-4zM9 17H7v-2h2v2zm0-4H7v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2zm4 4h-2v-2h2v2zm0-4h-2v-2h2v2z" />
      </svg>
    ),
  },
  {
    id: 'favorites',
    label: 'Избранное',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    id: 'addresses',
    label: 'Адреса доставки',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Уведомления',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
      </svg>
    ),
  },
];

const Account = () => {
  const [activeTab, setActiveTab] = useState<TabId>('profile');
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const initials =
    `${user.name.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const handleTabClick = (id: TabId) => {
    setActiveTab(id);
    if (navRef.current) {
      const activeEl = navRef.current.querySelector(`[data-tab="${id}"]`) as HTMLElement;
      activeEl?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':       return <ProfileSettings />;
      case 'history':       return <OrderHistory />;
      case 'orders':        return <CurrentOrders />;
      case 'favorites':     return <Favorites />;
      case 'addresses':     return <Addresses />;
      case 'notifications': return <Notifications />;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <BackButton />
      </div>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.userInfo}>
            <div className={styles.avatar}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} />
              ) : (
                <span>{initials}</span>
              )}
            </div>
            <div className={styles.userName}>
              {user.name} {user.lastName}
            </div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>

          <div className={styles.divider} />

          <nav className={styles.nav} ref={navRef}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                data-tab={tab.id}
                className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                <span className={styles.navIcon}>{tab.icon}</span>
                <span className={styles.navLabel}>{tab.label}</span>
              </button>
            ))}
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
              </svg>
              <span className={styles.navLabel}>Выйти</span>
            </button>
          </nav>
        </aside>

        <main className={styles.content}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Account;
