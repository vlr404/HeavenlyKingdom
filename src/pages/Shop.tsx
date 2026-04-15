import { useState } from "react";
import ProductCard from "../components/ProductCard/ProductCard";
import "./Shop.css";

interface Product {
  id: number;
  name: string;
  price: number;
  cat: string;
  img: string;
  isNew: boolean;
}

const mockProducts: Product[] = [
  { id: 1, name: "Библия в кожаном переплёте", price: 1290, cat: "Книги", img: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop", isNew: true },
  { id: 2, name: "Деревянный нательный крест", price: 390, cat: "Украшения", img: "https://images.unsplash.com/photo-1606503153255-59d5e417b8b5?w=400&h=400&fit=crop", isNew: false },
  { id: 3, name: "Икона Богородицы", price: 2100, cat: "Иконы", img: "https://images.unsplash.com/photo-1548625149-720754a88498?w=400&h=400&fit=crop", isNew: true },
  { id: 4, name: "Четки из оливкового дерева", price: 560, cat: "Аксессуары", img: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop", isNew: false },
  { id: 5, name: "Молитвослов православный", price: 420, cat: "Книги", img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop", isNew: false },
  { id: 6, name: "Свечи церковные (набор 12 шт)", price: 180, cat: "Свечи", img: "https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=400&h=400&fit=crop", isNew: true },
  { id: 7, name: "Ладан афонский", price: 340, cat: "Благовония", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", isNew: false },
  { id: 8, name: "Псалтирь с толкованием", price: 890, cat: "Книги", img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop", isNew: true },
];

const categories = ["Все", ...Array.from(new Set(mockProducts.map((p) => p.cat)))];

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState("Все");

  const filtered =
    activeCategory === "Все"
      ? mockProducts
      : mockProducts.filter((p) => p.cat === activeCategory);

  return (
    <div className="shop">
      <div className="shop__header">
        <h1 className="shop__title">Каталог</h1>
        <span className="shop__count">{filtered.length} товаров</span>
      </div>

      <div className="shop__filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`shop__filter-btn ${activeCategory === cat ? "shop__filter-btn--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="shop__grid">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
