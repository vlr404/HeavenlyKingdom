import { useState, useEffect } from 'react';
import './FatherGrid.css';
import { SocialMediaIcon } from '../../components/common/SocialMediaIcon/SocialMediaIcon';
import { api } from '../../api/client';

interface FatherDto {
  id: number;
  name: string;
  lastName: string;
  san: string;
  img: string;
  instagram?: string;
  telegram?: string;
  youtube?: string;
  facebook?: string;
  gmail?: string;
}

const VISIBLE_CARDS = 4;
const CARD_WIDTH    = 250;
const GAP           = 30;
const STEP          = CARD_WIDTH + GAP;

export const FatherGrid = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fathers, setFathers] = useState<FatherDto[]>([]);

  useEffect(() => {
    api.get<FatherDto[]>('/father')
      .then((data) => setFathers(data))
      .catch(() => {});
  }, []);

  if (fathers.length === 0) return null;

  const count      = fathers.length;
  const isCentered = count <= VISIBLE_CARDS;
  const isFirst    = currentIndex === 0;
  const isLast     = currentIndex >= count - VISIBLE_CARDS;

  return (
    <div className="father-slider-layout">
      <button
        className={`slider-arrow left ${isFirst ? 'hidden' : ''}`}
        onClick={() => !isFirst && setCurrentIndex((p) => p - 1)}
      >
        ‹
      </button>

      <div className="father-slider-viewport">
        <div
          className={`father-slider-track ${isCentered ? 'father-slider-track-cent' : ''}`}
          style={{ transform: `translateX(-${currentIndex * STEP}px)` }}
        >
          {fathers.map((father) => (
            <div key={father.id} className="father-card">
              <div className="father-grid__image">
                <img
                  src={father.img}
                  alt={father.name}
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <SocialMediaIcon
                  links={{
                    instagram: father.instagram,
                    telegram:  father.telegram,
                    youtube:   father.youtube,
                    facebook:  father.facebook,
                    gmail:     father.gmail,
                  }}
                  wrap="y"
                />
              </div>
              <div className="father-grid__name">
                ОТЕЦ <br />{father.name.toUpperCase()}
                {father.lastName ? ` ${father.lastName.toUpperCase()}` : ''}
              </div>
              <div className="father-grid__san">{father.san}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className={`slider-arrow right ${isLast || isCentered ? 'hidden' : ''}`}
        onClick={() => !isLast && setCurrentIndex((p) => p + 1)}
      >
        ›
      </button>
    </div>
  );
};
