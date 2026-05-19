import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, roleFromNumber } from '../entity/auth/authStore';
import BackButton from '../components/common/BackButton/BackButton';
import { api } from '../api/client';
import styles from './Auth.module.scss';

type Tab = 'login' | 'register';

interface UserResponseDto {
  id: number;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  role: number;
}

const Auth = () => {
  const [tab, setTab] = useState<Tab>('login');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchTab = (t: Tab) => {
    setTab(t);
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post<UserResponseDto>('/user/login', {
        email: loginForm.email,
        password: loginForm.password,
      });
      const role = roleFromNumber(data.role);
      login({
        id: String(data.id),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar || undefined,
        role,
      });
      navigate(role === 'ADMIN' ? '/admin' : role === 'PRIEST' ? '/priest-cabinet' : '/account');
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      if (e.status === 401) setError('Неверный email или пароль');
      else if (!e.status) setError('Нет связи с сервером');
      else setError('Ошибка сервера');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (registerForm.password !== registerForm.confirm) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      const data = await api.post<UserResponseDto>('/user/register', {
        name: registerForm.name,
        lastName: '',
        email: registerForm.email,
        password: registerForm.password,
      });
      login({
        id: String(data.id),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: roleFromNumber(data.role),
      });
      navigate('/account');
    } catch (err: unknown) {
      const e = err as { status?: number };
      if (e.status === 409) setError('Этот email уже занят');
      else if (!e.status) setError('Нет связи с сервером');
      else setError('Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.backWrap}>
        <BackButton />
      </div>
      <div className={styles.card}>
        <div className={styles.cross}>✞</div>
        <h1 className={styles.title}>Царствие Небесное</h1>
        <p className={styles.subtitle}>Православный интернет-магазин</p>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === 'login' ? styles.activeTab : ''}`}
            onClick={() => switchTab('login')}
          >
            Войти
          </button>
          <button
            className={`${styles.tab} ${tab === 'register' ? styles.activeTab : ''}`}
            onClick={() => switchTab('register')}
          >
            Зарегистрироваться
          </button>
        </div>

        {tab === 'login' ? (
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={loginForm.email}
                onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Пароль</label>
              <input
                className={styles.input}
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                required
                placeholder="••••••••"
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Входим…' : 'Войти'}
            </button>
          </form>
        ) : (
          <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.field}>
              <label className={styles.label}>Имя</label>
              <input
                className={styles.input}
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm((f) => ({ ...f, name: e.target.value }))}
                required
                placeholder="Ваше имя"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                required
                placeholder="your@email.com"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Пароль</label>
              <input
                className={styles.input}
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                required
                placeholder="••••••••"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Подтверждение пароля</label>
              <input
                className={styles.input}
                type="password"
                value={registerForm.confirm}
                onChange={(e) => setRegisterForm((f) => ({ ...f, confirm: e.target.value }))}
                required
                placeholder="••••••••"
              />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Регистрация…' : 'Зарегистрироваться'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Auth;
