import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../entity/cart/cartStore';
import CartItem from '../components/Shop/CartItem/CartItem';
import styles from './Cart.module.scss';

const Cart = () => {
  const navigate = useNavigate()
  const { items, clearCart, totalSum, totalCount } = useCartStore()

  return (
    <div className={styles.page}>
      <div className={styles.inner}>

        {/* Шапка страницы */}
        <div className={styles.top}>
          <button className={styles.backBtn} onClick={() => navigate('/shop')}>
            ← Вернуться в магазин
          </button>
          <h1 className={styles.title}>Корзина</h1>
        </div>

        {items.length === 0 ? (
          // Пустая корзина
          <div className={styles.empty}>
            <svg className={styles.emptyIcon} width="64" height="64" viewBox="0 0 32 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <path fillRule="evenodd" clipRule="evenodd" d="M20.657 0.118C20.968-.015 21.328-.036 21.657.057c.33.094.602.296.758.562l3.846 6.573c2.364.155 3.848.552 4.805 1.563C32.639 10.42 32.012 12.923 30.757 17.93l-.75 2.987c-.85 3.394-1.275 5.091-2.717 6.087C25.848 28 23.818 28 19.757 28H12.244c-4.061 0-6.091 0-7.531-.996C3.269 26.008 2.843 24.311 1.994 20.917l-.75-2.987C-.011 12.923-.64 10.42.935 8.756c.957-1.012 2.441-1.408 4.805-1.563L9.586.619A1.3 1.3 0 0 1 10.343.063c.328-.092.686-.069.996.061.309.13.545.361.656.641.111.28.088.586-.064.852L8.724 7.1c.843-.005 1.766-.008 2.772-.008h9.499c1.006 0 1.929.003 2.772.008L20.07 1.619c-.155-.266-.18-.573-.07-.855.11-.282.346-.515.657-.646Z" fill="currentColor" stroke="none"/>
            </svg>
            <p className={styles.emptyTitle}>Корзина пуста</p>
            <p className={styles.emptySub}>Добавьте товары из каталога</p>
            <button
              className={styles.shopBtn}
              onClick={() => navigate('/shop')}
            >
              Перейти в каталог →
            </button>
          </div>
        ) : (
          <div className={styles.layout}>

            {/* Список товаров — левая колонка */}
            <div className={styles.itemsList}>
              <div className={styles.listHead}>
                <span>Товары ({totalCount()})</span>
                <button className={styles.clearBtn} onClick={clearCart}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: 5}}>
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                  </svg>
                  Очистить всё
                </button>
              </div>
              {items.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            {/* Итог — правая колонка */}
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Итого</h2>

              <div className={styles.summaryRow}>
                <span>Товары ({totalCount()} шт)</span>
                <span>{totalSum().toLocaleString('ro-MD')} MDL</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Доставка</span>
                <span className={styles.free}>Бесплатно</span>
              </div>

              <div className={styles.summaryTotal}>
                <span>К оплате</span>
                <span>{totalSum().toLocaleString('ro-MD')} MDL</span>
              </div>

              <button
                className={styles.checkoutBtn}
                onClick={() => alert('Оформление — скоро!')}
              >
                Оформить заказ →
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Cart