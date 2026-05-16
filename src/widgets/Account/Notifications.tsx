import { useState, useEffect, type ReactElement } from 'react';
import { useAuthStore } from '../../entity/auth/authStore';
import { api } from '../../api/client';
import styles from './Notifications.module.scss';

interface NotificationDto { id: number; icon: string; text: string; createdAt: string; isRead: boolean; }
type IconKey = 'order' | 'promo' | 'delivery' | 'info';

const IconMap: Record<IconKey, ReactElement> = {
  order: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" /></svg>,
  delivery: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>,
  promo: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z" /></svg>,
  info: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>,
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const Notifications = () => {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    api.get<NotificationDto[]>('/notifications')
      .then(setNotifications)
      .catch(() => setNotifications([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = async (id: number) => {
    try {
      await api.put(`/notifications/${id}/read`, {});
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch { /* ignore */ }
  };

  const markAllRead = async () => {
    try {
      await api.put('/notifications/mark-all-read', {});
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch { /* ignore */ }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h2 className={styles.title}>Уведомления</h2>
          {unreadCount > 0 && <span className={styles.unreadBadge}>{unreadCount}</span>}
        </div>
        {unreadCount > 0 && <button className={styles.markAllBtn} onClick={markAllRead}>Отметить все как прочитанные</button>}
      </div>

      {loading ? <div className={styles.empty}><p>Загрузка…</p></div>
        : notifications.length === 0 ? <div className={styles.empty}><p>Нет уведомлений</p></div>
        : (
        <div className={styles.list}>
          {notifications.map(notif => (
            <div key={notif.id} className={`${styles.item} ${!notif.isRead ? styles.itemUnread : ''}`} onClick={() => !notif.isRead && markRead(notif.id)}>
              <div className={styles.iconWrap}>{IconMap[(notif.icon as IconKey) ?? 'info']}</div>
              <div className={styles.body}>
                <p className={styles.text}>{notif.text}</p>
                <span className={styles.date}>{formatDate(notif.createdAt)}</span>
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
