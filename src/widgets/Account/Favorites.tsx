import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { FavoriteProduct } from '../../types/account';
import { MOCK_FAVORITES } from '../../data/accountData';
import styles from './Favorites.module.scss';

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
                  {product.price.toLocaleString('ro-MD')} MDL
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
