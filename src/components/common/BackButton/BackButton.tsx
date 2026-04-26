import { useNavigate } from 'react-router-dom';
import styles from './BackButton.module.scss';

interface Props {
  label?: string;
}

const BackButton = ({ label = 'Назад' }: Props) => {
  const navigate = useNavigate();

  return (
    <button
      className={styles.btn}
      onClick={() => navigate(-1)}
      aria-label="Вернуться назад"
    >
      <svg
        className={styles.icon}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      <span>{label}</span>
    </button>
  );
};

export default BackButton;
