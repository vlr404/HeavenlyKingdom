import { useState, useEffect } from 'react';
import { useAuthStore } from '../../entity/auth/authStore';
import { api } from '../../api/client';
import styles from './Addresses.module.scss';

interface AddressDto { id: number; city: string; street: string; house: string; apartment?: string; isDefault: boolean; }
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
  const isAuthenticated = useAuthStore(s => s.isAuthenticated);
  const [addresses, setAddresses] = useState<AddressDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    api.get<AddressDto[]>('/addresses')
      .then(setAddresses)
      .catch(() => setAddresses([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.post<AddressDto>('/addresses', { ...form, isDefault: addresses.length === 0 });
      setAddresses(prev => [...prev, created]);
      setForm(emptyForm);
      setShowForm(false);
    } catch { /* ignore */ }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/addresses/${id}`);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch { /* ignore */ }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await api.put(`/addresses/${id}/set-default`, {});
      setAddresses(prev => prev.map(a => ({ ...a, isDefault: a.id === id })));
    } catch { /* ignore */ }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Адреса доставки</h2>
        {!showForm && <button className={styles.addBtn} onClick={() => setShowForm(true)}>+ Добавить адрес</button>}
      </div>

      {showForm && (
        <form className={styles.form} onSubmit={handleAdd}>
          <h3 className={styles.formTitle}>Новый адрес</h3>
          <div className={styles.formGrid}>
            {(['city','street','house','apartment'] as const).map(field => (
              <div className={styles.field} key={field}>
                <label className={styles.label}>{{ city:'Город', street:'Улица', house:'Дом', apartment:'Квартира' }[field]}</label>
                <input className={styles.input} value={form[field]} required={field !== 'apartment'}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  placeholder={{ city:'Кишинёв', street:'ул. Пушкина', house:'1', apartment:'1' }[field]} />
              </div>
            ))}
          </div>
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelBtn} onClick={() => { setShowForm(false); setForm(emptyForm); }}>Отмена</button>
            <button type="submit" className={styles.saveBtn}>Сохранить</button>
          </div>
        </form>
      )}

      {loading ? <div className={styles.empty}><p>Загрузка…</p></div>
        : addresses.length === 0 ? <div className={styles.empty}><p>Нет сохранённых адресов</p></div>
        : (
        <div className={styles.list}>
          {addresses.map(addr => (
            <div key={addr.id} className={`${styles.addressCard} ${addr.isDefault ? styles.addressCardDefault : ''}`}>
              <div className={styles.pinIcon}><PinIcon /></div>
              <div className={styles.addressBody}>
                <div className={styles.addressLine}>
                  <span className={styles.city}>{addr.city}</span>
                  {addr.isDefault && <span className={styles.defaultBadge}>По умолчанию</span>}
                </div>
                <span className={styles.addressDetail}>{addr.street}, д. {addr.house}{addr.apartment ? `, кв. ${addr.apartment}` : ''}</span>
              </div>
              <div className={styles.addressActions}>
                {!addr.isDefault && <button className={styles.defaultBtn} onClick={() => handleSetDefault(addr.id)}>Сделать основным</button>}
                <button className={styles.deleteBtn} onClick={() => handleDelete(addr.id)}><TrashIcon /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
