import { useState, useEffect, useMemo, useRef } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { useSearch } from '../context/SearchContext';
import { SHOP_PRODUCTS } from '../data/shopData';
import styles from './Shop.module.scss';

const CATEGORY_ICONS: Record<string, string> = {
  'Все':        '🏪',
  'Книги':      '📖',
  'Украшения':  '📿',
  'Иконы':      '🕌',
  'Аксессуары': '🎁',
  'Свечи':      '🕯️',
  'Благовония': '💨',
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
  const { results, setResults } = useSearch();
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sortKey, setSortKey]               = useState<SortKey>('default');
  const [sortOpen, setSortOpen]             = useState(false);
  const [minPrice, setMinPrice]             = useState('');
  const [maxPrice, setMaxPrice]             = useState('');
  const catalogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setResults(null);
  }, [setResults]);

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
      <section className={styles.landing}>
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
                  <span className={styles.catIcon}>{CATEGORY_ICONS[cat] ?? '📦'}</span>
                  {cat}
                </button>
              </li>
            ))}
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
              <span className={styles.priceLabel}>Цена (₽)</span>
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
              <span>🔍</span>
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
