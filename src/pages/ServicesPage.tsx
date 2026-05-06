import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useServicesStore, type PriestData } from '../entity/services/servicesStore';
import { useAuthStore } from '../entity/auth/authStore';
import { SubNavBar } from '../components/common/SubNavBar/SubNavBar';
import styles from './ServicesPage.module.scss';

import { SERVICES, type ServiceItem } from '../data/servicesData';

/* ── Booking step type ──────────────────── */
type BookingStep = 1 | 2 | 3 | 4;

interface BookingState {
  step:     BookingStep;
  priest:   PriestData | null;
  date:     string;
  time:     string;
  name:     string;
  email:    string;
  notes:    string;
}

const EMPTY_BOOKING: BookingState = {
  step:   1,
  priest: null,
  date:   '',
  time:   '',
  name:   '',
  email:  '',
  notes:  '',
};

/* ── Helpers ────────────────────────────── */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });

/* ── Booking modal ──────────────────────── */
const STEP_LABELS = ['Услуга', 'Батюшка', 'Дата и время', 'Подтверждение'];

interface ModalProps {
  service:  ServiceItem;
  onClose:  () => void;
  priests:  PriestData[];
  getBookedSlots: (priestId: string) => { date: string; time: string }[];
  onSubmit: (booking: BookingState) => void;
}

const BookingModal = ({ service, onClose, priests, getBookedSlots, onSubmit }: ModalProps) => {
  const [booking, setBooking] = useState<BookingState>(EMPTY_BOOKING);
  const [submitted, setSubmitted] = useState(false);

  const sortedPriests = priests;

  const availableDates = booking.priest
    ? booking.priest.schedule.map((d) => d.date).sort()
    : [];

  const canNext =
    (booking.step === 1) ||
    (booking.step === 2 && booking.priest !== null) ||
    (booking.step === 3 && booking.date !== '' && booking.time !== '') ||
    (booking.step === 4 && booking.name.trim() !== '' && booking.email.trim() !== '');

  const handleNext = () => {
    if (booking.step < 4) {
      setBooking((b) => ({ ...b, step: (b.step + 1) as BookingStep }));
    } else {
      onSubmit(booking);
      setSubmitted(true);
    }
  };

  const handleBack = () => {
    setBooking((b) => ({ ...b, step: (b.step - 1) as BookingStep }));
  };

  /* Background click closes */
  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains(styles.backdrop)) onClose();
  };

  if (submitted) {
    return (
      <div className={styles.backdrop} onClick={handleBackdropClick}>
        <motion.div
          className={styles.modal}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
        >
          <div className={styles.successWrap}>
            <div className={styles.successIcon}>✝</div>
            <h2 className={styles.successTitle}>Заявка принята!</h2>
            <p className={styles.successText}>
              Ваша заявка на <strong>{service.name}</strong> отправлена&nbsp;
              {booking.priest?.rank}&nbsp;{booking.priest?.name}.
            </p>
            <p className={styles.successDetail}>
              {formatDate(booking.date)} · {booking.time}
            </p>
            <button className={styles.successBtn} onClick={onClose}>
              Закрыть
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <motion.div
        className={styles.modal}
        initial={{ opacity: 0, y: 48 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 48 }}
        transition={{ type: 'spring', damping: 26, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button className={styles.modalClose} onClick={onClose} aria-label="Закрыть">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Step indicator */}
        <div className={styles.stepRow}>
          {STEP_LABELS.map((label, i) => {
            const stepNum = (i + 1) as BookingStep;
            const done   = booking.step > stepNum;
            const active = booking.step === stepNum;
            return (
              <div key={label} className={styles.stepItem}>
                <div className={`${styles.stepDot} ${active ? styles.stepDotActive : ''} ${done ? styles.stepDotDone : ''}`}>
                  {done ? '✓' : stepNum}
                </div>
                <span className={`${styles.stepLabel} ${active ? styles.stepLabelActive : ''}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={booking.step}
            className={styles.stepContent}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.2 }}
          >
            {/* STEP 1 — Service info */}
            {booking.step === 1 && (
              <div className={styles.step1}>
                <img
                  src={service.image}
                  alt={service.name}
                  className={styles.serviceDetailImg}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <h3 className={styles.serviceDetailTitle}>{service.name}</h3>
                <p className={styles.serviceDetailDesc}>{service.fullDesc}</p>
                <div className={styles.serviceDetailMeta}>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {service.duration}
                  </span>
                  <span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                    от {service.price} MDL
                  </span>
                </div>
              </div>
            )}

            {/* STEP 2 — Choose priest */}
            {booking.step === 2 && (
              <div className={styles.step2}>
                <h3 className={styles.stepHeading}>Выберите батюшку</h3>
                <div className={styles.priestList}>
                  {sortedPriests.map((p) => (
                    <button
                      key={p.id}
                      className={`${styles.priestCard} ${booking.priest?.id === p.id ? styles.priestCardActive : ''}`}
                      onClick={() => setBooking((b) => ({ ...b, priest: p, date: '', time: '' }))}
                    >
                      <img
                        src={p.img}
                        alt={p.name}
                        className={styles.priestAvatar}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <div className={styles.priestInfo}>
                        <p className={styles.priestName}>{p.rank} {p.name}</p>
                        <p className={styles.priestBio}>{p.bio}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3 — Date & time */}
            {booking.step === 3 && (
              <div className={styles.step3}>
                <h3 className={styles.stepHeading}>Выберите дату и время</h3>
                {booking.priest && (
                  <p className={styles.stepHint}>
                    {booking.priest.rank} {booking.priest.name} — доступные слоты
                  </p>
                )}

                {availableDates.length === 0 ? (
                  <p className={styles.noSlots}>Нет доступных дат</p>
                ) : (
                  <div className={styles.dateList}>
                    {availableDates.map((date) => {
                      const booked = getBookedSlots(booking.priest!.id);
                      const dayTimes =
                        booking.priest!.schedule.find((d) => d.date === date)?.times ?? [];
                      const freeTimes = dayTimes.filter(
                        (t) => !booked.some((b) => b.date === date && b.time === t),
                      );
                      return (
                        <div key={date} className={styles.dateBlock}>
                          <p className={styles.dateLabel}>{formatDate(date)}</p>
                          <div className={styles.timeGrid}>
                            {dayTimes.map((t) => {
                              const isFree      = freeTimes.includes(t);
                              const isSelected  = booking.date === date && booking.time === t;
                              return (
                                <button
                                  key={t}
                                  className={`${styles.timeBtn}
                                    ${isSelected ? styles.timeBtnSelected : ''}
                                    ${!isFree ? styles.timeBtnBlocked : ''}`}
                                  disabled={!isFree}
                                  onClick={() => setBooking((b) => ({ ...b, date, time: t }))}
                                  title={!isFree ? 'Занято' : ''}
                                >
                                  {t}
                                  {!isFree && <span className={styles.bookedLabel}>занято</span>}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4 — Confirm */}
            {booking.step === 4 && (
              <div className={styles.step4}>
                <h3 className={styles.stepHeading}>Ваши данные</h3>
                <div className={styles.confirmSummary}>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Услуга</span>
                    <span className={styles.summaryVal}>{service.name}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Батюшка</span>
                    <span className={styles.summaryVal}>
                      {booking.priest?.rank} {booking.priest?.name}
                    </span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Дата</span>
                    <span className={styles.summaryVal}>{formatDate(booking.date)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Время</span>
                    <span className={styles.summaryVal}>{booking.time}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span className={styles.summaryKey}>Стоимость</span>
                    <span className={`${styles.summaryVal} ${styles.summaryPrice}`}>
                      от {service.price} MDL
                    </span>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.formLabel}>Ваше имя *</label>
                  <input
                    className={styles.formInput}
                    value={booking.name}
                    onChange={(e) => setBooking((b) => ({ ...b, name: e.target.value }))}
                    placeholder="Имя Фамилия"
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Email *</label>
                  <input
                    className={styles.formInput}
                    type="email"
                    value={booking.email}
                    onChange={(e) => setBooking((b) => ({ ...b, email: e.target.value }))}
                    placeholder="your@email.com"
                    required
                  />
                </div>
                <div className={styles.formField}>
                  <label className={styles.formLabel}>Примечания</label>
                  <textarea
                    className={styles.formTextarea}
                    value={booking.notes}
                    onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))}
                    placeholder="Дополнительные пожелания…"
                    rows={3}
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Footer */}
        <div className={styles.modalFooter}>
          {booking.step > 1 && (
            <button className={styles.btnBack} onClick={handleBack}>
              ← Назад
            </button>
          )}
          <button
            className={styles.btnNext}
            onClick={handleNext}
            disabled={!canNext}
          >
            {booking.step === 4 ? 'Отправить заявку ✝' : 'Далее →'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Service card (catalog) ─────────────── */
const ServiceCard = ({
  service,
  onBook,
}: {
  service: ServiceItem;
  onBook: (s: ServiceItem) => void;
}) => {
  const [imgError, setImgError] = useState(false);
  return (
    <motion.article
      className={styles.serviceCard}
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      onClick={() => onBook(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onBook(service)}
      style={{ '--accent': service.accent } as React.CSSProperties}
    >
      <div className={styles.cardImageWrap}>
        {!imgError ? (
          <img
            src={service.image}
            alt={service.name}
            className={styles.cardImage}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.cardImageFallback} style={{ background: `${service.accent}22` }}>
            <span className={styles.cardImageFallbackText}>✝</span>
          </div>
        )}
        <div className={styles.cardImageOverlay} />
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{service.name}</h3>
        <p className={styles.cardDesc}>{service.shortDesc}</p>
        <div className={styles.cardFooter}>
          <span className={styles.cardPrice}>от {service.price} MDL</span>
          <span className={styles.cardDuration}>{service.duration}</span>
        </div>
        <div className={styles.cardCta}>Записаться →</div>
      </div>
    </motion.article>
  );
};

/* ── Main page ──────────────────────────── */
export default function ServicesPage() {
  const { priests, getBookedSlots, addOrder } = useServicesStore();
  const user = useAuthStore((s) => s.user);

  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  /* Lock body scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = activeService ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [activeService]);

  const handleSubmit = (booking: BookingState) => {
    if (!booking.priest) return;
    addOrder({
      serviceId:   activeService!.id,
      serviceName: activeService!.name,
      priestId:    booking.priest.id,
      priestName:  `${booking.priest.rank} ${booking.priest.name}`,
      clientName:  booking.name,
      clientEmail: booking.email,
      date:        booking.date,
      time:        booking.time,
      notes:       booking.notes,
    });
  };

  return (
    <>
      <SubNavBar title="Духовные требы" />

      <div className={styles.page}>
        {/* Hero section */}
        <div className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <p className={styles.heroEyebrow}>Православные таинства и обряды</p>
          <h1 className={styles.heroTitle}>Духовные требы</h1>
          <div className={styles.heroDivider} />
          <p className={styles.heroSubtitle}>
            Крещение · Молебны · Освящение · Венчание · Панихиды · Соборование
          </p>
        </div>

        {/* Services grid */}
        <div className={styles.grid}>
          {SERVICES.map((s) => (
            <ServiceCard key={s.id} service={s} onBook={setActiveService} />
          ))}
        </div>

        {/* Info block */}
        <div className={styles.infoBlock}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>
            Для записи выберите услугу, священнослужителя и удобное время.
            После подтверждения заявка поступит батюшке на рассмотрение.
            {!user && (
              <> <a href="/auth" className={styles.infoLink}>Войдите</a>, чтобы отслеживать статус заявки.</>
            )}
          </p>
        </div>
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {activeService && (
          <BookingModal
            service={activeService}
            onClose={() => setActiveService(null)}
            priests={priests}
            getBookedSlots={getBookedSlots}
            onSubmit={handleSubmit}
          />
        )}
      </AnimatePresence>
    </>
  );
}
