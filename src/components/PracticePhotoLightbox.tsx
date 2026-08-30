"use client";

import { archiveUrl } from "@/data/practices";
import { useEffect } from "react";

type PracticePhotoLightboxProps = {
  imageSrc: string;
  title: string;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  hasAudio?: boolean;
  isPlaying?: boolean;
  onToggleAudio?: () => void;
};

export default function PracticePhotoLightbox({
  imageSrc,
  title,
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  hasAudio,
  isPlaying,
  onToggleAudio,
}: PracticePhotoLightboxProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && hasPrev) onPrev?.();
      if (event.key === "ArrowRight" && hasNext) onNext?.();
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`查看 ${title}`}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-black/50 px-3 py-1.5 text-sm text-white transition hover:bg-black/70"
      >
        关闭
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onPrev?.();
          }}
          className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white transition hover:bg-black/70 sm:left-4"
          aria-label="上一张"
        >
          ←
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            onNext?.();
          }}
          className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-white transition hover:bg-black/70 sm:right-4"
          aria-label="下一张"
        >
          →
        </button>
      )}

      <div
        className="flex max-h-full max-w-full flex-col items-center"
        onClick={(event) => event.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt={title}
          className="max-h-[calc(100vh-8rem)] max-w-[min(96vw,1200px)] object-contain"
        />
        <div className="mt-4 flex items-center gap-4">
          <p className="text-sm text-white/90">{title}</p>
          {hasAudio && onToggleAudio && (
            <button
              type="button"
              onClick={onToggleAudio}
              className="rounded-full bg-white/15 px-3 py-1 text-sm text-white transition hover:bg-white/25"
            >
              {isPlaying ? "暂停音频" : "播放音频"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function photoTitle(filename: string): string {
  return filename.replace(/\.[^.]+$/, "");
}

export function photoSrc(
  folderRoot: string,
  folderName: string,
  relativePath: string,
): string {
  return archiveUrl(folderRoot, folderName, relativePath);
}
