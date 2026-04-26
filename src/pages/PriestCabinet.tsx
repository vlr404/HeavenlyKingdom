import { useState, useMemo } from 'react';
import { useAuthStore } from '../entity/auth/authStore';
import { useServicesStore, type PriestData, type ServiceOrder } from '../entity/services/servicesStore';
import { SubNavBar } from '../components/common/SubNavBar/SubNavBar';
import styles from './PriestCabinet.module.scss';

/* ── Formatting helpers ─────────────────── */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('ru-RU', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });

const STATUS_LABELS: Record<ServiceOrder['status'], string> = {
  pending:  'Ожидает',
  accepted: 'Принято',
  rejected: 'Отклонено',
};

/* ── Profile form ───────────────────────── */
type ProfileForm = {
  fullName:   string;
  rank:       string;
  experience: string;
  bio:        string;
};

const ProfileSection = ({
  priest,
  priestId,
}: {
  priest: PriestData | undefined;
  priestId: string;
}) => {
  const updatePriest = useServicesStore((s) => s.updatePriest);
  const [form, setForm] = useState<ProfileForm>({
    fullName:   priest?.name       ?? '',
    rank:       priest?.rank       ?? '',
    experience: String(priest?.experience ?? ''),
    bio:        priest?.bio        ?? '',
  });
  const [saved, setSaved] = useState(false);

  /* Schedule slot toggling */
  const [schedule, setSchedule] = useState<PriestData['schedule']>(
    () => priest?.schedule ?? [],
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updatePriest(priestId, {
      name:       form.fullName,
      rank:       form.rank,
      experience: Number(form.experience) || 0,
      bio:        form.bio,
      schedule,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const toggleSlot = (dateIdx: number, time: string) => {
    setSchedule((prev) =>
      prev.map((day, i) => {
        if (i !== dateIdx) return day;
        const exists = day.times.includes(time);
        return {
          ...day,
          times: exists
            ? day.times.filter((t) => t !== time)
            : [...day.times, time].sort(),
        };
      }),
    );
  };

  const ALL_TIMES = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

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
          <div className={styles.field}>
            <label className={styles.label}>Полное имя</label>
            <input
              className={styles.input}
              value={form.fullName}
              onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
              placeholder="Имя Отчество Фамилия"
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Сан</label>
            <input
              className={styles.input}
              value={form.rank}
              onChange={(e) => setForm((f) => ({ ...f, rank: e.target.value }))}
              placeholder="Иерей, Протоиерей…"
              required
            />
          </div>
          <div className={styles.fieldSmall}>
            <label className={styles.label}>Стаж (лет)</label>
            <input
              className={styles.input}
              type="number"
              min={0}
              max={99}
              value={form.experience}
              onChange={(e) => setForm((f) => ({ ...f, experience: e.target.value }))}
              required
            />
          </div>
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

        {/* Schedule grid */}
        <div className={styles.scheduleSection}>
          <p className={styles.scheduleTitle}>Расписание служб</p>
          <p className={styles.scheduleHint}>
            Отметьте доступные временны́е слоты для записи прихожан.
          </p>
          <div className={styles.scheduleGrid}>
            {schedule.map((day, di) => (
              <div key={day.date} className={styles.scheduleDay}>
                <p className={styles.scheduleDayLabel}>{formatDate(day.date)}</p>
                <div className={styles.timeSlots}>
                  {ALL_TIMES.map((t) => {
                    const active = day.times.includes(t);
                    return (
                      <button
                        key={t}
                        type="button"
                        className={`${styles.timeSlot} ${active ? styles.timeSlotActive : ''}`}
                        onClick={() => toggleSlot(di, t)}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.saveBtn}>
          {saved ? '✓ Сохранено' : 'Сохранить изменения'}
        </button>
      </form>
    </div>
  );
};

/* ── Order card ─────────────────────────── */
const OrderCard = ({ order }: { order: ServiceOrder }) => {
  const updateOrderStatus = useServicesStore((s) => s.updateOrderStatus);
  const isPending = order.status === 'pending';

  return (
    <div className={`${styles.orderCard} ${styles[`orderCard_${order.status}`]}`}>
      <div className={styles.orderHeader}>
        <div>
          <span className={styles.orderService}>{order.serviceName}</span>
          <span className={`${styles.orderBadge} ${styles[`badge_${order.status}`]}`}>
            {STATUS_LABELS[order.status]}
          </span>
        </div>
        <span className={styles.orderCreated}>{formatDateTime(order.createdAt)}</span>
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
          {formatDate(order.date)} · {order.time}
        </div>
        {order.notes && (
          <p className={styles.orderNotes}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            {order.notes}
          </p>
        )}
      </div>

      {isPending && (
        <div className={styles.orderActions}>
          <button
            className={styles.acceptBtn}
            onClick={() => updateOrderStatus(order.id, 'accepted')}
          >
            ✓ Принять
          </button>
          <button
            className={styles.rejectBtn}
            onClick={() => updateOrderStatus(order.id, 'rejected')}
          >
            ✕ Отклонить
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Main page ──────────────────────────── */
export default function PriestCabinet() {
  const user = useAuthStore((s) => s.user);
  const { orders, priests, getBookedSlots } = useServicesStore();

  const priestId   = user?.id ?? 'priest1';
  const priestData = priests.find((p) => p.id === priestId);

  /* Orders for this priest, sorted by date descending */
  const myOrders = useMemo(
    () =>
      orders
        .filter((o) => o.priestId === priestId)
        .slice()
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [orders, priestId],
  );

  const bookedSlots = getBookedSlots(priestId);

  const pendingCount = myOrders.filter((o) => o.status === 'pending').length;

  return (
    <>
      <SubNavBar title="Личный кабинет батюшки" />

      <div className={styles.page}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <div className={styles.priestAvatar}>
              {user?.name?.charAt(0) ?? 'Б'}
            </div>
            <div>
              <h1 className={styles.pageTitle}>
                {priestData?.rank ?? 'Батюшка'}&nbsp;{user?.name ?? ''}&nbsp;{user?.lastName ?? ''}
              </h1>
              <p className={styles.pageSubtitle}>
                Стаж {priestData?.experience ?? '—'} {pluralYears(priestData?.experience ?? 0)} · Рейтинг&nbsp;
                <span className={styles.rating}>★ {priestData?.rating ?? '—'}</span>
              </p>
            </div>
          </div>
          {pendingCount > 0 && (
            <div className={styles.pendingBadge}>
              {pendingCount} новых запрос{pendingCount === 1 ? '' : pendingCount < 5 ? 'а' : 'ов'}
            </div>
          )}
        </div>

        <div className={styles.layout}>
          {/* Left: Profile editor */}
          <section className={styles.left}>
            <ProfileSection priest={priestData} priestId={priestId} />
          </section>

          {/* Right: Order queue */}
          <section className={styles.right}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                </svg>
                Очередь заявок
                {pendingCount > 0 && (
                  <span className={styles.queueCount}>{pendingCount}</span>
                )}
              </h2>

              {/* Conflict warning */}
              {bookedSlots.length > 0 && (
                <div className={styles.conflictInfo}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  Занятые слоты заблокированы для повторной записи
                </div>
              )}

              {myOrders.length === 0 ? (
                <p className={styles.emptyQueue}>Нет входящих заявок</p>
              ) : (
                <div className={styles.orderList}>
                  {myOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function pluralYears(n: number) {
  if (n % 100 >= 11 && n % 100 <= 19) return 'лет';
  const r = n % 10;
  if (r === 1) return 'год';
  if (r >= 2 && r <= 4) return 'года';
  return 'лет';
}
