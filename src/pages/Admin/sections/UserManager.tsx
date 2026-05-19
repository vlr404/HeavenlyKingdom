import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { useAuthStore } from '../../../entity/auth/authStore';

interface UserRow {
  id: number;
  name: string;
  lastName: string;
  email: string;
  role: number;
}

const ROLE_LABELS: Record<number, string> = { 0: 'Пользователь', 1: 'Батюшка', 2: 'Администратор' };
const ROLE_COLORS: Record<number, string> = {
  0: 'rgba(255,255,255,0.08)',
  1: 'rgba(67,160,71,0.18)',
  2: 'rgba(255,107,0,0.18)',
};
const ROLE_TEXT: Record<number, string> = { 0: '#9aa0a6', 1: '#43a047', 2: '#ff6b00' };

interface EditState {
  id: number;
  name: string;
  lastName: string;
  email: string;
}

export const UserManager = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const currentUserId = useAuthStore((s) => s.user?.id);

  useEffect(() => {
    api.get<UserRow[]>('/admin/users')
      .then(setUsers)
      .catch(() => setError('Не удалось загрузить пользователей'))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (id: number, role: number) => {
    const prev = users.find((u) => u.id === id);
    setUsers((list) => list.map((u) => (u.id === id ? { ...u, role } : u)));
    try {
      const updated = await api.put<UserRow>(`/admin/users/${id}/role`, { role });
      setUsers((list) => list.map((u) => (u.id === id ? updated : u)));
    } catch {
      if (prev) setUsers((list) => list.map((u) => (u.id === id ? prev : u)));
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Удалить пользователя?')) return;
    setUsers((list) => list.filter((u) => u.id !== id));
    try {
      await api.delete<void>(`/admin/users/${id}`);
    } catch {
      api.get<UserRow[]>('/admin/users').then(setUsers).catch(() => {});
    }
  };

  const openEdit = (u: UserRow) => {
    setEditError('');
    setEditState({ id: u.id, name: u.name, lastName: u.lastName, email: u.email });
  };

  const handleEditSave = async () => {
    if (!editState) return;
    setSaving(true);
    setEditError('');
    try {
      const updated = await api.put<UserRow>(`/admin/users/${editState.id}`, {
        name: editState.name,
        lastName: editState.lastName,
        email: editState.email,
      });
      setUsers((list) => list.map((u) => (u.id === editState.id ? updated : u)));
      setEditState(null);
    } catch {
      setEditError('Ошибка при сохранении. Попробуйте ещё раз.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p style={{ color: 'var(--admin-text-dim)' }}>Загрузка...</p>;
  if (error) return <p style={{ color: 'var(--admin-danger)' }}>{error}</p>;

  return (
    <div>
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Пользователи</h1>
          <p className="admin__subtitle">Управление учётными записями — {users.length} чел.</p>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Имя</th>
              <th>Email</th>
              <th>Роль</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td style={{ color: 'var(--admin-text-dim)', width: 48 }}>{u.id}</td>
                <td>{u.name} {u.lastName}</td>
                <td style={{ color: 'var(--admin-text-dim)' }}>{u.email}</td>
                <td>
                  <span style={{
                    display: 'inline-block',
                    padding: '2px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    background: ROLE_COLORS[u.role] ?? ROLE_COLORS[0],
                    color: ROLE_TEXT[u.role] ?? ROLE_TEXT[0],
                  }}>
                    {ROLE_LABELS[u.role] ?? 'Неизвестно'}
                  </span>
                </td>
                <td>
                  <div className="row" style={{ gap: 8, flexWrap: 'nowrap' }}>
                    <select
                      className="select"
                      style={{ height: 32, fontSize: 13, padding: '0 8px' }}
                      value={u.role}
                      disabled={String(u.id) === currentUserId}
                      onChange={(e) => handleRoleChange(u.id, Number(e.target.value))}
                    >
                      <option value={0}>Пользователь</option>
                      <option value={1}>Батюшка</option>
                      <option value={2}>Администратор</option>
                    </select>
                    <button
                      className="btn btn--ghost btn--sm"
                      onClick={() => openEdit(u)}
                      title="Редактировать"
                    >
                      ✎
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      disabled={String(u.id) === currentUserId}
                      onClick={() => handleDelete(u.id)}
                      title="Удалить"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editState && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div className="card" style={{ width: 400, margin: 0 }}>
            <h3 className="card__title">Редактировать пользователя</h3>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Имя</label>
              <input
                className="input"
                value={editState.name}
                onChange={(e) => setEditState((s) => s && ({ ...s, name: e.target.value }))}
              />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Фамилия</label>
              <input
                className="input"
                value={editState.lastName}
                onChange={(e) => setEditState((s) => s && ({ ...s, lastName: e.target.value }))}
              />
            </div>
            <div className="field" style={{ marginBottom: editError ? 8 : 16 }}>
              <label>Email</label>
              <input
                className="input"
                type="email"
                value={editState.email}
                onChange={(e) => setEditState((s) => s && ({ ...s, email: e.target.value }))}
              />
            </div>
            {editError && (
              <p style={{ color: 'var(--admin-danger)', fontSize: 13, margin: '0 0 12px' }}>
                {editError}
              </p>
            )}
            <div className="row" style={{ gap: 8 }}>
              <button className="btn btn--ghost" onClick={() => setEditState(null)}>Отмена</button>
              <button className="btn" onClick={handleEditSave} disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
