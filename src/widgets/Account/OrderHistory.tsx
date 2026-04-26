


import type { CompletedOrder } from '../../types/account';
import styles from './OrderHistory.module.scss';

const MOCK_HISTORY: CompletedOrder[] = [
  {
    id: '1',
    number: '00341',
    date: '15 марта 2024',
    items: [
      {
        id: 3,
        name: 'Икона Богородицы',
        price: 2100,
        qty: 1,
        img: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/%D0%95%D0%BB%D0%B5%D1%86%D0%BA%D0%B0%D1%8F-%D0%A7%D0%B5%D1%80%D0%BD%D0%B8%D0%B3%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F_%D0%B8%D0%BA%D0%BE%D0%BD%D0%B0_%D0%91%D0%BE%D0%B6%D0%B8%D0%B5%D0%B9_%D0%9C%D0%B0%D1%82%D0%B5%D1%80%D0%B8.jpg',
      },
      {
        id: 6,
        name: 'Свечи церковные (набор 12 шт)',
        price: 180,
        qty: 2,
        img: 'https://images.unsplash.com/photo-1603204077779-bed963ea7d0e?w=400&h=400&fit=crop',
      },
    ],
    total: 2460,
    status: 'delivered',
  },
  {
    id: '2',
    number: '00298',
    date: '22 января 2024',
    items: [
      {
        id: 2,
        name: 'Деревянный нательный крест',
        price: 390,
        qty: 1,
        img: 'https://ir.ozone.ru/s3/multimedia-1-e/c1000/6975420998.jpg',
      },
      {
        id: 5,
        name: 'Молитвослов православный',
        price: 420,
        qty: 1,
        img: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
      },
    ],
    total: 810,
    status: 'delivered',
  },
  {
    id: '3',
    number: '00187',
    date: '4 ноября 2023',
    items: [
      {
        id: 1,
        name: 'Библия в кожаном переплёте',
        price: 1290,
        qty: 1,
        img: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop',
      },
    ],
    total: 1290,
    status: 'delivered',
  },
];

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
