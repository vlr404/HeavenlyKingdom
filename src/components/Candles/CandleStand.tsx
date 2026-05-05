import { useState, useEffect, useRef } from 'react';
import './CandleStand.css';
import type { PlacedCandle, CandleType } from '../../pages/OnlineCandlePage';
import { CANDLE_DEFS } from '../../pages/OnlineCandlePage';

interface Props {
  placed: PlacedCandle[];
  onDrop: (type: CandleType, slotIndex: number) => void;
  onExpire: (id: string) => void;
}

/* ─────────────────────────────────────────────
   Candelabrum geometry  (viewBox 720 × 520)
   Slot spacing: 58 px — tighter than before
───────────────────────────────────────────── */
const CX = 360;

const SLOTS = [
  { x: 186, holderY: 370, armY: 422 },   // 0 far-left
  { x: 244, holderY: 326, armY: 378 },   // 1
  { x: 302, holderY: 283, armY: 333 },   // 2
  { x: 360, holderY: 234, armY: null  }, // 3 center — on main column
  { x: 418, holderY: 283, armY: 333 },   // 4
  { x: 476, holderY: 326, armY: 378 },   // 5
  { x: 534, holderY: 370, armY: 422 },   // 6 far-right
] as const;

const COL_TOP = 234;
const COL_BOT = 446;

/* Gold / brass palette */
const M  = '#b8852c';
const MH = '#e2bd4c';   // bright highlight
const MS = '#7a521a';   // shadow
const MD = '#c49830';   // mid-tone

/* Cubic bezier arm */
const arm = (slot: (typeof SLOTS)[number]): string => {
  if (slot.armY === null) return '';
  const isLeft  = slot.x < CX;
  const edge    = isLeft ? CX - 7 : CX + 7;
  const midX    = (edge + slot.x) / 2;
  const rise    = slot.armY - slot.holderY - 8;
  const ctrl2Y  = slot.armY - rise * 0.6;
  return `M ${edge} ${slot.armY} C ${midX} ${slot.armY} ${slot.x} ${ctrl2Y} ${slot.x} ${slot.holderY + 8}`;
};

const fmtMs = (ms: number): string => {
  if (ms <= 0) return 'догорела';
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h >= 48) return `${Math.floor(h / 24)}д`;
  if (h >= 1)  return `${h}ч ${m}м`;
  return `${m}м`;
};

export const CandleStand = ({ placed, onDrop, onExpire }: Props) => {
  const [tick,         setTick]         = useState(0);
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null);
  const [newIds,       setNewIds]       = useState<Set<string>>(new Set());
  const prevIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const id = setInterval(() => {
      const now = Date.now();
      placed.forEach(c => {
        if (now - c.placedAt >= CANDLE_DEFS[c.type].burnMs) onExpire(c.id);
      });
      setTick(t => t + 1);
    }, 30_000);
    return () => clearInterval(id);
  }, [placed, onExpire]);

  useEffect(() => {
    const fresh = placed.filter(c => !prevIds.current.has(c.id));
    if (!fresh.length) return;
    const ids = new Set(fresh.map(c => c.id));
    setNewIds(p => new Set([...p, ...ids]));
    const t = setTimeout(() => setNewIds(p => { const n = new Set(p); ids.forEach(id => n.delete(id)); return n; }), 1000);
    prevIds.current = new Set(placed.map(c => c.id));
    return () => clearTimeout(t);
  }, [placed]);

  useEffect(() => { prevIds.current = new Set(placed.map(c => c.id)); }, []);

  const onOver  = (e: React.DragEvent, i: number) => { if (!placed.some(c => c.slotIndex === i)) { e.preventDefault(); setDragOverSlot(i); } };
  const onLeave = (i: number) => setDragOverSlot(s => s === i ? null : s);
  const onDrop_ = (e: React.DragEvent, i: number) => {
    e.preventDefault(); setDragOverSlot(null);
    const type = e.dataTransfer.getData('candleType') as CandleType | '';
    if (type) onDrop(type, i);
  };

  const now = Date.now();
  void tick;

  return (
    <div className="cs">
      <svg viewBox="0 0 720 520" className="cs__svg" preserveAspectRatio="xMidYMid meet">
        <defs>
          {/* Flame outer glow — warm amber */}
          <filter id="fglow" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="6" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Slot hover glow */}
          <filter id="sglow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="4" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Cross golden glow */}
          <filter id="crossGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          {/* Flame outer gradient */}
          <radialGradient id="flOuter" cx="50%" cy="72%" r="55%">
            <stop offset="0%"   stopColor="#fffde8"/>
            <stop offset="25%"  stopColor="#ffb300"/>
            <stop offset="100%" stopColor="#ff4400" stopOpacity="0"/>
          </radialGradient>
          {/* Flame inner core gradient */}
          <radialGradient id="flInner" cx="50%" cy="68%" r="50%">
            <stop offset="0%"   stopColor="#ffffff"/>
            <stop offset="50%"  stopColor="#fff5b0"/>
            <stop offset="100%" stopColor="#ffcc00" stopOpacity="0.4"/>
          </radialGradient>
          {/* Cross nimbus radial */}
          <radialGradient id="nimbusGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor={MH} stopOpacity="0.18"/>
            <stop offset="100%" stopColor={MH} stopOpacity="0"/>
          </radialGradient>
          {/* Metal horizontal gradient (arms) */}
          <linearGradient id="mg" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={MS}/>
            <stop offset="40%"  stopColor={MH}/>
            <stop offset="100%" stopColor={MS}/>
          </linearGradient>
          {/* Column / bars gradient */}
          <linearGradient id="colGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor={MS}/>
            <stop offset="45%"  stopColor={MH}/>
            <stop offset="100%" stopColor={MS}/>
          </linearGradient>
          {/* Base tier gradient */}
          <linearGradient id="baseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={MD}/>
            <stop offset="100%" stopColor={MS}/>
          </linearGradient>
          <linearGradient id="baseGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor={M}/>
            <stop offset="100%" stopColor={MS}/>
          </linearGradient>
        </defs>

        {/* ══════════════════════════════════════════
            LAYER 0 — Orthodox cross with glory nimbus
        ══════════════════════════════════════════ */}
        {/* Nimbus background glow */}
        <circle cx={CX} cy={72} r={86} fill="url(#nimbusGrad)" className="cs__nimbus"/>

        <g className="cs__cross" filter="url(#crossGlow)">
          {/* Glory rays (16 subtle lines) */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i * 22.5 - 90) * Math.PI / 180;
            const x1 = CX + 56 * Math.cos(angle);
            const y1 = 72 + 56 * Math.sin(angle);
            const x2 = CX + 76 * Math.cos(angle);
            const y2 = 72 + 76 * Math.sin(angle);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={MH} strokeWidth={1.5} opacity={0.20}/>;
          })}
          {/* Outer halo ring */}
          <circle cx={CX} cy={72} r={54} fill="none" stroke={MH} strokeWidth={1.5} opacity={0.24} strokeDasharray="6 10"/>
          {/* Inner halo ring */}
          <circle cx={CX} cy={72} r={46} fill="none" stroke={MH} strokeWidth={0.7} opacity={0.15}/>

          {/* Vertical bar */}
          <rect x={CX - 4} y={25} width={8} height={COL_TOP - 25} rx={2.5} fill="url(#colGrad)"/>
          {/* Titulus Crucis — short upper bar */}
          <rect x={CX - 23} y={41} width={46} height={6.5} rx={3} fill="url(#colGrad)"/>
          {/* Main crossbar */}
          <rect x={CX - 53} y={70} width={106} height={8.5} rx={4} fill="url(#colGrad)"/>
          {/* Slanted footrest (left high → right low — Orthodox) */}
          <line x1={CX - 28} y1={140} x2={CX + 28} y2={167}
                stroke={MH} strokeWidth={5.5} strokeLinecap="round"/>

          {/* Top finial (double sphere) */}
          <circle cx={CX} cy={20} r={12} fill={MH}/>
          <circle cx={CX} cy={20} r={5.5} fill={MS} opacity={0.45}/>
          {/* Titulus end spheres */}
          <circle cx={CX - 23} cy={44.5} r={5}   fill={MH}/>
          <circle cx={CX + 23} cy={44.5} r={5}   fill={MH}/>
          {/* Crossbar end spheres */}
          <circle cx={CX - 53} cy={74.5} r={7}   fill={MH}/>
          <circle cx={CX - 53} cy={74.5} r={3}   fill={MS} opacity={0.45}/>
          <circle cx={CX + 53} cy={74.5} r={7}   fill={MH}/>
          <circle cx={CX + 53} cy={74.5} r={3}   fill={MS} opacity={0.45}/>
          {/* Center medallion at cross intersection */}
          <circle cx={CX} cy={74.5} r={6}   fill={MH}/>
          <circle cx={CX} cy={74.5} r={2.5} fill={MS} opacity={0.55}/>
          {/* Column junction sphere */}
          <circle cx={CX} cy={COL_TOP} r={9.5} fill={MH}/>
          <circle cx={CX} cy={COL_TOP} r={4}   fill={MS} opacity={0.4}/>
        </g>

        {/* ══════════════════════════════════════════
            LAYER 1 — Golgotha base (3 tiers)
        ══════════════════════════════════════════ */}
        {/* Ground shadow */}
        <ellipse cx={CX} cy={COL_BOT + 31} rx={182} ry={7} fill="#000" opacity={0.45}/>
        {/* Tier 3 — widest */}
        <rect x={182} y={COL_BOT + 16} width={356} height={15} rx={5.5} fill="url(#baseGrad2)"/>
        <rect x={182} y={COL_BOT + 16} width={356} height={2.5} rx={1} fill={MH} opacity={0.48}/>
        {/* Decorative corner balls on bottom tier */}
        <circle cx={191} cy={COL_BOT + 23} r={5.5} fill={MH}/>
        <circle cx={529} cy={COL_BOT + 23} r={5.5} fill={MH}/>
        {/* Tier 2 */}
        <rect x={214} y={COL_BOT + 8} width={292} height={10} rx={4.5} fill="url(#baseGrad)"/>
        <rect x={214} y={COL_BOT + 8} width={292} height={2}  rx={1}  fill={MH} opacity={0.58}/>
        {/* Tier 1 — narrowest top */}
        <rect x={246} y={COL_BOT}     width={228} height={10} rx={4}  fill={MD}/>
        <rect x={246} y={COL_BOT}     width={228} height={2}  rx={1}  fill={MH} opacity={0.7}/>
        {/* Column base pedestal */}
        <rect x={CX - 17} y={COL_BOT - 20} width={34} height={22} rx={4} fill="url(#colGrad)"/>
        <ellipse cx={CX} cy={COL_BOT - 20} rx={19} ry={5.5} fill={MH} opacity={0.72}/>

        {/* ══════════════════════════════════════════
            LAYER 2 — Main vertical column
        ══════════════════════════════════════════ */}
        <rect x={CX - 7} y={COL_TOP} width={14} height={COL_BOT - COL_TOP} rx={3.5} fill="url(#colGrad)"/>
        {/* Column rings — 4 decorative bands */}
        {[COL_TOP + 43, COL_TOP + 90, COL_TOP + 137, COL_TOP + 181].map(y => (
          <g key={y}>
            <rect x={CX - 11} y={y - 5} width={22} height={10} rx={4} fill={MH}/>
            <ellipse cx={CX} cy={y - 5} rx={11} ry={2.5} fill="#fff" opacity={0.12}/>
          </g>
        ))}
        {/* Central medallion */}
        <ellipse cx={CX} cy={COL_TOP + 114} rx={14} ry={20} fill="url(#colGrad)"/>
        <circle  cx={CX} cy={COL_TOP + 114} r={8}   fill={MH} opacity={0.9}/>
        <circle  cx={CX} cy={COL_TOP + 114} r={4}   fill={MS} opacity={0.6}/>
        <circle  cx={CX} cy={COL_TOP + 114} r={1.5} fill={MH} opacity={0.7}/>

        {/* ══════════════════════════════════════════
            LAYER 3 — Arms (curved bezier)
        ══════════════════════════════════════════ */}
        {SLOTS.map((s, i) =>
          s.armY !== null ? (
            <path key={i} d={arm(s)} fill="none" stroke="url(#mg)" strokeWidth={7} strokeLinecap="round"/>
          ) : null
        )}
        {/* Column junction spheres */}
        {SLOTS.map((s, i) =>
          s.armY !== null ? (
            <g key={i}>
              <circle cx={CX} cy={s.armY} r={6.5} fill={MH}/>
              <circle cx={CX} cy={s.armY} r={2.5} fill={MS} opacity={0.45}/>
            </g>
          ) : null
        )}
        {/* Arm-end spheres (arm–holder junction) */}
        {SLOTS.map((s, i) => (
          <g key={i}>
            <circle cx={s.x} cy={s.holderY + 9} r={5} fill={MH}/>
            <circle cx={s.x} cy={s.holderY + 9} r={2} fill={MS} opacity={0.4}/>
          </g>
        ))}

        {/* ══════════════════════════════════════════
            LAYER 4 — Candle cups
        ══════════════════════════════════════════ */}
        {SLOTS.map((s, i) => (
          <g key={i}>
            {/* Cup shadow */}
            <ellipse cx={s.x} cy={s.holderY + 13} rx={11.5} ry={3.5} fill={MS} opacity={0.45}/>
            {/* Cup body — flared trapezoid */}
            <path d={`M ${s.x-6.5} ${s.holderY} L ${s.x-10} ${s.holderY+13} L ${s.x+10} ${s.holderY+13} L ${s.x+6.5} ${s.holderY} Z`}
                  fill={M}/>
            {/* Cup highlight stripe */}
            <path d={`M ${s.x-2} ${s.holderY} L ${s.x-3} ${s.holderY+13} L ${s.x+1} ${s.holderY+13} L ${s.x+2} ${s.holderY} Z`}
                  fill={MH} opacity={0.25}/>
            {/* Cup rim */}
            <ellipse cx={s.x} cy={s.holderY}      rx={7.5} ry={2.8} fill={MH}/>
          </g>
        ))}

        {/* ══════════════════════════════════════════
            LAYER 5 — Candles / empty slot indicators
        ══════════════════════════════════════════ */}
        {SLOTS.map((slot, si) => {
          const candle  = placed.find(c => c.slotIndex === si) ?? null;
          const isHover = dragOverSlot === si;

          /* ── Placed candle ── */
          if (candle) {
            const def        = CANDLE_DEFS[candle.type];
            const elapsed    = now - candle.placedAt;
            const burnPct    = Math.max(0, 1 - elapsed / def.burnMs);
            const waxH       = Math.max(5, def.maxWaxH * burnPct);
            const waxTop     = slot.holderY - waxH;
            const wickTip    = waxTop - 4;
            const flameBaseY = wickTip;
            const fRx = candle.type === 'festive' ? 7  : candle.type === 'large' ? 6  : 5;
            const fRy = candle.type === 'festive' ? 14 : candle.type === 'large' ? 12 : 10;
            const fCy = flameBaseY - fRy;
            const remaining  = def.burnMs - elapsed;
            const isNew      = newIds.has(candle.id);
            const dimOpacity = Math.max(0.35, burnPct);

            return (
              <g key={si}>
                {/* Wax column */}
                <rect
                  x={slot.x - 5.5} y={waxTop}
                  width={11}        height={waxH}
                  rx={3}            fill={def.waxColor}
                  opacity={0.65 + burnPct * 0.35}
                />
                {/* Wax top glint */}
                <ellipse cx={slot.x} cy={waxTop} rx={5.5} ry={1.8} fill="#fff" opacity={0.22}/>
                {/* Wick */}
                <line x1={slot.x} y1={waxTop} x2={slot.x} y2={wickTip}
                      stroke="#6b5030" strokeWidth={1.3} strokeLinecap="round"/>

                {/* Timer — above flame */}
                <text
                  x={slot.x} y={fCy - fRy - 10}
                  textAnchor="middle" fontSize={8}
                  fill={burnPct < 0.2 ? '#ff6622' : '#8a6c38'}
                  fontFamily="Montserrat, sans-serif"
                >
                  {fmtMs(remaining)}
                </text>

                {/* Flame — scaleY-only animation, no horizontal drift */}
                <g filter="url(#fglow)" style={{ opacity: dimOpacity }}>
                  <ellipse
                    className={isNew ? 'fl-outer fl-ignite' : 'fl-outer fl-burn'}
                    cx={slot.x} cy={fCy}
                    rx={fRx}    ry={fRy}
                    fill="url(#flOuter)"
                  />
                  <ellipse
                    className={isNew ? 'fl-inner fl-ignite' : 'fl-inner fl-burn'}
                    cx={slot.x}   cy={fCy + Math.round(fRy * 0.25)}
                    rx={fRx - 2}  ry={Math.round(fRy * 0.55)}
                    fill="url(#flInner)"
                    opacity={0.92}
                  />
                </g>

                {/* Prayer note */}
                {candle.note && (
                  <text
                    x={slot.x} y={slot.holderY + 32}
                    textAnchor="middle" fontSize={8}
                    fill={candle.intention === 'health' ? '#78a870' : '#a07868'}
                    fontFamily="Montserrat, sans-serif"
                  >
                    {candle.intention === 'health' ? '✦' : '✝'}{' '}
                    {candle.note.slice(0, 9)}{candle.note.length > 9 ? '…' : ''}
                  </text>
                )}
              </g>
            );
          }

          /* ── Empty slot — drop zone ── */
          return (
            <g key={si}>
              <circle
                cx={slot.x} cy={slot.holderY - 22}
                r={isHover ? 15 : 11}
                fill={isHover ? 'rgba(255,107,0,0.14)' : 'none'}
                stroke={isHover ? '#ff6b00' : '#2a2a2a'}
                strokeWidth={isHover ? 1.5 : 1}
                strokeDasharray={isHover ? '0' : '4 3'}
                filter={isHover ? 'url(#sglow)' : undefined}
                style={{ transition: 'r 0.12s, fill 0.12s, stroke 0.12s' }}
              />
              {!isHover && (
                <text x={slot.x} y={slot.holderY - 17}
                      textAnchor="middle" fontSize="10"
                      fill="#303030" fontWeight="300">+</text>
              )}
              {/* Invisible drag hit area */}
              <rect
                x={slot.x - 26} y={slot.holderY - 90}
                width={52}      height={100}
                fill="transparent"
                style={{ cursor: 'copy' }}
                onDragOver={e  => onOver(e, si)}
                onDragEnter={e => { e.preventDefault(); setDragOverSlot(si); }}
                onDragLeave={() => onLeave(si)}
                onDrop={e      => onDrop_(e, si)}
              />
            </g>
          );
        })}
      </svg>

      {placed.length === 0 && (
        <p className="cs__hint">Перетащите свечу из инвентаря на подсвечник</p>
      )}
    </div>
  );
};
