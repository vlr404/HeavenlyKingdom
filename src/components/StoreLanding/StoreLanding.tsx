import styles from './StoreLanding.module.css';
import '../../styles/tokens.module.css';

export const StoreLanding = () => {
  const scrollToProducts = () => {
    document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.landing}>
      <p className={styles.eyebrow}>Православный магазин</p>
      <h1 className={styles.title}>Наш магазин</h1>
      <div className={styles.divider} />
      <p className={styles.subtitle}>Найдите всё, что вам нужно</p>
      <button className={styles.cta} onClick={scrollToProducts}>
        Перейти к покупкам ↓
      </button>
    </section>
  );
};
