import { useState, useEffect } from 'react';
import './BlockVideo.css';
import { useMedia } from '../../../context/MediaContext';

type VideoItem = {
    id: string;
    title: string;
    author: string;
    previewImg: string;
    embedUrl: string;
};

const getYoutubeData = async (url: string): Promise<VideoItem | null> => {
    try {
        const videoId = url.match(
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
        )?.[1];
        if (!videoId) return null;

        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await response.json() as { title: string; author_name: string; thumbnail_url: string };

        return {
            id: videoId,
            title: data.title,
            author: data.author_name,
            previewImg: data.thumbnail_url,
            embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=1`,
        };
    } catch {
        return null;
    }
};

export const BlockVideo = () => {
    const { videoUrls } = useMedia();
    const [videos, setVideos]               = useState<VideoItem[]>([]);
    const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
    const [loading, setLoading]             = useState<boolean>(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const results = await Promise.all(videoUrls.map(getYoutubeData));
            setVideos(results.filter((v): v is VideoItem => v !== null));
            setLoading(false);
        };
        load();
    }, [videoUrls]);

    return (
        <div className="video-list">
            {loading ? (
                <p>Загрузка видео...</p>
            ) : (
                videos.map((video, index) => (
                    <div
                        key={`${video.id}-${index}`}
                        className="video-card-wide"
                        onClick={() => setSelectedVideo(video)}
                    >
                        <div className="video-preview">
                            <img src={video.previewImg} alt={video.title} />
                            <div className="play-overlay"><div className="play-button">▶</div></div>
                        </div>
                        <div className="video-info">
                            <h3>{video.title}</h3>
                            <p>{video.author}</p>
                        </div>
                    </div>
                ))
            )}

            {selectedVideo && (
                <div className="video-modal" onClick={() => setSelectedVideo(null)}>
                    <div className="modal-inner" onClick={(e) => e.stopPropagation()}>
                        <iframe
                            src={selectedVideo.embedUrl}
                            allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                            title="video"
                        />
                        <div className="modal-text">
                            <h2>{selectedVideo.title}</h2>
                            <p>Автор: {selectedVideo.author}</p>
                            <button onClick={() => setSelectedVideo(null)}>Закрыть</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};