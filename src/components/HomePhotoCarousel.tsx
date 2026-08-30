"use client";

import {
  homeMediaLabel,
  homeMediaUrl,
  type HomeMediaItem,
} from "@/data/home-media";
import { useEffect, useRef, useState } from "react";

const PHOTO_INTERVAL_MS = 5000;

export default function HomePhotoCarousel({ items }: { items: HomeMediaItem[] }) {
  const [index, setIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const current = items[index];

  useEffect(() => {
    if (items.length <= 1) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    if (current?.type === "video") return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length);
    }, PHOTO_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, [items.length, index, current?.type]);

  useEffect(() => {
    videoRefs.current.forEach((video, videoIndex) => {
      if (!video) return;

      if (videoIndex === index && items[videoIndex]?.type === "video") {
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [index, items]);

  function goPrev() {
    setIndex((prev) => (prev - 1 + items.length) % items.length);
  }

  function goNext() {
    setIndex((prev) => (prev + 1) % items.length);
  }

  if (items.length === 0) {
    return (
      <div className="flex h-[45vh] min-h-[240px] max-h-[520px] items-center justify-center bg-neutral-100 text-sm text-neutral-400">
        合影照片即将更新
      </div>
    );
  }

  return (
    <section
      className="group relative flex h-[45vh] min-h-[240px] max-h-[520px] w-full items-center justify-center overflow-hidden bg-[#FAFAF8]"
      aria-label="首页轮播"
      aria-live="polite"
    >
      {items.map((item, itemIndex) => {
        const isActive = itemIndex === index;
        const sharedClass = `absolute left-1/2 top-1/2 max-h-full max-w-full -translate-x-1/2 -translate-y-1/2 object-contain transition-opacity duration-1000 ease-in-out ${
          isActive ? "opacity-100" : "opacity-0"
        }`;

        if (item.type === "video") {
          return (
            <video
              key={`${item.source}-${item.file}`}
              ref={(el) => {
                videoRefs.current[itemIndex] = el;
              }}
              src={homeMediaUrl(item)}
              controls={isActive}
              playsInline
              preload="metadata"
              onEnded={() => {
                if (itemIndex === index) goNext();
              }}
              className={`${sharedClass} ${isActive ? "z-[1]" : "pointer-events-none z-0"}`}
            />
          );
        }

        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${item.source}-${item.file}`}
            src={homeMediaUrl(item)}
            alt={homeMediaLabel(item)}
            className={sharedClass}
            loading={itemIndex === 0 ? "eager" : "lazy"}
            draggable={false}
          />
        );
      })}

      {current?.type === "video" && (
        <p className="absolute bottom-10 left-0 right-0 z-[2] text-center text-xs text-neutral-500">
          {homeMediaLabel(current)}
        </p>
      )}

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="上一项"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 p-1 text-neutral-400/0 transition-all hover:text-neutral-500/80 group-hover:text-neutral-400/50 sm:left-4"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="下一项"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 p-1 text-neutral-400/0 transition-all hover:text-neutral-500/80 group-hover:text-neutral-400/50 sm:right-4"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="h-5 w-5"
              aria-hidden
            >
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center gap-1.5">
            {items.map((item, dotIndex) => (
              <button
                key={`${item.source}-${item.file}`}
                type="button"
                aria-label={`第 ${dotIndex + 1} 项`}
                onClick={() => setIndex(dotIndex)}
                className={`rounded-full transition-colors ${
                  item.type === "video" ? "h-1.5 w-1.5" : "h-1 w-1"
                } ${
                  dotIndex === index
                    ? "bg-neutral-400"
                    : "bg-neutral-300/80 hover:bg-neutral-400/70"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
