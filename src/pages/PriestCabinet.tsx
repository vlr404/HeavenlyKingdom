import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../entity/auth/authStore';
import { useServicesStore, type ServiceOrder } from '../entity/services/servicesStore';
import { SubNavBar } from '../components/common/SubNavBar/SubNavBar';
import { api } from '../api/client';
import styles from './PriestCabinet.module.scss';

interface FatherDto {
  id: number;
  name: string;
  lastName: string;
  san: string;
  img: string;
  position: string;
  parish: string;
  diocese: string;
  bio?: string;
  instagram?: string;
  telegram?: string;
  youtube?: string;
  facebook?: string;
  gmail?: string;
  userId?: number;
}

type Tab = 'profile' | 'requests' | 'history';

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

/* ── Profile section ────────────────────── */
const ProfileSection = ({ father, onSaved }: { father: FatherDto; onSaved: (f: FatherDto) => void }) => {
  const [form, setForm] = useState({
    name:      father.name,
    lastName:  father.lastName,
    san:       father.san,
    position:  father.position,
    parish:    father.parish,
    diocese:   father.diocese,
    bio:       father.bio ?? '',
    img:       father.img,
    instagram: father.instagram ?? '',
    telegram:  father.telegram ?? '',
    youtube:   father.youtube ?? '',
    facebook:  father.facebook ?? '',
    gmail:     father.gmail ?? '',
  });
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await api.put<FatherDto>('/father/me', {
        name:      form.name,
        lastName:  form.lastName,
        san:       form.san,
        position:  form.position,
        parish:    form.parish,
        diocese:   form.diocese,
        bio:       form.bio || null,
        img:       form.img,
        instagram: form.instagram || null,
        telegram:  form.telegram || null,
        youtube:   form.youtube || null,
        facebook:  form.facebook || null,
        gmail:     form.gmail || null,
      });
      onSaved(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Ошибка сохранения');
    } finally {
      setSaving(false);
    }
  };

  const field = (label: string, key: keyof typeof form, placeholder = '') => (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.input}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
        Профиль
      </h2>

      <form className={styles.form} onSubmit={handleSave}>
        <div className={styles.fieldRow}>
          {field('Имя', 'name', 'Имя')}
          {field('Фамилия', 'lastName', 'Фамилия')}
        </div>
        <div className={styles.fieldRow}>
          {field('Сан', 'san', 'Иерей, Протоиерей…')}
          {field('Должность', 'position', 'Настоятель, Клирик…')}
        </div>
        <div className={styles.fieldRow}>
          {field('Приход / Храм', 'parish', 'Название прихода')}
          {field('Епархия', 'diocese', 'Название епархии')}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Биография</label>
          <textarea
            className={styles.textarea}
            value={form.bio}
            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
            placeholder="Расскажите о себе и своём служении…"
            rows={4}
          />
        </div>

        <p className={styles.scheduleTitle}>Социальные сети</p>
        <div className={styles.fieldRow}>
          {field('Instagram', 'instagram', 'ссылка')}
          {field('Telegram', 'telegram', 'ссылка')}
        </div>
        <div className={styles.fieldRow}>
          {field('YouTube', 'youtube', 'ссылка')}
          {field('Facebook', 'facebook', 'ссылка')}
        </div>
        {field('Gmail', 'gmail', 'email')}

        <button type="submit" className={styles.saveBtn} disabled={saving}>
          {saved ? '✓ Сохранено' : saving ? 'Сохраняем…' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

/* ── Service request card ───────────────── */
const RequestCard = ({ order, onAccept, onReject }: {
  order: ServiceOrder;
  onAccept: () => void;
  onReject: () => void;
}) => (
  <div className={`${styles.orderCard} ${styles.orderCard_pending}`}>
    <div className={styles.orderHeader}>
      <div>
        <span className={styles.orderService}>{order.serviceName}</span>
        <span className={`${styles.orderBadge} ${styles.badge_pending}`}>Ожидает</span>
      </div>
      <span className={styles.orderCreated}>{formatDate(order.createdAt)}</span>
    </div>
    <div className={styles.orderBody}>
      <div className={styles.orderDetail}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        {order.clientName}
        {order.clientEmail && <span style={{ color: '#555', marginLeft: 4 }}>· {order.clientEmail}</span>}
      </div>
      <div className={styles.orderDetail}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {order.date} · {order.time}
      </div>
      {order.notes && (
        <div className={styles.orderNotes}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {order.notes}
        </div>
      )}
    </div>
    <div className={styles.orderActions}>
      <button className={styles.acceptBtn} onClick={onAccept}>Принять</button>
      <button className={styles.rejectBtn} onClick={onReject}>Отклонить</button>
    </div>
  </div>
);

/* ── History card ───────────────────────── */
const HistoryCard = ({ order }: { order: ServiceOrder }) => (
  <div className={`${styles.orderCard} ${styles[`orderCard_${order.status}`]}`}>
    <div className={styles.orderHeader}>
      <div>
        <span className={styles.orderService}>{order.serviceName}</span>
        <span className={`${styles.orderBadge} ${styles[`badge_${order.status}`]}`}>
          {order.status === 'accepted' ? 'Принято' : 'Отклонено'}
        </span>
      </div>
      <span className={styles.orderCreated}>{formatDate(order.createdAt)}</span>
    </div>
    <div className={styles.orderBody}>
      <div className={styles.orderDetail}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
        </svg>
        {order.clientName}
      </div>
      <div className={styles.orderDetail}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        {order.date} · {order.time}
      </div>
    </div>
  </div>
);

/* ── Requests tab ───────────────────────── */
const RequestsSection = ({ fatherId }: { fatherId: number }) => {
  const orders = useServicesStore((s) => s.orders);
  const updateOrderStatus = useServicesStore((s) => s.updateOrderStatus);

  const pending = orders.filter(
    (o) => o.priestId === String(fatherId) && o.status === 'pending'
  );

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
        </svg>
        Заявки
        {pending.length > 0 && (
          <span className={styles.queueCount}>{pending.length}</span>
        )}
      </h2>

      {pending.length === 0 ? (
        <p className={styles.emptyQueue}>Новых заявок нет</p>
      ) : (
        <div className={styles.orderList}>
          {pending.map((order) => (
            <RequestCard
              key={order.id}
              order={order}
              onAccept={() => updateOrderStatus(order.id, 'accepted')}
              onReject={() => updateOrderStatus(order.id, 'rejected')}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── History tab ────────────────────────── */
const HistorySection = ({ fatherId }: { fatherId: number }) => {
  const orders = useServicesStore((s) => s.orders);

  const history = orders.filter(
    (o) => o.priestId === String(fatherId) && (o.status === 'accepted' || o.status === 'rejected')
  );

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <polyline points="12 8 12 12 14 14"/><path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
        </svg>
        История
      </h2>

      {history.length === 0 ? (
        <p className={styles.emptyQueue}>История пуста</p>
      ) : (
        <div className={styles.orderList}>
          {[...history].reverse().map((order) => (
            <HistoryCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main page ──────────────────────────── */
export default function PriestCabinet() {
  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [father, setFather]   = useState<FatherDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab]         = useState<Tab>('profile');

  const pendingCount = useServicesStore((s) =>
    father ? s.orders.filter((o) => o.priestId === String(father.id) && o.status === 'pending').length : 0
  );

  useEffect(() => {
    api.get<FatherDto>('/father/me')
      .then(setFather)
      .catch(() => setFather(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <SubNavBar title="Личный кабинет батюшки" />

      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <div className={styles.priestAvatar}>
              {user?.name?.charAt(0) ?? 'Б'}
            </div>
            <div>
              <h1 className={styles.pageTitle}>
                {father?.san ?? 'Батюшка'}&nbsp;{father?.name ?? user?.name ?? ''}&nbsp;{father?.lastName ?? user?.lastName ?? ''}
              </h1>
              {father?.parish && (
                <p className={styles.pageSubtitle}>{father.parish}</p>
              )}
            </div>
          </div>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Выйти
          </button>
        </div>

        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Загрузка профиля…</p>
        ) : father === null ? (
          <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
            Профиль батюшки не найден. Обратитесь к администратору.
          </p>
        ) : (
          <>
            <div className={styles.tabs}>
              <button
                className={`${styles.tab} ${tab === 'profile' ? styles.tab_active : ''}`}
                onClick={() => setTab('profile')}
              >
                Профиль
              </button>
              <button
                className={`${styles.tab} ${tab === 'requests' ? styles.tab_active : ''}`}
                onClick={() => setTab('requests')}
              >
                Заявки
                {pendingCount > 0 && (
                  <span className={styles.tabBadge}>{pendingCount}</span>
                )}
              </button>
              <button
                className={`${styles.tab} ${tab === 'history' ? styles.tab_active : ''}`}
                onClick={() => setTab('history')}
              >
                История
              </button>
            </div>

            <div className={styles.tabContent}>
              {tab === 'profile'   && <ProfileSection father={father} onSaved={setFather} />}
              {tab === 'requests'  && <RequestsSection fatherId={father.id} />}
              {tab === 'history'   && <HistorySection fatherId={father.id} />}
            </div>
          </>
        )}
      </div>
    </>
  );
}
