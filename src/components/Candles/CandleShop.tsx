import './CandleShop.css';
import type { CandleType, Inventory } from '../../pages/OnlineCandlePage';
import { CANDLE_DEFS } from '../../pages/OnlineCandlePage';
import { DraggableCandle } from './DraggableCandle';

const TYPES: CandleType[] = ['simple', 'large', 'festive'];

const CandleSVG = ({ type }: { type: CandleType }) => {
  const def  = CANDLE_DEFS[type];
  const waxH = type === 'simple' ? 30 : type === 'large' ? 44 : 58;
  const flW  = type === 'simple' ? 7  : type === 'large' ? 9  : 11;
  const flH  = type === 'simple' ? 12 : type === 'large' ? 15 : 19;
  const total = waxH + flH + 20;
  return (
    <svg viewBox={`0 0 28 ${total}`} width="22" height={total * 0.9}>
      <defs>
        <radialGradient id={`sg-${type}`} cx="50%" cy="65%" r="55%">
          <stop offset="0%"   stopColor="#fffbe0"/>
          <stop offset="40%"  stopColor="#ff9500"/>
          <stop offset="100%" stopColor="#ff4500" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <ellipse cx="14" cy={flH}       rx={flW}   ry={flH}   fill={`url(#sg-${type})`} className="shop-flame"/>
      <ellipse cx="14" cy={flH + 4}   rx={flW-3} ry={flH-5} fill="#fffbe0" opacity="0.8"/>
      <line x1="14" y1={flH * 2 - 1} x2="14" y2={flH * 2 + 4} stroke="#666" strokeWidth="1.2"/>
      <rect x="5" y={flH * 2 + 4} width="18" height={waxH} rx="2.5" fill={def.waxColor}/>
      <ellipse cx="14" cy={flH * 2 + 4} rx="9" ry="2.5" fill={def.waxColor} opacity="0.6"/>
    </svg>
  );
};

interface Props {
  inventory: Inventory;
  onBuy: (type: CandleType) => void;
}

export const CandleShop = ({ inventory, onBuy }: Props) => {
  const totalCandles = (Object.values(inventory) as number[]).reduce((a, b) => a + b, 0);

  return (
    <div className="cshop">
      <div className="cshop__head">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ff8c00" strokeWidth="2" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="6"/>
          <path d="M12 6c-2.2 0-4 2-4 5v9h8V11c0-3-1.8-5-4-5z"/>
          <line x1="8" y1="20" x2="16" y2="20"/>
        </svg>
        Церковная лавка
      </div>

      <ul className="cshop__list">
        {TYPES.map(type => {
          const def = CANDLE_DEFS[type];
          return (
            <li key={type} className="cshop__item">
              <div className="cshop__candle-icon">
                <CandleSVG type={type} />
              </div>
              <div className="cshop__info">
                <span className="cshop__name">{def.label}</span>
                <span className="cshop__desc">{def.desc} · {def.burnLabel}</span>
              </div>
              <div className="cshop__right">
                <span className="cshop__price">{def.price} MDL</span>
                <button className="cshop__buy" onClick={() => onBuy(type)}>Купить</button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="cshop__divider" />

      <div className="cshop__inv-head">
        Ваши свечи
        {totalCandles > 0 && <span className="cshop__inv-count">{totalCandles}</span>}
      </div>

      <div className="cshop__inv">
        {TYPES.map(type => (
          <DraggableCandle key={type} type={type} count={inventory[type]} />
        ))}
      </div>

      {totalCandles === 0 && (
        <p className="cshop__empty-hint">Купите свечу, чтобы поставить её на подсвечник</p>
      )}
    </div>
  );
};
