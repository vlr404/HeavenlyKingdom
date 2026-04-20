import { useState, useEffect, useMemo } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { StoreLanding } from '../components/StoreLanding/StoreLanding';
import { useSearch } from '../context/SearchContext';
import { SHOP_PRODUCTS } from '../data/shopData';
import './Shop.css';

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
  { value: 'price_asc',  label: 'Цена: по возрастанию' },
  { value: 'price_desc', label: 'Цена: по убыванию' },
  { value: 'name_asc',   label: 'По названию' },
];

export default function Shop() {
  const { results, setResults } = useSearch();
  const [activeCategory, setActiveCategory] = useState('Все');
  const [sortKey, setSortKey]               = useState<SortKey>('default');
  const [sortOpen, setSortOpen]             = useState(false);
  const [minPrice, setMinPrice]             = useState('');
  const [maxPrice, setMaxPrice]             = useState('');

  useEffect(() => {
    setResults(null);
  }, [setResults]);

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

  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === sortKey)?.label ?? 'Сортировка';

  return (
    <>
      <StoreLanding />

      <div className="shop">
        <aside className="shop__sidebar">
          <p className="shop__sidebar-title">Категории</p>
          <ul className="shop__cat-list">
            {categories.map((cat) => (
              <li key={cat}>
                <button
                  className={`shop__cat-btn${!isSearching && activeCategory === cat ? ' shop__cat-btn--active' : ''}`}
                  onClick={() => handleCategory(cat)}
                >
                  <span className="shop__cat-icon">{CATEGORY_ICONS[cat] ?? '📦'}</span>
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="shop__main">
          <div className="shop__toolbar">
            <div className="shop__sort-wrap">
              <button
                className="shop__sort-btn"
                onClick={() => setSortOpen((v) => !v)}
              >
                ↕ {activeSortLabel}
              </button>
              {sortOpen && (
                <ul className="shop__sort-dropdown">
                  {SORT_OPTIONS.map((o) => (
                    <li key={o.value}>
                      <button
                        className={`shop__sort-option${sortKey === o.value ? ' shop__sort-option--active' : ''}`}
                        onClick={() => { setSortKey(o.value); setSortOpen(false); }}
                      >
                        {o.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="shop__price-filter">
              <span className="shop__price-label">Цена (MDL)</span>
              <input
                className="shop__price-input"
                type="number"
                min={0}
                placeholder="от"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <span className="shop__price-sep">—</span>
              <input
                className="shop__price-input"
                type="number"
                min={0}
                placeholder="до"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <span className="shop__count">{displayed.length} товаров</span>
          </div>

          {displayed.length > 0 ? (
            <div className="shop__grid" id="products-grid">
              {displayed.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="shop__empty" id="products-grid">
              <p>Ничего не найдено</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
