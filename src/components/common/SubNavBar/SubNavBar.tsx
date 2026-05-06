import { useNavigate } from 'react-router-dom';
import styles from './SubNavBar.module.scss';

interface SubNavBarProps {
  title?: string;
}

export const SubNavBar = ({ title }: SubNavBarProps) => {
  const navigate = useNavigate();
  return (
    <nav className={styles.subNavBar} aria-label="Вторичная навигация">
      <button
        className={styles.backBtn}
        onClick={() => navigate(-1)}
        aria-label="Вернуться назад"
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Назад
      </button>
      {title && <span className={styles.title}>{title}</span>}
    </nav>
  );
};
