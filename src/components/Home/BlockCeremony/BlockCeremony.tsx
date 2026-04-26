import { useState, useRef, useEffect } from 'react';
import './BlockCeremony.css';
import { useMedia } from '../../../context/MediaContext';
import type { CeremonyItem } from '../../../types/media';

export const BlockCeremony = () => {
    const { ceremonyItems } = useMedia();
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

    // Stop playback if the active item was removed in the admin panel
    useEffect(() => {
        if (activeId && !ceremonyItems.find(i => i.id === activeId)) {
            audioRef.current.pause();
            setActiveId(null);
            lastTrackIdRef.current = null;
        }
    }, [ceremonyItems, activeId]);

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
            {ceremonyItems.map((item) => (
                <div
                    key={item.id}
                    className={`ceremony-item ${activeId === item.id ? 'active' : ''}`}
                    onClick={() => handleSelect(item)}
                >
                    <img src={item.cover} alt={item.title} />
                    <div className="ceremony-overlay">
                        <span className="ceremony-title">{item.title}</span>
                        <span className="ceremony-music">{item.musicName}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};
