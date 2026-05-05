import { useState, useEffect, useRef } from 'react';
import './OnlineCandlePage.css';
import { CandleShop } from '../components/Candles/CandleShop';
import { CandleStand } from '../components/Candles/CandleStand';

export type CandleType = 'simple' | 'large' | 'festive';

export interface CandleDef {
  label: string;
  desc: string;
  price: number;
  burnMs: number;
  burnLabel: string;
  waxColor: string;
  maxWaxH: number;
}

export const CANDLE_DEFS: Record<CandleType, CandleDef> = {
  simple:  { label: 'Простая',     desc: 'Тихая молитва',    price: 15, burnMs: 24 * 3600 * 1000,     burnLabel: '24 часа', waxColor: '#ede0be', maxWaxH: 44 },
  large:   { label: 'Большая',     desc: 'Особое прошение',  price: 35, burnMs: 3 * 24 * 3600 * 1000, burnLabel: '3 дня',   waxColor: '#fce6b0', maxWaxH: 62 },
  festive: { label: 'Праздничная', desc: 'Торжественная',    price: 75, burnMs: 7 * 24 * 3600 * 1000, burnLabel: '7 дней',  waxColor: '#fff5b0', maxWaxH: 80 },
};

export interface PlacedCandle {
  id: string;
  type: CandleType;
  slotIndex: number;
  note: string;
  intention: 'health' | 'peace';
  placedAt: number;
}

export type Inventory = Record<CandleType, number>;

interface PendingDrop { type: CandleType; slotIndex: number }

// Replace with a church choir audio file URL
const AMBIENT_SRC = 'https://archive.org/download/pachebelcanon/pachebelcanon.mp3';

export default function OnlineCandlePage() {
  const [inventory, setInventory] = useState<Inventory>({ simple: 0, large: 0, festive: 0 });
  const [placed,    setPlaced]    = useState<PlacedCandle[]>([]);
  const [pending,   setPending]   = useState<PendingDrop | null>(null);
  const [noteText,  setNoteText]  = useState('');
  const [intention, setIntention] = useState<'health' | 'peace'>('health');
  const [isAmbient, setIsAmbient] = useState(false);
  const audioRef    = useRef<HTMLAudioElement | null>(null);
  const inputRef    = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const a = new Audio(AMBIENT_SRC);
    a.loop   = true;
    a.volume = 0.25;
    audioRef.current = a;
    return () => { a.pause(); a.src = ''; };
  }, []);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    isAmbient ? a.play().catch(() => {}) : a.pause();
  }, [isAmbient]);

  useEffect(() => {
    if (pending) setTimeout(() => inputRef.current?.focus(), 60);
  }, [pending]);

  const handleBuy = (type: CandleType) =>
    setInventory(p => ({ ...p, [type]: p[type] + 1 }));

  const handleDrop = (type: CandleType, slotIndex: number) => {
    if (placed.some(c => c.slotIndex === slotIndex)) return;
    if (inventory[type] <= 0) return;
    setInventory(p => ({ ...p, [type]: p[type] - 1 }));
    setPending({ type, slotIndex });
    setNoteText('');
    setIntention('health');
  };

  const confirmNote = () => {
    if (!pending) return;
    setPlaced(p => [...p, {
      id: `c-${Date.now()}`,
      type: pending.type,
      slotIndex: pending.slotIndex,
      note: noteText.trim(),
      intention,
      placedAt: Date.now(),
    }]);
    setPending(null);
  };

  const cancelNote = () => {
    if (!pending) return;
    setInventory(p => ({ ...p, [pending.type]: p[pending.type] + 1 }));
    setPending(null);
  };

  const removeCandle = (id: string) =>
    setPlaced(p => p.filter(c => c.id !== id));

  return (
    <div className="cp">
      <div className="cp__bg" />

      {/* ── UX#2: Ambient choir toggle ── */}
      <button
        className={`cp__ambient ${isAmbient ? 'cp__ambient--on' : ''}`}
        onClick={() => setIsAmbient(v => !v)}
        title={isAmbient ? 'Выключить пение хора' : 'Включить пение хора'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
        </svg>
        {isAmbient ? 'Хор включён' : 'Пение хора'}
      </button>

      <header className="cp__header">
        <p className="cp__eyebrow">Онлайн часовня</p>
        <h1 className="cp__title">Поставить свечу</h1>
        <p className="cp__sub">Выберите и купите свечу · Перетащите её на подсвечник · Оставьте молитву</p>
      </header>

      <div className="cp__body">
        <div className="cp__stand-wrap">
          <CandleStand placed={placed} onDrop={handleDrop} onExpire={removeCandle} />
        </div>
        <aside className="cp__shop-wrap">
          <CandleShop inventory={inventory} onBuy={handleBuy} />
        </aside>
      </div>

      {/* ── UX#1: Prayer note modal ── */}
      {pending && (
        <div className="cp__overlay" onClick={cancelNote}>
          <div className="cp__modal" onClick={e => e.stopPropagation()}>

            <div className="cp__modal-icon" aria-hidden="true">
              <svg viewBox="0 0 28 52" width="28" height="52">
                <defs>
                  <radialGradient id="mflame" cx="50%" cy="65%" r="55%">
                    <stop offset="0%"   stopColor="#fffbe0"/>
                    <stop offset="40%"  stopColor="#ff9500"/>
                    <stop offset="100%" stopColor="#ff4500" stopOpacity="0"/>
                  </radialGradient>
                </defs>
                <ellipse cx="14" cy="24" rx="11" ry="22" fill="url(#mflame)"/>
                <ellipse cx="14" cy="30" rx="6"  ry="12" fill="#fffbe0" opacity="0.7"/>
              </svg>
            </div>

            <h2 className="cp__modal-title">Записка к свече</h2>

            {/* ── UX#1: Intention tabs ── */}
            <div className="cp__modal-tabs">
              <button className={intention === 'health' ? 'active' : ''} onClick={() => setIntention('health')}>
                За здравие
              </button>
              <button className={intention === 'peace'  ? 'active' : ''} onClick={() => setIntention('peace')}>
                За упокой
              </button>
            </div>

            <input
              ref={inputRef}
              className="cp__modal-input"
              placeholder="Введите имя (необязательно)…"
              value={noteText}
              onChange={e => setNoteText(e.target.value)}
              maxLength={40}
              onKeyDown={e => { if (e.key === 'Enter') confirmNote(); if (e.key === 'Escape') cancelNote(); }}
            />

            <p className="cp__modal-meta">
              {CANDLE_DEFS[pending.type].label} · горит {CANDLE_DEFS[pending.type].burnLabel}
            </p>

            <div className="cp__modal-btns">
              <button className="cp__modal-confirm" onClick={confirmNote}>Поставить свечу</button>
              <button className="cp__modal-cancel"  onClick={cancelNote}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
