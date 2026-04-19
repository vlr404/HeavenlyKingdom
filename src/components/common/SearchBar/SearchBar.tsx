import { useState } from "react";
import { SHOP_PRODUCTS } from "../../../data/shopData";
import styles from "./SearchBar.module.scss";

// ====== Тип товара ======
export interface Product {
  id: number;
  name: string;
  price: number;
  cat: string;
  img?: string;
  isNew?: boolean;
}

interface SearchBarProps {
  products?: Product[];
  onResults?: (results: Product[]) => void;
  placeholder?: string;
}

export default function SearchBar({
  products = SHOP_PRODUCTS,
  onResults,
  placeholder = "Поиск товаров...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const filterProducts = (q: string) =>
    products.filter((p) => {
      const lower = q.toLowerCase();
      return (
        p.name.toLowerCase().includes(lower) ||
        p.cat.toLowerCase().includes(lower)
      );
    });

  const handleChange = (value: string) => {
    setQuery(value);
    onResults?.(value ? filterProducts(value) : products);
  };

  const handleClear = () => {
    setQuery("");
    onResults?.(products);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.field}>
        <svg
          className={styles.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>

        <input
          type="text"
          className={styles.input}
          placeholder={placeholder}
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          autoComplete="off"
          spellCheck={false}
        />

        {query && (
          <button
            className={styles.clear}
            onClick={handleClear}
            aria-label="Очистить поиск"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
