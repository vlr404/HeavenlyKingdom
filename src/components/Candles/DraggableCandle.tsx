import './DraggableCandle.css';
import type { CandleType } from '../../pages/OnlineCandlePage';
import { CANDLE_DEFS } from '../../pages/OnlineCandlePage';

interface Props {
  type: CandleType;
  count: number;
}

export const DraggableCandle = ({ type, count }: Props) => {
  const def      = CANDLE_DEFS[type];
  const canDrag  = count > 0;

  const onDragStart = (e: React.DragEvent) => {
    if (!canDrag) { e.preventDefault(); return; }
    e.dataTransfer.setData('candleType', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  /* Tiny SVG candle icon scaled by candle type */
  const waxH = type === 'simple' ? 18 : type === 'large' ? 26 : 34;

  return (
    <div
      className={`dc ${canDrag ? 'dc--draggable' : 'dc--empty'}`}
      draggable={canDrag}
      onDragStart={onDragStart}
      title={canDrag ? `Перетащите ${def.label.toLowerCase()} на подсвечник` : 'Купите свечу'}
    >
      <div className="dc__icon" aria-hidden="true">
        <svg viewBox="0 0 20 60" width="14" height={waxH + 18}>
          <defs>
            <radialGradient id={`fg-${type}`} cx="50%" cy="60%" r="50%">
              <stop offset="0%"   stopColor="#fffbe0"/>
              <stop offset="45%"  stopColor="#ff9500"/>
              <stop offset="100%" stopColor="#ff4500" stopOpacity="0"/>
            </radialGradient>
          </defs>
          {/* Flame */}
          <ellipse cx="10" cy="7"  rx="5"  ry="7"  fill={`url(#fg-${type})`} className="dc__flame"/>
          <ellipse cx="10" cy="9"  rx="3"  ry="4"  fill="#fffbe0" opacity="0.8"/>
          {/* Wick */}
          <line x1="10" y1="13" x2="10" y2="16" stroke="#555" strokeWidth="1"/>
          {/* Wax */}
          <rect x="5" y="16" width="10" height={waxH} rx="2" fill={def.waxColor}/>
        </svg>
      </div>

      <div className="dc__info">
        <span className="dc__name">{def.label}</span>
        {canDrag && <span className="dc__hint">← тяни на подсвечник</span>}
      </div>

      <span className={`dc__badge ${count === 0 ? 'dc__badge--zero' : ''}`}>×{count}</span>
    </div>
  );
};
