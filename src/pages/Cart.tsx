import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../entity/cart/cartStore'
import styles from './Cart.module.scss'

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
            <span className={styles.emptyIcon}>🛒</span>
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
                  🗑 Очистить всё
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
                <span>{totalSum().toLocaleString('ru')} ₽</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Доставка</span>
                <span className={styles.free}>Бесплатно</span>
              </div>

              <div className={styles.summaryTotal}>
                <span>К оплате</span>
                <span>{totalSum().toLocaleString('ru')} ₽</span>
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