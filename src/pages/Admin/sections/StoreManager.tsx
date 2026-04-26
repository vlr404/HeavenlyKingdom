import { useMemo, useState } from 'react';
import type { StoreManagerProps } from '../../../types/admin';

export const StoreManager = ({
  products,
  categories,
  onToggleSale,
  onUpdateSalePrice,
  onAddCategory,
  onRemoveCategory,
}: StoreManagerProps) => {
  const [newCat, setNewCat] = useState<string>('');
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? products : products.filter((p) => p.cat === filter)),
    [products, filter],
  );

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const v = newCat.trim();
    if (!v) return;
    onAddCategory(v);
    setNewCat('');
  };

  return (
    <section>
      <div className="admin__header">
        <div>
          <h1 className="admin__title">Управление магазином</h1>
          <p className="admin__subtitle">Скидки и категории товаров</p>
        </div>
      </div>

      <div className="card">
        <h2 className="card__title">Категории</h2>
        <form onSubmit={handleAddCategory} className="row" style={{ marginBottom: 16 }}>
          <div className="field">
            <label htmlFor="cat-name">Новая категория</label>
            <input
              id="cat-name"
              className="input"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              placeholder="Например, Подарки"
            />
          </div>
          <button type="submit" className="btn">Добавить</button>
        </form>

        <div className="row">
          {categories.map((c) => (
            <span key={c} className="chip">
              {c}
              <button
                type="button"
                className="chip__remove"
                aria-label={`Удалить ${c}`}
                onClick={() => onRemoveCategory(c)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 className="card__title" style={{ margin: 0 }}>Товары ({filtered.length})</h2>
          <div className="field" style={{ maxWidth: 220 }}>
            <label htmlFor="f-cat">Фильтр по категории</label>
            <select
              id="f-cat"
              className="select"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Все категории</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <table className="table">
          <thead>
            <tr>
              <th>Фото</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Акция</th>
              <th>Цена со скидкой</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td><img src={p.img} alt={p.name} className="table__thumb" /></td>
                <td>
                  {p.name}
                  {p.onSale && <span className="badge badge--sale" style={{ marginLeft: 8 }}>Скидка</span>}
                </td>
                <td>{p.cat}</td>
                <td>{p.price.toLocaleString('ro-MD')} MDL</td>
                <td>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={p.onSale}
                      onChange={(e) => onToggleSale(p.id, e.target.checked)}
                    />
                    <span className="toggle__slider" />
                  </label>
                </td>
                <td>
                  <input
                    type="number"
                    className="input"
                    style={{ maxWidth: 120, height: 32 }}
                    disabled={!p.onSale}
                    value={p.salePrice ?? ''}
                    placeholder="—"
                    min={0}
                    onChange={(e) => onUpdateSalePrice(p.id, Number(e.target.value))}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
