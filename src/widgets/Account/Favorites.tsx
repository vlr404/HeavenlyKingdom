import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../entity/auth/authStore';
import { useCartStore } from '../../entity/cart/cartStore';
import { api } from '../../api/client';
import styles from './Favorites.module.scss';

interface FavoriteDto { id: number; productId: number; productName: string; productImg: string; productPrice: number; productCat: string; }

const HeartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const Favorites = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const { addItem } = useCartStore();
  const [favorites, setFavorites] = useState<FavoriteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    api.get<FavoriteDto[]>('/favorites')
      .then(setFavorites)
      .catch(() => setFavorites([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const remove = async (productId: number) => {
    try {
      await api.delete(`/favorites/${productId}`);
      setFavorites(prev => prev.filter(f => f.productId !== productId));
    } catch { /* ignore */ }
  };

  if (loading) return <div className={styles.container}><h2 className={styles.title}>Избранное</h2><div className={styles.empty}><p>Загрузка…</p></div></div>;

  if (favorites.length === 0) {
    return (
      <div className={styles.container}>
        <h2 className={styles.title}>Избранное</h2>
        <div className={styles.empty}>
          <div className={styles.emptyIcon}><HeartIcon /></div>
          <p className={styles.emptyText}>Список избранного пуст</p>
          <p className={styles.emptyHint}>Добавляйте понравившиеся товары, нажимая на сердечко</p>
          <button className={styles.catalogBtn} onClick={() => navigate('/shop')}>Перейти в каталог</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Избранное</h2>
      <p className={styles.count}>{favorites.length} товара</p>
      <div className={styles.grid}>
        {favorites.map((f) => (
          <div key={f.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <img src={f.productImg} alt={f.productName} className={styles.image} />
              <button className={styles.removeBtn} onClick={() => remove(f.productId)} title="Убрать из избранного">
                <HeartIcon />
              </button>
            </div>
            <div className={styles.cardBody}>
              <span className={styles.cat}>{f.productCat}</span>
              <span className={styles.name}>{f.productName}</span>
              <div className={styles.cardFooter}>
                <span className={styles.price}>{f.productPrice.toLocaleString('ro-MD')} MDL</span>
                <button className={styles.addBtn} onClick={() => addItem({ id: f.productId, name: f.productName, price: f.productPrice, cat: f.productCat, img: f.productImg })}>
                  В корзину
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
