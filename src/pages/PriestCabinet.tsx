import { useState, useEffect } from 'react';
import { useAuthStore } from '../entity/auth/authStore';
import { SubNavBar } from '../components/common/SubNavBar/SubNavBar';
import { api } from '../api/client';
import styles from './PriestCabinet.module.scss';

/* ── Backend types ──────────────────────── */
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

interface OrderItemDto {
  id: number;
  productName: string;
  productImg: string;
  quantity: number;
  price: number;
}

interface OrderDto {
  id: number;
  number: string;
  createdAt: string;
  status: string;
  totalAmount: number;
  items: OrderItemDto[];
}

/* ── Helpers ────────────────────────────── */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const STATUS_LABELS: Record<string, string> = {
  pending:   'Ожидает',
  accepted:  'Принято',
  rejected:  'Отклонено',
  delivered: 'Доставлено',
};

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

/* ── Orders section ─────────────────────── */
const OrdersSection = () => {
  const [orders, setOrders] = useState<OrderDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<OrderDto[]>('/father/orders')
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.card}><p className={styles.emptyQueue}>Загрузка заказов…</p></div>;

  return (
    <div className={styles.card}>
      <h2 className={styles.cardTitle}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
          <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Заказы магазина
      </h2>

      {orders.length === 0 ? (
        <p className={styles.emptyQueue}>Нет заказов</p>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={`${styles.orderCard} ${styles[`orderCard_${order.status}`]}`}>
              <div className={styles.orderHeader}>
                <div>
                  <span className={styles.orderService}>{order.number}</span>
                  <span className={`${styles.orderBadge} ${styles[`badge_${order.status}`]}`}>
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </div>
                <span className={styles.orderCreated}>{formatDate(order.createdAt)}</span>
              </div>
              <div className={styles.orderBody}>
                <div className={styles.orderDetail}>
                  {order.items.length} поз. · {order.totalAmount} MDL
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Main page ──────────────────────────── */
export default function PriestCabinet() {
  const user = useAuthStore((s) => s.user);
  const [father, setFather] = useState<FatherDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<FatherDto>('/father/me')
      .then(setFather)
      .catch(() => setFather(null))
      .finally(() => setLoading(false));
  }, []);

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
              {father?.parish && <p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>{father.parish}</p>}
            </div>
          </div>
        </div>

        {loading ? (
          <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Загрузка профиля…</p>
        ) : father === null ? (
          <p style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>
            Профиль батюшки не найден. Обратитесь к администратору.
          </p>
        ) : (
          <div className={styles.layout}>
            <section className={styles.left}>
              <ProfileSection father={father} onSaved={setFather} />
            </section>
            <section className={styles.right}>
              <OrdersSection />
            </section>
          </div>
        )}
      </div>
    </>
  );
}
