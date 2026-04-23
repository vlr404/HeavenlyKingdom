import { useState } from 'react';
import type { Address } from '../../types/account';
import styles from './Addresses.module.scss';

const MOCK_ADDRESSES: Address[] = [
  {
    id: '1',
    city: 'Москва',
    street: 'ул. Тверская',
    house: '15',
    apartment: '42',
    isDefault: true,
  },
  {
    id: '2',
    city: 'Санкт-Петербург',
    street: 'Невский пр-т',
    house: '88',
    apartment: '12',
    isDefault: false,
  },
];

const emptyForm = { city: '', street: '', house: '', apartment: '' };

const PinIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
);

const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newAddr: Address = {
      id: String(Date.now()),
      ...form,
      isDefault: addresses.length === 0,
    };
    setAddresses((prev) => [...prev, newAddr]);
    setForm(emptyForm);
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Адреса доставки</h2>
        {!showForm && (
          <button className={styles.addBtn} onClick={() => setShowForm(true)}>
            + Добавить адрес
          </button>
        )}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleAdd}>
          <h3 className={styles.formTitle}>Новый адрес</h3>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label className={styles.label}>Город</label>
              <input
                className={styles.input}
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                required
                placeholder="Москва"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Улица</label>
              <input
                className={styles.input}
                value={form.street}
                onChange={(e) => setForm((f) => ({ ...f, street: e.target.value }))}
                required
                placeholder="ул. Примерная"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Дом</label>
              <input
                className={styles.input}
                value={form.house}
                onChange={(e) => setForm((f) => ({ ...f, house: e.target.value }))}
                required
                placeholder="1"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Квартира</label>
              <input
                className={styles.input}
                value={form.apartment}
                onChange={(e) => setForm((f) => ({ ...f, apartment: e.target.value }))}
                placeholder="1"
              />
            </div>
          </div>
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => { setShowForm(false); setForm(emptyForm); }}
            >
              Отмена
            </button>
            <button type="submit" className={styles.saveBtn}>
              Сохранить
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className={styles.empty}>
          <p>Нет сохранённых адресов</p>
        </div>
      ) : (
        <div className={styles.list}>
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ''}`}
            >
              <div className={styles.pinIcon}>
                <PinIcon />
              </div>
              <div className={styles.addressBody}>
                <div className={styles.addressLine}>
                  <span className={styles.city}>{addr.city}</span>
                  {addr.isDefault && (
                    <span className={styles.defaultBadge}>По умолчанию</span>
                  )}
                </div>
                <span className={styles.addressDetail}>
                  {addr.street}, д. {addr.house}
                  {addr.apartment ? `, кв. ${addr.apartment}` : ''}
                </span>
              </div>
              <div className={styles.addressActions}>
                {!addr.isDefault && (
                  <button
                    className={styles.defaultBtn}
                    onClick={() => handleSetDefault(addr.id)}
                  >
                    Сделать основным
                  </button>
                )}
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(addr.id)}
                  title="Удалить адрес"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
