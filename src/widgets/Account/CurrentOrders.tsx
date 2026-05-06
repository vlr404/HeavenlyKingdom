import type { ActiveOrder, ActiveOrderStatus } from '../../types/account';
import { MOCK_ACTIVE } from '../../data/accountData';
import styles from './CurrentOrders.module.scss';

const ORDER_STEPS = ['Оформлен', 'Собран', 'Отправлен', 'Доставлен'];

const STATUS_TO_STEP: Record<ActiveOrderStatus, number> = {
  placed: 0,
  assembled: 1,
  shipped: 2,
  delivering: 3,
};

const STATUS_LABEL: Record<ActiveOrderStatus, string> = {
  placed: 'Обрабатывается',
  assembled: 'Собран',
  shipped: 'В пути',
  delivering: 'Доставляется',
};

const STATUS_COLOR: Record<ActiveOrderStatus, string> = {
  placed: '#7a7068',
  assembled: '#7a7068',
  shipped: '#ef6c00',
  delivering: '#4caf50',
};


const CurrentOrders = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Текущие заказы</h2>

      {MOCK_ACTIVE.length === 0 ? (
        <div className={styles.empty}>
          <p>Активных заказов нет</p>
        </div>
      ) : (
        <div className={styles.list}>
          {MOCK_ACTIVE.map((order) => {
            const currentStep = STATUS_TO_STEP[order.status];
            return (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderNumber}>Заказ #{order.number}</span>
                    <span className={styles.orderDate}>{order.date}</span>
                  </div>
                  <span
                    className={styles.statusBadge}
                    style={{ color: STATUS_COLOR[order.status] }}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>

                <div className={styles.progress}>
                  {ORDER_STEPS.map((step, i) => (
                    <div key={step} className={styles.stepWrapper}>
                      <div
                        className={`${styles.stepDot} ${
                          i <= currentStep ? styles.stepDotActive : ''
                        } ${i === currentStep ? styles.stepDotCurrent : ''}`}
                      />
                      <span
                        className={`${styles.stepLabel} ${
                          i <= currentStep ? styles.stepLabelActive : ''
                        }`}
                      >
                        {step}
                      </span>
                      {i < ORDER_STEPS.length - 1 && (
                        <div
                          className={`${styles.stepLine} ${
                            i < currentStep ? styles.stepLineActive : ''
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className={styles.itemsList}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.item}>
                      <img src={item.img} alt={item.name} className={styles.itemImg} />
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
