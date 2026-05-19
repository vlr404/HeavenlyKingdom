import { useState } from 'react';
import { useAuthStore } from '../../../entity/auth/authStore';
import { api } from '../../../api/client';

export const AdminProfile = () => {
  const { user, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '' });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await api.put<{ name: string; lastName: string; email: string }>(
        `/admin/users/${user?.id}`,
        { name: form.name, lastName: form.lastName, email: form.email },
      );
      updateUser({ name: updated.name, lastName: updated.lastName, email: updated.email });
      setEditing(false);
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  const handleCancel = () => {
    setForm({ name: user?.name ?? '', lastName: user?.lastName ?? '', email: user?.email ?? '' });
    setEditing(false);
  };

  const initials = `${form.name.charAt(0)}${form.lastName?.charAt(0) ?? ''}`.toUpperCase();

  return (
    <div>
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Профиль администратора</h1>
          <p className="admin__subtitle">Управление своей учётной записью</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'var(--admin-accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>
            {initials || 'A'}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{form.name} {form.lastName}</div>
            <div style={{ color: 'var(--admin-text-dim)', fontSize: 13 }}>Администратор</div>
          </div>
        </div>

        <div className="field" style={{ marginBottom: 12 }}>
          <label>Имя</label>
          <input
            className="input"
            value={form.name}
            disabled={!editing}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="field" style={{ marginBottom: 12 }}>
          <label>Фамилия</label>
          <input
            className="input"
            value={form.lastName}
            disabled={!editing}
            onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
          />
        </div>
        <div className="field" style={{ marginBottom: 20 }}>
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            disabled={!editing}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>

        <div className="row" style={{ gap: 8 }}>
          {!editing ? (
            <button className="btn" onClick={() => setEditing(true)}>Редактировать</button>
          ) : (
            <>
              <button className="btn btn--ghost" onClick={handleCancel}>Отмена</button>
              <button className="btn" onClick={handleSave} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
