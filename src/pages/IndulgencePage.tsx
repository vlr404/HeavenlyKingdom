import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './IndulgencePage.css';

/* ── Types ─────────────────────────────────────────────── */
import { SINS, type SinType, type SinDef } from '../data/sinsData';

export type { SinType, SinDef };

export interface IndulgenceState {
  selected: SinType | null;
  gravity:  number;
  redeemed: boolean;
}

const GRAVITY_MULTIPLIERS: Record<number, number> = {
  1: 1.0, 2: 1.2, 3: 1.5, 4: 1.9, 5: 2.5,
  6: 3.2, 7: 4.1, 8: 5.3, 9: 7.0, 10: 10.0,
};

const GRAVITY_LABELS: Record<number, string> = {
  1: 'Простительный', 2: 'Лёгкий', 3: 'Заметный',
  4: 'Тяжкий',        5: 'Серьёзный', 6: 'Тяжкий смертный',
  7: 'Опасный',       8: 'Смертный', 9: 'Роковой', 10: 'Непростительный',
};

/* ── SVG geometry (static — no rotation) ──────────────── */
const CX           = 230;
const CY           = 230;
const OUTER_R      = 212;
const INNER_R      = 64;
const N            = SINS.length;
const STEP         = (2 * Math.PI) / N;
const GAP          = 0.025;
const LABEL_R      = (OUTER_R + INNER_R) / 2;
const HOVER_OUTER  = OUTER_R + 10;
const HOVER_INNER  = INNER_R - 4;

function pt(r: number, a: number) {
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function arc(i: number, oR: number, iR: number): string {
  const a0 = i * STEP - Math.PI / 2 + GAP;
  const a1 = a0 + STEP - GAP * 2;
  const large = a1 - a0 > Math.PI ? 1 : 0;
  const o0 = pt(oR, a0), o1 = pt(oR, a1);
  const i0 = pt(iR, a1), i1 = pt(iR, a0);
  return `M${o0.x} ${o0.y} A${oR} ${oR} 0 ${large} 1 ${o1.x} ${o1.y} L${i0.x} ${i0.y} A${iR} ${iR} 0 ${large} 0 ${i1.x} ${i1.y}Z`;
}

/* Pre-compute static paths and label positions */
const STATIC_PATHS  = SINS.map((_, i) => arc(i, OUTER_R, INNER_R));
const HOVER_PATHS   = SINS.map((_, i) => arc(i, HOVER_OUTER, HOVER_INNER));
const LABEL_COORDS  = SINS.map((_, i) => {
  const mid = i * STEP - Math.PI / 2 + STEP / 2;
  return pt(LABEL_R, mid);
});

/* ── Ember particles ───────────────────────────────────── */
const EMBERS = Array.from({ length: 12 }, (_, i) => ({
  id:       i,
  left:     `${8 + (i * 7.3) % 84}%`,
  bottom:   `${(i * 13.7) % 22}%`,
  size:     2 + (i % 3),
  duration: 5 + (i % 4) * 1.5,
  delay:    (i * 0.8) % 5,
  color:    i % 2 === 0 ? '#ff4500' : '#ff8c00',
}));

/* ── Component ─────────────────────────────────────────── */
export default function IndulgencePage() {
  const [state,   setState]   = useState<IndulgenceState>({ selected: null, gravity: 5, redeemed: false });
  const [hovered, setHovered] = useState<SinType | null>(null);
  const [holy,    setHoly]    = useState(false);
  const [shimmer, setShimmer] = useState(false);

  const selectedDef = useMemo(() => SINS.find(s => s.id === state.selected) ?? null, [state.selected]);
  const hoveredDef  = useMemo(() => SINS.find(s => s.id === hovered)        ?? null, [hovered]);
  const multiplier  = GRAVITY_MULTIPLIERS[state.gravity];
  const finalPrice  = selectedDef ? Math.round(selectedDef.basePrice * multiplier) : 0;
  const sliderPct   = `${((state.gravity - 1) / 9) * 100}%`;

  const handleClick = useCallback((sin: SinType) => {
    setState(p => ({ ...p, selected: sin, redeemed: false }));
  }, []);

  const handleRedeem = useCallback(() => {
    if (!state.selected) return;
    setShimmer(true);
    setTimeout(() => setShimmer(false), 650);
    setHoly(true);
    setTimeout(() => setHoly(false), 1500);
    setState(p => ({ ...p, redeemed: true }));
  }, [state.selected]);

  const handleReset = useCallback(() => {
    setState(p => ({ ...p, selected: null, redeemed: false }));
  }, []);

  return (
    <div className="ip">
      {/* Holy-light overlay */}
      <motion.div
        className="ip__holy"
        animate={{ opacity: holy ? 1 : 0 }}
        transition={{ duration: holy ? 0.25 : 1.1 }}
      />

      {/* Embers */}
      <div className="ip__bg" aria-hidden="true">
        {EMBERS.map(e => (
          <div
            key={e.id}
            className="ip__ember"
            style={{
              left: e.left, bottom: e.bottom,
              width: e.size, height: e.size,
              background: e.color,
              animationDuration: `${e.duration}s`,
              animationDelay:    `${e.delay}s`,
              boxShadow: `0 0 ${e.size * 2}px ${e.color}`,
            }}
          />
        ))}
      </div>

      {/* Main body — centered inside calc(100vh - 70px) */}
      <div className="ip__body">

        {/* ── Wheel column ── */}
        <div className="ip__wheel-col">
          <p className="ip__page-title">Колесо Инферно</p>

          {/* SVG wheel — STATIC, no rotation */}
          <div className="ip__wheel-wrap">
            <svg
              className="ip__wheel-svg"
              viewBox="0 0 460 460"
              aria-label="Колесо семи смертных грехов"
            >
              <defs>
                {SINS.map(s => (
                  <radialGradient key={s.id} id={`g-${s.id}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%"   stopColor={s.fill}    />
                    <stop offset="100%" stopColor="#080808"   />
                  </radialGradient>
                ))}
                <radialGradient id="g-center" cx="50%" cy="50%" r="50%">
                  <stop offset="0%"   stopColor="#1e0808" />
                  <stop offset="100%" stopColor="#000000" />
                </radialGradient>
                <filter id="seg-glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {SINS.map((sin, i) => {
                const isHov = hovered  === sin.id;
                const isSel = state.selected === sin.id;
                const active = isHov || isSel;
                const d = active ? HOVER_PATHS[i] : STATIC_PATHS[i];
                const { x: lx, y: ly } = LABEL_COORDS[i];

                return (
                  <g
                    key={sin.id}
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHovered(sin.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleClick(sin.id)}
                  >
                    <path
                      d={d}
                      fill={`url(#g-${sin.id})`}
                      stroke={active ? sin.glow : 'rgba(60,0,0,0.7)'}
                      strokeWidth={isSel ? 2.5 : active ? 1.8 : 1}
                      style={{
                        filter:     active ? `drop-shadow(0 0 8px ${sin.glow}99)` : undefined,
                        transition: 'stroke 0.15s, stroke-width 0.15s, filter 0.15s',
                      }}
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={sin.id === 'gluttony' ? 10 : 11.5}
                      fontFamily="Arsenal, serif"
                      fontWeight="600"
                      fill={isSel ? '#ffffff' : active ? sin.glow : 'rgba(255,255,255,0.72)'}
                      textRendering="optimizeLegibility"
                      style={{
                        pointerEvents:          'none',
                        WebkitFontSmoothing:    'antialiased',
                        transition:             'fill 0.15s',
                        userSelect:             'none',
                        paintOrder:             'stroke fill',
                        stroke:                 isSel ? sin.glow : 'none',
                        strokeWidth:            isSel ? 0.4 : 0,
                      }}
                    >
                      {sin.name}
                    </text>
                  </g>
                );
              })}

              {/* Center disc */}
              <circle cx={CX} cy={CY} r={INNER_R - 3} fill="url(#g-center)" />
              <circle cx={CX} cy={CY} r={INNER_R - 3} fill="none" stroke="rgba(160,20,0,0.45)" strokeWidth="1.5" />
              <line x1={CX} y1={CY - 26} x2={CX} y2={CY + 26} stroke="rgba(180,40,40,0.4)" strokeWidth="1.5" />
              <line x1={CX - 18} y1={CY - 10} x2={CX + 18} y2={CY - 10} stroke="rgba(180,40,40,0.4)" strokeWidth="1.5" />
            </svg>

            {/* HTML center overlay */}
            <div className="ip__center-overlay">
              <AnimatePresence mode="wait">
                {state.selected ? (
                  <motion.div
                    key={state.selected}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{   opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.18 }}
                    className="ip__center-sel"
                    style={{ color: selectedDef?.glow }}
                  >
                    <span className="ip__center-name">{selectedDef?.name}</span>
                    <span className="ip__center-latin">{selectedDef?.latin}</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ip__center-idle"
                  >
                    ✝
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Hover tooltip */}
          <div className="ip__tooltip-wrap">
            <AnimatePresence mode="wait">
              <motion.div
                key={hoveredDef?.id ?? 'empty'}
                className="ip__tooltip"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{   opacity: 0, y: -4 }}
                transition={{ duration: 0.14 }}
              >
                {hoveredDef ? (
                  <>
                    <span className="ip__tooltip-name" style={{ color: hoveredDef.glow }}>
                      {hoveredDef.name} · {hoveredDef.latin}
                    </span>
                    {hoveredDef.desc}
                  </>
                ) : (
                  <span className="ip__tooltip-hint">
                    Наведите на сегмент колеса для описания
                  </span>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── Control panel ── */}
        <aside className="ip__panel">

          {/* Selected sin */}
          <div className="ip__card">
            <p className="ip__card-label">Выбранный грех</p>
            <AnimatePresence mode="wait">
              {selectedDef ? (
                <motion.div
                  key={selectedDef.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{   opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="ip__sin-name" style={{ color: selectedDef.glow }}>
                    {selectedDef.name}
                  </div>
                  <div className="ip__sin-latin">{selectedDef.latin}</div>
                  <div className="ip__sin-price">
                    База: <strong>{selectedDef.basePrice} MDL</strong>
                  </div>
                </motion.div>
              ) : (
                <p className="ip__sin-empty">Нажмите на сегмент колеса</p>
              )}
            </AnimatePresence>
          </div>

          {/* Gravity slider */}
          <div className="ip__card">
            <p className="ip__card-label">Тяжесть греха</p>
            <div className="ip__grav-row">
              <span className="ip__grav-val">{state.gravity}</span>
              <span className="ip__grav-tag">
                {GRAVITY_LABELS[state.gravity]}
                <br />
                <em>×{multiplier.toFixed(1)}</em>
              </span>
            </div>
            <input
              type="range"
              min={1} max={10} step={1}
              value={state.gravity}
              className="ip__slider"
              style={{ '--sp': sliderPct } as React.CSSProperties}
              onChange={e => setState(p => ({ ...p, gravity: +e.target.value }))}
            />
            <div className="ip__ticks">
              {[1,2,3,4,5,6,7,8,9,10].map(n => (
                <span key={n} className={`ip__tick${n === state.gravity ? ' ip__tick--on' : ''}`}>{n}</span>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="ip__card">
            <p className="ip__card-label">Стоимость индульгенции</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${state.selected ?? 'none'}-${state.gravity}`}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.14 }}
              >
                <div className="ip__price">
                  <span className="ip__price-amt">{selectedDef ? finalPrice : '—'}</span>
                  <span className="ip__price-cur">MDL</span>
                </div>
                {selectedDef && (
                  <p className="ip__price-formula">
                    <em>{selectedDef.basePrice}</em> × <em>{multiplier.toFixed(1)}</em> = <em>{finalPrice} MDL</em>
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Redeem */}
          <div className="ip__card">
            <p className="ip__card-label">Искупление</p>
            {state.redeemed ? (
              <motion.div
                className="ip__redeemed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="ip__redeemed-cross"
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }}
                >
                  ✝
                </motion.div>
                <p className="ip__redeemed-title">Грех искуплен</p>
                <p className="ip__redeemed-sub">
                  {selectedDef?.name} · тяжесть {state.gravity}
                </p>
                <button className="ip__reset-btn" onClick={handleReset}>
                  Выбрать другой грех
                </button>
              </motion.div>
            ) : (
              <button
                className="ip__redeem-btn"
                disabled={!state.selected}
                onClick={handleRedeem}
              >
                {shimmer && <span className="ip__shimmer" aria-hidden="true" />}
                Искупить грех
              </button>
            )}
          </div>

        </aside>
      </div>
    </div>
  );
}
