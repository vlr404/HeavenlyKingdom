import { useState, useRef } from 'react';
import { useAuthStore } from '../../entity/auth/authStore';
import styles from './ProfileSettings.module.scss';

const ProfileSettings = () => {
  const { user, updateUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    updateUser(form);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setForm({
      name: user?.name ?? '',
      lastName: user?.lastName ?? '',
      email: user?.email ?? '',
      phone: user?.phone ?? '',
    });
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateUser({ avatar: url });
  };

  const initials =
    `${form.name.charAt(0)}${form.lastName.charAt(0) || ''}`.toUpperCase();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Настройки профиля</h2>

      <div className={styles.avatarSection}>
        <div
          className={`${styles.avatar} ${isEditing ? styles.avatarEditable : ''}`}
          onClick={() => isEditing && fileRef.current?.click()}
        >
          {user?.avatar ? (
            <img src={user.avatar} alt="Аватар" />
          ) : (
            <span>{initials}</span>
          )}
          {isEditing && <div className={styles.avatarOverlay}>Изменить</div>}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className={styles.fileInput}
          onChange={handleAvatarChange}
        />
      </div>

      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Имя</label>
            <input
              className={`${styles.input} ${!isEditing ? styles.inputDisabled : ''}`}
              value={form.name}
              disabled={!isEditing}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Введите имя"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Фамилия</label>
            <input
              className={`${styles.input} ${!isEditing ? styles.inputDisabled : ''}`}
              value={form.lastName}
              disabled={!isEditing}
              onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
              placeholder="Введите фамилию"
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className={`${styles.input} ${!isEditing ? styles.inputDisabled : ''}`}
            type="email"
            value={form.email}
            disabled={!isEditing}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Телефон</label>
          <input
            className={`${styles.input} ${!isEditing ? styles.inputDisabled : ''}`}
            value={form.phone}
            disabled={!isEditing}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            placeholder="+7 (000) 000-00-00"
          />
        </div>
      </div>

      <div className={styles.actions}>
        {!isEditing ? (
          <button className={styles.editBtn} onClick={() => setIsEditing(true)}>
            Редактировать
          </button>
        ) : (
          <>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              Отмена
            </button>
            <button className={styles.saveBtn} onClick={handleSave}>
              Сохранить
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileSettings;
