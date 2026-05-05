import { useState } from 'react';
import './MediaManager.css';
import type { CeremonyItem, MusicTrack } from '../../../types/media';

type Tab = 'ceremony' | 'playlist' | 'video';

interface MediaManagerProps {
  ceremonyItems: CeremonyItem[];
  musicTracks: MusicTrack[];
  videoUrls: string[];
  onUpdateCeremony: (id: string, patch: Partial<CeremonyItem>) => void;
  onAddTrack: (track: MusicTrack) => void;
  onRemoveTrack: (id: string) => void;
  onAddVideo: (url: string) => void;
  onRemoveVideo: (url: string) => void;
}

export const MediaManager = ({
  ceremonyItems,
  musicTracks,
  videoUrls,
  onUpdateCeremony,
  onAddTrack,
  onRemoveTrack,
  onAddVideo,
  onRemoveVideo,
}: MediaManagerProps) => {
  const [tab, setTab] = useState<Tab>('ceremony');

  // ceremony edit state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Partial<CeremonyItem>>({});

  // new track form
  const [trackForm, setTrackForm] = useState({ title: '', author: '', url: '' });

  // new video form
  const [videoUrl, setVideoUrl] = useState('');

  const startEdit = (item: CeremonyItem) => {
    setEditingId(item.id);
    setEditDraft({ musicName: item.musicName, url: item.url });
  };

  const saveEdit = () => {
    if (editingId) onUpdateCeremony(editingId, editDraft);
    setEditingId(null);
    setEditDraft({});
  };

  const submitTrack = () => {
    const t = trackForm;
    if (!t.title.trim() || !t.url.trim()) return;
    onAddTrack({
      id: `custom-${Date.now()}`,
      title: t.title.trim(),
      author: t.author.trim() || 'Неизвестно',
      url: t.url.trim(),
      cover: `${import.meta.env.BASE_URL}icons/logo.png`,
    });
    setTrackForm({ title: '', author: '', url: '' });
  };

  const submitVideo = () => {
    const u = videoUrl.trim();
    if (!u) return;
    onAddVideo(u);
    setVideoUrl('');
  };

  return (
    <div className="media-manager">
      <h2 className="media-manager__heading">Медиа</h2>

      <div className="media-manager__tabs">
        <button className={tab === 'ceremony' ? 'active' : ''} onClick={() => setTab('ceremony')}>Церемонии</button>
        <button className={tab === 'playlist' ? 'active' : ''} onClick={() => setTab('playlist')}>Плейлист</button>
        <button className={tab === 'video'    ? 'active' : ''} onClick={() => setTab('video')}>Видео</button>
      </div>

      {/* ── CEREMONY TAB ─────────────────────────── */}
      {tab === 'ceremony' && (
        <div className="media-manager__section">
          <p className="media-manager__hint">Нажмите «Изменить» чтобы обновить название музыки или URL аудиофайла.</p>
          <table className="media-table">
            <thead>
              <tr>
                <th>Событие</th>
                <th>Музыка</th>
                <th>URL аудио</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {ceremonyItems.map(item => (
                <tr key={item.id}>
                  <td className="ceremony-event-name">{item.title}</td>
                  {editingId === item.id ? (
                    <>
                      <td>
                        <input
                          className="media-input"
                          value={editDraft.musicName ?? ''}
                          onChange={e => setEditDraft(d => ({ ...d, musicName: e.target.value }))}
                          placeholder="Название музыки"
                        />
                      </td>
                      <td>
                        <input
                          className="media-input"
                          value={editDraft.url ?? ''}
                          onChange={e => setEditDraft(d => ({ ...d, url: e.target.value }))}
                          placeholder="URL mp3"
                        />
                      </td>
                      <td className="media-actions">
                        <button className="btn-save" onClick={saveEdit}>Сохранить</button>
                        <button className="btn-cancel" onClick={() => setEditingId(null)}>✕</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="music-name">{item.musicName}</td>
                      <td className="url-cell" title={item.url}>{item.url.length > 40 ? '…' + item.url.slice(-30) : item.url}</td>
                      <td className="media-actions">
                        <button className="btn-edit" onClick={() => startEdit(item)}>Изменить</button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── PLAYLIST TAB ─────────────────────────── */}
      {tab === 'playlist' && (
        <div className="media-manager__section">
          <div className="media-add-form">
            <h3>Добавить трек</h3>
            <div className="form-row">
              <input
                className="media-input"
                placeholder="Название"
                value={trackForm.title}
                onChange={e => setTrackForm(f => ({ ...f, title: e.target.value }))}
              />
              <input
                className="media-input"
                placeholder="Исполнитель"
                value={trackForm.author}
                onChange={e => setTrackForm(f => ({ ...f, author: e.target.value }))}
              />
            </div>
            <div className="form-row">
              <input
                className="media-input flex-1"
                placeholder="URL mp3"
                value={trackForm.url}
                onChange={e => setTrackForm(f => ({ ...f, url: e.target.value }))}
              />
              <button className="btn-add" onClick={submitTrack}>Добавить</button>
            </div>
          </div>

          <table className="media-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Название</th>
                <th>Исполнитель</th>
                <th>URL</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {musicTracks.map((track, i) => (
                <tr key={track.id}>
                  <td>{i + 1}</td>
                  <td>{track.title}</td>
                  <td>{track.author}</td>
                  <td className="url-cell" title={track.url}>{track.url.length > 35 ? '…' + track.url.slice(-25) : track.url}</td>
                  <td className="media-actions">
                    <button className="btn-remove" onClick={() => onRemoveTrack(track.id)}>Удалить</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── VIDEO TAB ────────────────────────────── */}
      {tab === 'video' && (
        <div className="media-manager__section">
          <div className="media-add-form">
            <h3>Добавить видео</h3>
            <div className="form-row">
              <input
                className="media-input flex-1"
                placeholder="YouTube URL"
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
              />
              <button className="btn-add" onClick={submitVideo}>Добавить</button>
            </div>
          </div>

          <ul className="video-url-list">
            {videoUrls.map((url, i) => (
              <li key={i} className="video-url-item">
                <a href={url} target="_blank" rel="noreferrer" className="video-url-link">{url}</a>
                <button className="btn-remove" onClick={() => onRemoveVideo(url)}>Удалить</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
