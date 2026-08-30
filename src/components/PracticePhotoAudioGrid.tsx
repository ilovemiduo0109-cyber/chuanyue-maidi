"use client";

import PracticePhotoLightbox, {
  photoSrc,
  photoTitle,
} from "@/components/PracticePhotoLightbox";
import { archiveUrl } from "@/data/practices";
import { useRef, useState } from "react";

type PhotoItem = {
  assetId: string;
  title: string;
  relativePath: string;
  pairedAudioPath?: string;
};

export default function PracticePhotoAudioGrid({
  photos,
  folderRoot,
  folderName,
}: {
  photos: PhotoItem[];
  folderRoot: string;
  folderName: string;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const current =
    lightboxIndex !== null ? photos[lightboxIndex] : null;

  async function playPhoto(photo: PhotoItem) {
    if (!photo.pairedAudioPath) return;

    const audio = audioRef.current;
    if (!audio) return;

    if (playingId === photo.assetId && !audio.paused) {
      audio.pause();
      setPlayingId(null);
      return;
    }

    audio.src = archiveUrl(folderRoot, folderName, photo.pairedAudioPath);
    setPlayingId(photo.assetId);
    try {
      await audio.play();
    } catch {
      setPlayingId(null);
    }
  }

  return (
    <>
      <audio ref={audioRef} preload="none" onEnded={() => setPlayingId(null)} />

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
        {photos.map((photo, index) => {
          const name = photoTitle(photo.title);
          const hasAudio = Boolean(photo.pairedAudioPath);
          const isPlaying = playingId === photo.assetId;

          return (
            <div
              key={photo.assetId}
              className={`flex flex-col overflow-hidden bg-neutral-50 ${
                isPlaying ? "ring-2 ring-[#5B8FD9] ring-offset-2" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setLightboxIndex(index)}
                aria-label={`放大查看 ${name}`}
                className="flex h-24 cursor-zoom-in items-center justify-center p-1.5 transition hover:bg-neutral-100 sm:h-28 sm:p-2"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoSrc(folderRoot, folderName, photo.relativePath)}
                  alt={name}
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                />
              </button>

              <div className="flex items-center justify-between gap-1 px-2 pb-2">
                <p className="truncate text-xs text-neutral-600">{name}</p>
                {hasAudio && (
                  <button
                    type="button"
                    onClick={() => playPhoto(photo)}
                    aria-label={isPlaying ? `暂停 ${name} 的录音` : `播放 ${name} 的录音`}
                    className="shrink-0 text-xs text-neutral-500 transition hover:text-neutral-800"
                  >
                    {isPlaying ? "暂停" : "播放"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {current && lightboxIndex !== null && (
        <PracticePhotoLightbox
          imageSrc={photoSrc(folderRoot, folderName, current.relativePath)}
          title={photoTitle(current.title)}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((index) => (index ?? 0) - 1)}
          onNext={() => setLightboxIndex((index) => (index ?? 0) + 1)}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < photos.length - 1}
          hasAudio={Boolean(current.pairedAudioPath)}
          isPlaying={playingId === current.assetId}
          onToggleAudio={() => playPhoto(current)}
        />
      )}
    </>
  );
}
