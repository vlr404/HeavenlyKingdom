import styles from './Header.module.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCartStore } from '../../../entity/cart/cartStore';
import { useAuthStore } from '../../../entity/auth/authStore';
import SearchBar from '../SearchBar/SearchBar';
import { useSearch } from '../../../context/SearchContext';


type Mode = 'home' | 'shop' | 'app' | 'minimal';

function getMode(path: string): Mode {
  if (path === '/' || path === '') return 'home';
  if (path.startsWith('/shop'))    return 'shop';
  if (path.startsWith('/auth'))    return 'minimal';
  return 'app'; // /cart, /account, …
}

const CartSvg = () => (
  <svg width="24" height="21" viewBox="0 0 32 28" fill="none">
    <path
      fillRule="evenodd" clipRule="evenodd"
      d="M20.657 0.118C20.968-.015 21.328-.036 21.657.057c.33.094.602.296.758.562l3.846 6.573c2.364.155 3.848.552 4.805 1.563C32.639 10.42 32.012 12.923 30.757 17.93l-.75 2.987c-.85 3.394-1.275 5.091-2.717 6.087C25.848 28 23.818 28 19.757 28H12.244c-4.061 0-6.091 0-7.531-.996C3.269 26.008 2.843 24.311 1.994 20.917l-.75-2.987C-.011 12.923-.64 10.42.935 8.756c.957-1.012 2.441-1.408 4.805-1.563L9.586.619A1.3 1.3 0 0 1 10.343.063c.328-.092.686-.069.996.061.309.13.545.361.656.641.111.28.088.586-.064.852L8.724 7.1c.843-.005 1.766-.008 2.772-.008h9.499c1.006 0 1.929.003 2.772.008L20.07 1.619c-.155-.266-.18-.573-.07-.855.11-.282.346-.515.657-.646ZM7.7 14.56a1.3 1.3 0 0 1 .384-.795 1.3 1.3 0 0 1 .927-.326h14.978c.347 0 .68.118.927.326.246.21.384.495.384.795s-.138.585-.384.795a1.3 1.3 0 0 1-.927.326H9.011a1.3 1.3 0 0 1-.927-.326A1.3 1.3 0 0 1 7.7 14.56Zm4.806 3.36a1.3 1.3 0 0 0-.927.326 1.3 1.3 0 0 0-.384.794c0 .3.138.584.384.794.246.21.58.327.927.327h6.989c.348 0 .68-.117.927-.327.246-.21.385-.494.385-.794s-.139-.585-.385-.794a1.3 1.3 0 0 0-.927-.326h-6.99Z"
      fill="currentColor"
    />
  </svg>
);

/* ── Profile avatar / icon ───────────────── */
interface AvatarProps {
  user: { name: string; lastName: string; avatar?: string } | null;
  isAuthenticated: boolean;
  onClick: () => void;
}

const Avatar = ({ user, isAuthenticated, onClick }: AvatarProps) => {
  const initials = isAuthenticated && user
    ? `${user.name.charAt(0)}${user.lastName ? user.lastName.charAt(0) : ''}`.toUpperCase()
    : null;

  return (
    <button className={styles.avatarBtn} onClick={onClick} aria-label="Профиль">
      {user?.avatar ? (
        <img src={user.avatar} alt={user.name} className={styles.avatarImg} />
      ) : initials ? (
        <span className={styles.avatarInitials}>{initials}</span>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
      )}
    </button>
  );
};

/* ── Icons cluster (profile + cart) ─────── */
const IconsCluster = ({ showCart = true }: { showCart?: boolean }) => {
  const navigate = useNavigate();
  const items    = useCartStore((s) => s.items);
  const { user, isAuthenticated } = useAuthStore();
  const count    = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className={styles.icons}>
      <Avatar
        user={user}
        isAuthenticated={isAuthenticated}
        onClick={() => navigate(isAuthenticated ? '/account' : '/auth')}
      />
      {showCart && (
        <button
          className={styles.cartBtn}
          onClick={() => navigate('/cart')}
          aria-label="Корзина"
        >
          <CartSvg />
          {count > 0 && <span className={styles.badge}>{count}</span>}
        </button>
      )}
    </div>
  );
};

/* ── Logo ────────────────────────────────── */
const Logo = () => (
  <Link to="/" className={styles.logo}>
    <img src={`${import.meta.env.BASE_URL}icons/logo.png`} alt="Логотип" className={styles.logoImg} />
    <span className={styles.logoText}>ЦАРСТВИЕ<br />НЕБЕСНОЕ</span>
  </Link>
);

/* ─────────────────────────────────────────
   Main Header component
───────────────────────────────────────── */
export const Header = () => {
  const location = useLocation();
  const mode     = getMode(location.pathname);
  const { setResults } = useSearch();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>

        {/* ── HOME ───────────────────────────────── */}
        {mode === 'home' && (
          <>
            <Logo />
            <nav className={styles.nav}>
              <ul>
                <li><a href="#hero"     className={styles.navItem}>ГЛАВНАЯ</a></li>
                <li><a href="#about"    className={styles.navItem}>О НАС</a></li>
                <li><a href="#fathers"  className={styles.navItem}>ОТЦЫ</a></li>
                <li><a href="#events"   className={styles.navItem}>СОБЫТИЯ</a></li>
                <li><a href="#ceremony" className={styles.navItem}>ЦЕРЕМОНИИ</a></li>
                <li><a href="#contacts" className={styles.navItem}>КОНТАКТЫ</a></li>
                <li><Link to="/shop"    className={styles.navItem}>МАГАЗИН</Link></li>
              </ul>
            </nav>
            <IconsCluster showCart={false} />
          </>
        )}

        {/* ── SHOP ───────────────────────────────── */}
        {mode === 'shop' && (
          <>
            <Logo />
            <div className={styles.shopSearch}>
              <SearchBar placeholder="Поиск товаров..." onResults={setResults} />
            </div>
            <IconsCluster />
          </>
        )}

        {/* ── APP (cart, account, …) ──────────────── */}
        {mode === 'app' && (
          <>
            <Logo />
            <nav className={styles.breadcrumbs}>
              <Link to="/" className={styles.breadLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 12L12 3l9 9" /><path d="M9 21V12h6v9" />
                </svg>
                Главная
              </Link>
              <span className={styles.breadSep}>›</span>
              <Link to="/shop" className={styles.breadLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                </svg>
                Магазин
              </Link>
              {location.pathname.startsWith('/account') && (
                <>
                  <span className={styles.breadSep}>›</span>
                  <span className={styles.breadCurrent}>Личный кабинет</span>
                </>
              )}
              {location.pathname.startsWith('/cart') && (
                <>
                  <span className={styles.breadSep}>›</span>
                  <span className={styles.breadCurrent}>Корзина</span>
                </>
              )}
              {location.pathname.startsWith('/priest-cabinet') && (
                <>
                  <span className={styles.breadSep}>›</span>
                  <span className={styles.breadCurrent}>Кабинет батюшки</span>
                </>
              )}
              {location.pathname.startsWith('/services') && (
                <>
                  <span className={styles.breadSep}>›</span>
                  <span className={styles.breadCurrent}>Духовные требы</span>
                </>
              )}
            </nav>
            <IconsCluster />
          </>
        )}

        {/* ── MINIMAL (auth) ──────────────────────── */}
        {mode === 'minimal' && (
          <>
            <Logo />
            <div className={styles.minimalRight}>
              <Link to="/" className={styles.minimalLink}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Главная
              </Link>
              <Link to="/shop" className={styles.minimalCta}>Магазин →</Link>
            </div>
          </>
        )}

      </div>
    </header>
  );
};
