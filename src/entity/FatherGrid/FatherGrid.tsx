import { useState } from 'react';
import './FatherGrid.css';
import { SocialMediaIcon } from '../../components/common/SocialMediaIcon/SocialMediaIcon';
import { FATHERS_DATA } from '../../data/fatherData';

const VISIBLE_CARDS = 4;
const CARD_WIDTH    = 250;
const GAP           = 30;
const STEP          = CARD_WIDTH + GAP;

export const FatherGrid = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const count      = FATHERS_DATA.length;
    const isCentered = count < VISIBLE_CARDS;
    const isFirst    = currentIndex === 0;
    const isLast     = currentIndex >= count - VISIBLE_CARDS;

    const nextSlide = () => {
        if (!isLast) setCurrentIndex(prev => prev + 1);
    };

    const prevSlide = () => {
        if (!isFirst) setCurrentIndex(prev => prev - 1);
    };

    return (
        <div className="father-slider-layout">
            <button
                className={`slider-arrow left ${isFirst ? 'hidden' : ''}`}
                onClick={prevSlide}
            >
                ‹
            </button>

            <div className="father-slider-viewport">
                <div
                    className={`father-slider-track ${isCentered ? 'father-slider-track-cent' : ''}`}
                    style={{ transform: `translateX(-${currentIndex * STEP}px)` }}
                >
                    {FATHERS_DATA.map((father) => (
                        <div key={father.id} className="father-card">
                            <div className="father-grid__image">
                                <img src={father.img} alt={father.name} />
                                <SocialMediaIcon links={father.socials} wrap="y" />
                            </div>
                            <div className="father-grid__name">ОТЕЦ <br />{father.name.toUpperCase()}</div>
                            <div className="father-grid__san">{father.rank}</div>
                        </div>
                    ))}
                </div>
            </div>

            <button
                className={`slider-arrow right ${isLast ? 'hidden' : ''}`}
                onClick={nextSlide}
            >
                ›
            </button>
        </div>
    );
};