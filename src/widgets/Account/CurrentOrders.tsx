import { useState, useEffect } from 'react';
import { useAuthStore } from '../../entity/auth/authStore';
import { api } from '../../api/client';
import styles from './CurrentOrders.module.scss';

interface OrderItemDto { id: number; productName: string; productImg: string; quantity: number; price: number; }
interface OrderDto { id: number; number: string; createdAt: string; status: string; totalAmount: number; items: OrderItemDto[]; }

const ORDER_STEPS = ['Оформлен', 'Собран', 'Отправлен', 'Доставлен'];
const STATUS_TO_STEP: Record<string, number> = { placed: 0, assembled: 1, shipped: 2, delivering: 3 };
const STATUS_LABEL: Record<string, string> = { placed: 'Обрабатывается', assembled: 'Собран', shipped: 'В пути', delivering: 'Доставляется' };
const STATUS_COLOR: Record<string, string> = { placed: '#7a7068', assembled: '#7a7068', shipped: '#ef6c00', delivering: '#4caf50' };

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

const CurrentOrders = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    api.get<OrderDto[]>('/orders/active')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Текущие заказы</h2>

      {loading ? (
        <div className={styles.empty}><p>Загрузка…</p></div>
      ) : orders.length === 0 ? (
        <div className={styles.empty}><p>Активных заказов нет</p></div>
      ) : (
        <div className={styles.list}>
          {orders.map((order) => {
            const currentStep = STATUS_TO_STEP[order.status] ?? 0;
            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderNumber}>Заказ {order.number}</span>
                    <span className={styles.orderDate}>{formatDate(order.createdAt)}</span>
                  </div>
                  <span className={styles.statusBadge} style={{ color: STATUS_COLOR[order.status] ?? '#7a7068' }}>
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                </div>

                <div className={styles.progress}>
                  {ORDER_STEPS.map((step, i) => (
                    <div key={step} className={styles.stepWrapper}>
                      <div className={`${styles.stepDot} ${i <= currentStep ? styles.stepDotActive : ''} ${i === currentStep ? styles.stepDotCurrent : ''}`} />
                      <span className={`${styles.stepLabel} ${i <= currentStep ? styles.stepLabelActive : ''}`}>{step}</span>
                      {i < ORDER_STEPS.length - 1 && (
                        <div className={`${styles.stepLine} ${i < currentStep ? styles.stepLineActive : ''}`} />
                      )}
                    </div>
                  ))}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CurrentOrders;
