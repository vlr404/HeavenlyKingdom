import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { CeremonyItem, MusicTrack } from '../types/media';
import {
  DEFAULT_CEREMONY_ITEMS,
  DEFAULT_MUSIC_TRACKS,
  DEFAULT_VIDEO_URLS,
} from '../data/mediaData';

interface MediaContextValue {
  ceremonyItems: CeremonyItem[];
  setCeremonyItems: React.Dispatch<React.SetStateAction<CeremonyItem[]>>;
  musicTracks: MusicTrack[];
  setMusicTracks: React.Dispatch<React.SetStateAction<MusicTrack[]>>;
  videoUrls: string[];
  setVideoUrls: React.Dispatch<React.SetStateAction<string[]>>;
}

const MediaContext = createContext<MediaContextValue | null>(null);

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [ceremonyItems, setCeremonyItems] = useState<CeremonyItem[]>(DEFAULT_CEREMONY_ITEMS);
  const [musicTracks, setMusicTracks]     = useState<MusicTrack[]>(DEFAULT_MUSIC_TRACKS);
  const [videoUrls, setVideoUrls]         = useState<string[]>(DEFAULT_VIDEO_URLS);

  return (
    <MediaContext.Provider value={{ ceremonyItems, setCeremonyItems, musicTracks, setMusicTracks, videoUrls, setVideoUrls }}>
      {children}
    </MediaContext.Provider>
  );
};

export const useMedia = (): MediaContextValue => {
  const ctx = useContext(MediaContext);
  if (!ctx) throw new Error('useMedia must be used inside <MediaProvider>');
  return ctx;
};
