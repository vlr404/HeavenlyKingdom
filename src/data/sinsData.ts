export type SinType = 'pride' | 'greed' | 'lust' | 'wrath' | 'gluttony' | 'envy' | 'sloth';

export interface SinDef {
  id:        SinType;
  name:      string;
  latin:     string;
  desc:      string;
  basePrice: number;
  fill:      string;
  glow:      string;
}

export const SINS: SinDef[] = [
  { id: 'pride',    name: 'Гордыня',     latin: 'Superbia', desc: 'Высокомерие, ставящее себя выше Бога и ближнего. Первородный грех Люцифера.',  basePrice: 420, fill: '#3a0060', glow: '#b044ff' },
  { id: 'greed',    name: 'Алчность',    latin: 'Avaritia', desc: 'Ненасытное стремление к богатству и власти сверх всякой меры.',               basePrice: 380, fill: '#4a3800', glow: '#d4a017' },
  { id: 'lust',     name: 'Похоть',      latin: 'Luxuria',  desc: 'Неумеренное плотское влечение, порабощающее душу и тело.',                    basePrice: 300, fill: '#5a0020', glow: '#ff1a5e' },
  { id: 'wrath',    name: 'Гнев',        latin: 'Ira',      desc: 'Неконтролируемая ярость, несущая разрушение себе и окружающим.',              basePrice: 340, fill: '#5a1000', glow: '#ff4500' },
  { id: 'gluttony', name: 'Чревоугодие', latin: 'Gula',     desc: 'Неумеренность в еде и питье, превращающая тело в идола.',                     basePrice: 180, fill: '#1e2e00', glow: '#88c000' },
  { id: 'envy',     name: 'Зависть',     latin: 'Invidia',  desc: 'Горькое желание чужого блага, порождающее злобу и ненависть.',                basePrice: 260, fill: '#002414', glow: '#00c060' },
  { id: 'sloth',    name: 'Уныние',      latin: 'Acedia',   desc: 'Духовная апатия и нежелание трудиться ради Бога и ближнего.',                 basePrice: 150, fill: '#101028', glow: '#6080ff' },
];
