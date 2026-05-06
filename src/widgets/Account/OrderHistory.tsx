


import type { CompletedOrder } from '../../types/account';
import { MOCK_HISTORY } from '../../data/accountData';
import styles from './OrderHistory.module.scss';

const OrderHistory = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>История покупок</h2>

      {MOCK_HISTORY.length === 0 ? (
        <div className={styles.empty}>
          <p>У вас пока нет завершённых заказов</p>
        </div>
      ) : (
        <div className={styles.list}>
          {MOCK_HISTORY.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderNumber}>Заказ #{order.number}</span>
                  <span className={styles.orderDate}>{order.date}</span>
                </div>
                <span className={styles.statusDelivered}>Доставлен</span>
              </div>

              <div className={styles.itemsList}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <img
                      src={item.img}
                      alt={item.name}
                      className={styles.itemImg}
                    />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>× {item.qty}</span>
                    </div>
                    <span className={styles.itemPrice}>
                      {(item.price * item.qty).toLocaleString('ro-MD')} MDL
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <span className={styles.total}>
                  Итого: <strong>{order.total.toLocaleString('ro-MD')} MDL</strong>
                </span>
                <button className={styles.repeatBtn}>Повторить заказ</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
