import type { CartItem as CartItemType } from '../../../entity/cart/cartStore';
import { useCartStore } from '../../../entity/cart/cartStore';
import styles from './CartItem.module.scss';

interface Props {
  item: CartItemType;
}

const CartItem = ({ item }: Props) => {
  const { removeItem, changeQty } = useCartStore();

  return (
    <div className={styles.item}>
      <img className={styles.img} src={item.img} alt={item.name} />

      <div className={styles.info}>
        <span className={styles.cat}>{item.cat}</span>
        <p className={styles.name}>{item.name}</p>
        <span className={styles.price}>
          {(item.price * item.qty).toLocaleString('ru')} ₽
        </span>
      </div>

      <div className={styles.controls}>
        <button
          className={styles.qtyBtn}
          onClick={() => changeQty(item.id, -1)}
          aria-label="Уменьшить количество"
        >
          −
        </button>
        <span className={styles.qty}>{item.qty}</span>
        <button
          className={styles.qtyBtn}
          onClick={() => changeQty(item.id, 1)}
          aria-label="Увеличить количество"
        >
          +
        </button>
        <button
          className={styles.removeBtn}
          onClick={() => removeItem(item.id)}
          aria-label="Удалить товар"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
