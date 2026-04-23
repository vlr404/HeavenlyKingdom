import { useState, useRef, useEffect } from 'react';
import './BlockCeremony.css';

type CeremonyItem = {
    id: string;
    title: string;
    url: string;
    cover: string;
};

const ceremonyData: CeremonyItem[] = [
    { id: 'c1', title: 'Выход жениха',          url: '/audio/c1.mp3', cover: 'https://picsum.photos/id/20/300/300' },
    { id: 'c2', title: 'Выход невесты',          url: '/audio/c2.mp3', cover: 'https://picsum.photos/id/21/300/300' },
    { id: 'c3', title: 'Клятвы',                 url: '/audio/c3.mp3', cover: 'https://picsum.photos/id/22/300/300' },
    { id: 'c4', title: 'Обмен кольцами',         url: '/audio/c4.mp3', cover: 'https://picsum.photos/id/23/300/300' },
    { id: 'c5', title: 'Поцелуй',                url: '/audio/c5.mp3', cover: 'https://picsum.photos/id/24/300/300' },
    { id: 'c6', title: 'Вручение свидетельства', url: '/audio/c6.mp3', cover: 'https://picsum.photos/id/25/300/300' },
    { id: 'c7', title: 'Поздравления',           url: '/audio/c7.mp3', cover: 'https://picsum.photos/id/26/300/300' },
    { id: 'c8', title: 'Выход пары',             url: '/audio/c8.mp3', cover: 'https://picsum.photos/id/27/300/300' },
    { id: 'c9', title: 'Фуршет',                 url: '/audio/c9.mp3', cover: 'https://picsum.photos/id/28/300/300' },
];

export const BlockCeremony = () => {
    const [activeId, setActiveId]       = useState<string | null>(null);
    const audioRef                       = useRef<HTMLAudioElement>(new Audio());
    const lastTrackIdRef                 = useRef<string | null>(null);

    useEffect(() => {
        const audio = audioRef.current;

        const handlePause = () => setActiveId(null);
        const handlePlay  = () => {
            if (lastTrackIdRef.current) setActiveId(lastTrackIdRef.current);
        };

        audio.addEventListener('pause', handlePause);
        audio.addEventListener('play',  handlePlay);

        return () => {
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('play',  handlePlay);
            audio.pause();
        };
    }, []);

    const handleSelect = (item: CeremonyItem) => {
        const audio = audioRef.current;

        if (activeId === item.id) {
            audio.pause();
            return;
        }

        if (lastTrackIdRef.current !== item.id) {
            audio.pause();
            audio.src  = item.url;
            audio.loop = true;
            audio.load();
            lastTrackIdRef.current = item.id;
        }

        audio.play()
            .then(() => setActiveId(item.id))
            .catch((err: Error) => console.log('Ошибка воспроизведения:', err));
    };

    return (
        <div className="ceremony-grid-3x3">
            {ceremonyData.map((item) => (
                <div
                    key={item.id}
                    className={`ceremony-item ${activeId === item.id ? 'active' : ''}`}
                    onClick={() => handleSelect(item)}
                >
                    <img src={item.cover} alt={item.title} />
                    <div className="ceremony-overlay">
                        <span>{item.title}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
