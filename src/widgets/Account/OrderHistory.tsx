import { useState, useEffect } from 'react';
import { useAuthStore } from '../../entity/auth/authStore';
import { api } from '../../api/client';
import styles from './OrderHistory.module.scss';

interface OrderItemDto { id: number; productName: string; productImg: string; quantity: number; price: number; }
interface OrderDto { id: number; number: string; createdAt: string; status: string; totalAmount: number; items: OrderItemDto[]; }

const OrderHistory = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    api.get<OrderDto[]>('/orders/history')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>История покупок</h2>

      {loading ? (
        <div className={styles.empty}><p>Загрузка…</p></div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}><p>У вас пока нет завершённых заказов</p></div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.orderMeta}>
                  <span className={styles.orderNumber}>Заказ {order.number}</span>
                  <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                </div>
                <span className={styles.statusDelivered}>Доставлен</span>
              </div>

              <div className={styles.itemsList}>
                {order.items.map((item) => (
                  <div key={item.id} className={styles.item}>
                    <img src={item.productImg} alt={item.productName} className={styles.itemImg} />
                    <div className={styles.itemInfo}>
                      <span className={styles.itemName}>{item.productName}</span>
                      <span className={styles.itemQty}>× {item.quantity}</span>
                    </div>
                    <span className={styles.itemPrice}>
                      {(item.price * item.quantity).toLocaleString('ro-MD')} MDL
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <span className={styles.total}>
                  Итого: <strong>{order.totalAmount.toLocaleString('ro-MD')} MDL</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
