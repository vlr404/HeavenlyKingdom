import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard/ProductCard';
import { useSearch } from '../context/SearchContext';
import { SHOP_PRODUCTS } from '../data/shopData';
import './Shop.css';

const categories = ['Все', ...Array.from(new Set(SHOP_PRODUCTS.map((p) => p.cat)))];

export default function Shop() {
  const { results, setResults } = useSearch();
  const [activeCategory, setActiveCategory] = useState('Все');

  useEffect(() => {
    setResults(null);
  }, [setResults]);

  const isSearching = results !== null;
  const displayed = isSearching
    ? results
    : activeCategory === 'Все'
      ? SHOP_PRODUCTS
      : SHOP_PRODUCTS.filter((p) => p.cat === activeCategory);

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setResults(null);
  };

  return (
    <div className="shop">
      <div className="shop__header">
        <h1 className="shop__title">Каталог</h1>
        <span className="shop__count">{displayed.length} товаров</span>
      </div>

      <div className="shop__filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`shop__filter-btn${!isSearching && activeCategory === cat ? ' shop__filter-btn--active' : ''}`}
            onClick={() => handleCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {displayed.length > 0 ? (
        <div className="shop__grid">
          {displayed.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="shop__empty">
          <p>Ничего не найдено</p>
        </div>
      )}
    </div>
  );
}
