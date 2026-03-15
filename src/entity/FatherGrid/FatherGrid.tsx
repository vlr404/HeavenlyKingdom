import { useState } from 'react';
import './FatherGrid.css';
import { SocialMediaIcon } from '../../shared/SocialMediaIcon/SocialMediaIcon';
import type { SocialPlatform } from '../../shared/SocialMediaIcon/SocialMediaIcon';

type Father = {
    id: number;
    name: string;
    san: string;
    img: string;
    socials: Partial<Record<SocialPlatform, string>>;
};

const fathers: Father[] = [
    {
        id: 1,
        name: "УОЛТЕР",
        san: "Монах",
        img: "foto/Walter_White.png",
        socials: { instagram: "link", telegram: "link", youtube: "link" },
    },
    {
        id: 2,
        name: "ДЖЕССИ",
        san: "Иерей",
        img: "foto/Jesse_Pinkman.png",
        socials: { telegram: "link", facebook: "link" },
    },
    {
        id: 3,
        name: "СОЛ",
        san: "Диакон",
        img: "foto/Saul_Goodman.png",
        socials: { gmail: "mailto:saul@gmail.com" },
    },
    {
        id: 4,
        name: "ГУСТАВО",
        san: "Протоиерей",
        img: "foto/Gustavo_Fring.png",
        socials: { instagram: "link", facebook: "link", youtube: "link", telegram: "link" },
    },
    {
        id: 5,
        name: "СЕРГИЙ",
        san: "Настоятель",
        img: "foto/Gustavo_Fring.png",
        socials: { instagram: "l", facebook: "l", gmail: "l", youtube: "l", telegram: "l" },
    },
    {
        id: 6,
        name: "АНДРЕЙ",
        san: "Архимандрит",
        img: "foto/Jesse_Pinkman.png",
        socials: {},
    },
];

const VISIBLE_CARDS = 4;
const CARD_WIDTH    = 250;
const GAP           = 30;
const STEP          = CARD_WIDTH + GAP;

export const FatherGrid = () => {
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    const count      = fathers.length;
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
                    {fathers.map((father) => (
                        <div key={father.id} className="father-card">
                            <div className="father-grid__image">
                                <img src={father.img} alt={father.name} />
                                <SocialMediaIcon links={father.socials} wrap="y" />
                            </div>
                            <div className="father-grid__name">ОТЕЦ <br />{father.name}</div>
                            <div className="father-grid__san">{father.san}</div>
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