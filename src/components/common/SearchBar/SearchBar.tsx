import { useState } from "react";
import styles from "./SearchBar.module.scss";

// ====== Тип товара ======
export interface Product {
  id: number;
  name: string;
  price: number;
  cat: string;
  img?: string;
  description?: string;
}

// ====== Демо-товары ======
const DEMO_PRODUCTS: Product[] = [
  { id: 1, name: "Акустическая гитара", price: 12900, cat: "Гитары" },
  { id: 2, name: "Электрогитара Fender", price: 54900, cat: "Гитары" },
  { id: 3, name: "Цифровое пианино", price: 38000, cat: "Клавишные" },
  { id: 4, name: "Барабанная установка", price: 67000, cat: "Ударные" },
  { id: 5, name: "Скрипка 4/4", price: 9500, cat: "Смычковые" },
  { id: 6, name: "Укулеле сопрано", price: 3200, cat: "Гитары" },
  { id: 7, name: "Синтезатор Yamaha", price: 29000, cat: "Клавишные" },
  { id: 8, name: "Микрофон студийный", price: 8700, cat: "Оборудование" },
];

interface SearchBarProps {
  products?: Product[];
  onResults?: (results: Product[]) => void;
  placeholder?: string;
}

export default function SearchBar({
  products = DEMO_PRODUCTS,
  onResults,
  placeholder = "Поиск товаров...",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

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
    setIsOpen(value.length > 0);
    onResults?.(value ? filterProducts(value) : products);
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    onResults?.(products);
  };

  const handleSelect = (product: Product) => {
    // TODO: замени на навигацию к товару, например navigate(`/shop/${product.id}`)
    setQuery(product.name);
    setIsOpen(false);
  };

  const highlight = (text: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className={styles.highlight}>
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const filtered = filterProducts(query);

  return (
    <div className={styles.wrapper}>
      {/* Поле ввода */}
      <div className={`${styles.field} ${isOpen ? styles.fieldOpen : ""}`}>
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

      {/* Выпадающие результаты */}
      {isOpen && (
        <div className={styles.dropdown}>
          {filtered.length > 0 ? (
            <>
              <p className={styles.count}>
                Найдено: <span>{filtered.length}</span>
              </p>
              <ul className={styles.list}>
                {filtered.map((product) => (
                  <li
                    key={product.id}
                    className={styles.item}
                    onClick={() => handleSelect(product)}
                  >
                    {/* Превью */}
                    <div className={styles.itemThumb}>
                      {product.img ? (
                        <img src={product.img} alt={product.name} />
                      ) : (
                        <span>🛍️</span>
                      )}
                    </div>

                    {/* Название + категория */}
                    <div className={styles.itemInfo}>
                      <p className={styles.itemName}>
                        {highlight(product.name)}
                      </p>
                      <p className={styles.itemCategory}>
                        {highlight(product.cat)}
                      </p>
                    </div>

                    {/* Цена */}
                    <p className={styles.itemPrice}>
                      {product.price.toLocaleString("ru-RU")} ₽
                    </p>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className={styles.empty}>
              <span>🔍</span>
              <p>Товар «{query}» не найден</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
