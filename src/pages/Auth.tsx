import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../entity/auth/authStore';
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
  isAdmin: boolean;
  isFather: boolean;
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
      login({
        id: String(data.id),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        avatar: data.avatar || undefined,
        isAdmin: data.isAdmin,
        isFather: data.isFather,
      });
      navigate(data.isAdmin ? '/admin' : data.isFather ? '/priest-cabinet' : '/account');
    } catch (err: unknown) {
      const e = err as { status?: number; message?: string };
      setError(e.status === 401 ? 'Неверный email или пароль' : 'Ошибка сервера');
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
        username: registerForm.email,
      });
      login({
        id: String(data.id),
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        isAdmin: data.isAdmin,
        isFather: data.isFather,
      });
      navigate('/account');
    } catch (err: unknown) {
      const e = err as { status?: number };
      setError(e.status === 409 ? 'Этот email уже занят' : 'Ошибка регистрации');
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
