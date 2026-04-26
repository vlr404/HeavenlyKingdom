import { useState } from 'react';
import type { Notification } from '../../types/account';
import styles from './Notifications.module.scss';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    icon: 'delivery',
    text: 'Ваш заказ #00387 отправлен и уже в пути к вам',
    date: '2 часа назад',
    isRead: false,
  },
  {
    id: '2',
    icon: 'order',
    text: 'Заказ #00392 успешно оформлен и принят в обработку',
    date: '1 день назад',
    isRead: false,
  },
  {
    id: '3',
    icon: 'promo',
    text: 'Пасхальная скидка 10% на все иконы! До 28 апреля',
    date: '2 дня назад',
    isRead: true,
  },
  {
    id: '4',
    icon: 'order',
    text: 'Ваш заказ #00341 успешно доставлен',
    date: '5 дней назад',
    isRead: true,
  },
  {
    id: '5',
    icon: 'info',
    text: 'Поступил новый товар: Мирра Иерусалимская',
    date: '1 неделю назад',
    isRead: true,
  },
];

const IconMap: Record<Notification['icon'], JSX.Element> = {
  order: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" />
    </svg>
  ),
  delivery: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  ),
  promo: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" />
    </svg>
  ),
  info: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
    </svg>
  ),
};

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Уведомления</h2>
          {unreadCount > 0 && (
            <span className={styles.unreadBadge}>{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button className={styles.markAllBtn} onClick={markAllRead}>
            Отметить все как прочитанные
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className={styles.empty}>
          <p>Нет уведомлений</p>
        </div>
      ) : (
        <div className={styles.list}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`${styles.item} ${!notif.isRead ? styles.itemUnread : ''}`}
              onClick={() => markRead(notif.id)}
            >
              <div className={styles.iconWrap}>{IconMap[notif.icon]}</div>
              <div className={styles.body}>
                <p className={styles.text}>{notif.text}</p>
                <span className={styles.date}>{notif.date}</span>
              </div>
              {!notif.isRead && <span className={styles.dot} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
