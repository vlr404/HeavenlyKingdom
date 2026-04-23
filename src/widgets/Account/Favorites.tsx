import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FavoriteProduct } from '../../types/account';
import styles from './Favorites.module.scss';

const MOCK_FAVORITES: FavoriteProduct[] = [
  {
    id: 3,
    name: 'Икона Богородицы',
    price: 2100,
    img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/%D0%95%D0%BB%D0%B5%D1%86%D0%BA%D0%B0%D1%8F-%D0%A7%D0%B5%D1%80%D0%BD%D0%B8%D0%B3%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%B8%D0%BA%D0%BE%D0%BD%D0%B0_%D0%91%D0%BE%D0%B6%D0%B8%D0%B5%D0%B9_%D0%9C%D0%B0%D1%82%D0%B5%D1%80%D0%B8.jpg',
    cat: 'Иконы',
  },
  {
    id: 1,
    name: 'Библия в кожаном переплёте',
    price: 1290,
    img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop',
    cat: 'Книги',
  },
  {
    id: 4,
    name: 'Четки из оливкового дерева',
    price: 560,
    img: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400&h=400&fit=crop',
    cat: 'Аксессуары',
  },
  {
    id: 8,
    name: 'Псалтирь с толкованием',
    price: 890,
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
    cat: 'Книги',
  },
];

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const Favorites = () => {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>(MOCK_FAVORITES);
  const navigate = useNavigate();

  const remove = (id: number) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  };

  if (favorites.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Избранное</h2>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>
            <HeartIcon />
          </div>
          <p className={styles.emptyText}>Список избранного пуст</p>
          <p className={styles.emptyHint}>Добавляйте понравившиеся товары, нажимая на сердечко</p>
          <button className={styles.catalogBtn} onClick={() => navigate('/shop')}>
            Перейти в каталог
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Избранное</h2>
      <p className={styles.count}>{favorites.length} товара</p>

      <div className={styles.grid}>
        {favorites.map((product) => (
          <div key={product.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={product.img} alt={product.name} className={styles.image} />
              <button
                className={styles.removeBtn}
                onClick={() => remove(product.id)}
                title="Убрать из избранного"
              >
                <HeartIcon />
              </button>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cat}>{product.cat}</span>
              <span className={styles.name}>{product.name}</span>
              <div className={styles.cardFooter}>
                <span className={styles.price}>
                  {product.price.toLocaleString('ru-RU')} ₽
                </span>
                <button className={styles.addBtn}>В корзину</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
