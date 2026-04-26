import { useState, useEffect, useMemo, useRef } from 'react';
import type { ReactElement } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard/ProductCard';
import { useSearch } from '../context/SearchContext';
import { SHOP_PRODUCTS } from '../data/shopData';
import styles from './Shop.module.scss';

const CATEGORY_ICONS: Record<string, ReactElement> = {
  'Все': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  'Книги': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  'Украшения': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  'Иконы': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  'Аксессуары': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  'Свечи': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="6"/><path d="M12 6c-2 0-4 2-4 5v9h8V11c0-3-2-5-4-5z"/>
      <line x1="8" y1="20" x2="16" y2="20"/>
    </svg>
  ),
  'Благовония': (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 2c0 2 2 4 2 6s-2 4-2 6"/><path d="M12 2c0 2 2 4 2 6s-2 4-2 6"/>
      <path d="M16 2c0 2 2 4 2 6s-2 4-2 6"/><line x1="4" y1="20" x2="20" y2="20"/>
    </svg>
  ),
};

const categories = ['Все', ...Array.from(new Set(SHOP_PRODUCTS.map((p) => p.cat)))];

type SortKey = 'default' | 'price_asc' | 'price_desc' | 'name_asc';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'default',    label: 'По умолчанию' },
  { value: 'price_asc',  label: 'Цена ↑' },
  { value: 'price_desc', label: 'Цена ↓' },
  { value: 'name_asc',   label: 'По названию' },
];

export default function Shop() {
  const navigate = useNavigate();
  const { results, setResults } = useSearch();
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sortKey, setSortKey]               = useState<SortKey>('default');
  const [sortOpen, setSortOpen]             = useState(false);
  const [minPrice, setMinPrice]             = useState('');
  const [maxPrice, setMaxPrice]             = useState('');
  const catalogRef = useRef<HTMLElement>(null);
  const landingRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setResults(null);
  }, [setResults]);

  useEffect(() => {
    const html = document.documentElement;
    html.style.scrollSnapType = 'y mandatory';
    if (landingRef.current)  landingRef.current.style.scrollSnapAlign  = 'start';
    if (catalogRef.current)  catalogRef.current.style.scrollSnapAlign  = 'start';
    return () => {
      html.style.scrollSnapType = '';
      if (landingRef.current)  landingRef.current.style.scrollSnapAlign  = '';
      if (catalogRef.current)  catalogRef.current.style.scrollSnapAlign  = '';
    };
  }, []);

  /* Close sort dropdown on outside click */
  useEffect(() => {
    if (!sortOpen) return;
    const close = () => setSortOpen(false);
    window.addEventListener('click', close);
    return () => window.removeEventListener('click', close);
  }, [sortOpen]);

  const isSearching = results !== null;

  const displayed = useMemo(() => {
    let list = isSearching
      ? results
      : activeCategory === 'Все'
        ? SHOP_PRODUCTS
        : SHOP_PRODUCTS.filter((p) => p.cat === activeCategory);

    const min = minPrice !== '' ? Number(minPrice) : null;
    const max = maxPrice !== '' ? Number(maxPrice) : null;
    if (min !== null && !isNaN(min)) list = list.filter((p) => p.price >= min);
    if (max !== null && !isNaN(max)) list = list.filter((p) => p.price <= max);

    if (sortKey === 'price_asc')  return [...list].sort((a, b) => a.price - b.price);
    if (sortKey === 'price_desc') return [...list].sort((a, b) => b.price - a.price);
    if (sortKey === 'name_asc')   return [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [isSearching, results, activeCategory, sortKey, minPrice, maxPrice]);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setResults(null);
  };

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Сортировка';

  return (
    <>
      {/* ── Landing splash ─────────────────────── */}
      <section className={styles.landing} ref={landingRef}>
        <div className={styles.landingGlow} aria-hidden="true" />
        <p className={styles.landingEyebrow}>Православный интернет-магазин</p>
        <h1 className={styles.landingTitle}>Царствие Небесное</h1>
        <div className={styles.landingDivider} />
        <p className={styles.landingSubtitle}>Иконы · Книги · Украшения · Благовония</p>
        <button className={styles.landingCta} onClick={scrollToCatalog}>
          Перейти к покупкам
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </section>

      {/* ── Catalog ────────────────────────────── */}
      <section className={styles.catalog} ref={catalogRef} id="catalog">

        {/* Left sidebar — categories (sticky) */}
        <aside className={styles.sidebar}>
          <p className={styles.sidebarTitle}>Категории</p>
          <ul className={styles.catList}>
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`${styles.catBtn} ${!isSearching && activeCategory === cat ? styles.catBtnActive : ''}`}
                  onClick={() => handleCategory(cat)}
                >
                  <span className={styles.catIcon}>{CATEGORY_ICONS[cat] ?? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                    </svg>
                  )}</span>
                  {cat}
                </button>
              </li>
            ))}
            {/* ── Online candle entry card ── */}
            <li>
              <button className={styles.candleCard} onClick={() => navigate('/candles')}>
                <span className={styles.candleCardGlow} aria-hidden="true" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.candleCardIcon}>
                  <line x1="12" y1="2" x2="12" y2="6"/>
                  <path d="M12 6c-2.2 0-4 2-4 5v9h8V11c0-3-1.8-5-4-5z"/>
                  <line x1="8" y1="20" x2="16" y2="20"/>
                </svg>
                <span className={styles.candleCardText}>Поставить свечу</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={styles.candleCardArrow}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </li>
            {/* ── Indulgences entry card ── */}
            <li>
              <button className={styles.indulgenceCard} onClick={() => navigate('/indulgences')}>
                <span className={styles.indulgenceCardGlow} aria-hidden="true" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.indulgenceCardIcon}>
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 8v4l3 3"/>
                  <path d="M8 12 A4 4 0 0 1 16 12"/>
                </svg>
                <span className={styles.indulgenceCardText}>Индульгенции</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={styles.indulgenceCardArrow}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </li>
            {/* ── Spiritual services entry card ── */}
            <li>
              <button className={styles.servicesCard} onClick={() => navigate('/services')}>
                <span className={styles.servicesCardGlow} aria-hidden="true" />
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className={styles.servicesCardIcon}>
                  <path d="M12 2L12 6"/>
                  <path d="M8 4 L16 4"/>
                  <path d="M5 8 C5 8 4 10 4 13 C4 18 7.5 21 12 21 C16.5 21 20 18 20 13 C20 10 19 8 19 8 Z"/>
                  <path d="M9 14 L12 11 L15 14"/>
                </svg>
                <span className={styles.servicesCardText}>Духовные требы</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className={styles.servicesCardArrow}>
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </li>
          </ul>
        </aside>

        {/* Right main — toolbar + grid */}
        <main className={styles.main}>

          {/* Toolbar — sticky under header */}
          <div className={styles.toolbar}>
            <div className={styles.sortWrap} onClick={(e) => e.stopPropagation()}>
              <button
                className={styles.sortBtn}
                onClick={() => setSortOpen((v) => !v)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="9" y2="18"/>
                </svg>
                {activeSortLabel}
              </button>
              {sortOpen && (
                <ul className={styles.sortDropdown}>
                  {SORT_OPTIONS.map((o) => (
                    <li key={o.value}>
                      <button
                        className={`${styles.sortOption} ${sortKey === o.value ? styles.sortOptionActive : ''}`}
                        onClick={() => { setSortKey(o.value); setSortOpen(false); }}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.priceFilter}>
              <span className={styles.priceLabel}>Цена (MDL)</span>
              <input
                className={styles.priceInput}
                type="number"
                min={0}
                placeholder="от"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className={styles.priceSep}>—</span>
              <input
                className={styles.priceInput}
                type="number"
                min={0}
                placeholder="до"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <span className={styles.count}>{displayed.length} товаров</span>
          </div>

          {/* Product grid */}
          {displayed.length > 0 ? (
            <div className={styles.grid}>
              {displayed.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>Ничего не найдено</p>
              <button
                className={styles.resetBtn}
                onClick={() => { handleCategory('Все'); setMinPrice(''); setMaxPrice(''); }}
              >
                Сбросить фильтры
              </button>
            </div>
          )}
        </main>

      </section>
    </>
  );
}
