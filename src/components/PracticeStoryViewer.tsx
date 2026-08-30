"use client";

import { archiveUrl, type StoryGroup } from "@/data/practices";
import { useRef, useState } from "react";

function StoryStrip({
  story,
  folderRoot,
  folderName,
}: {
  story: StoryGroup;
  folderRoot: string;
  folderName: string;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [pageIndex, setPageIndex] = useState(0);

  function scrollToPage(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const clamped = Math.max(0, Math.min(index, story.pages.length - 1));
    const panel = scroller.children[clamped] as HTMLElement | undefined;
    panel?.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
    setPageIndex(clamped);
  }

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller || scroller.children.length === 0) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let closest = 0;
    let minDistance = Number.POSITIVE_INFINITY;

    Array.from(scroller.children).forEach((child, index) => {
      const panel = child as HTMLElement;
      const panelCenter = panel.offsetLeft + panel.clientWidth / 2;
      const distance = Math.abs(center - panelCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closest = index;
      }
    });

    setPageIndex(closest);
  }

  return (
    <article className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div>
          <h3 className="text-sm font-medium text-neutral-800">{story.title}</h3>
          <p className="mt-1 text-xs text-neutral-400">左右滑动阅读</p>
        </div>
        <p className="text-xs tabular-nums text-neutral-500">
          {pageIndex + 1} / {story.pages.length}
        </p>
      </div>

      <div className="relative bg-neutral-50">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {story.pages.map((page) => (
            <div
              key={page.assetId}
              className="flex min-w-full shrink-0 snap-center snap-always items-center justify-center px-2 py-3"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={archiveUrl(folderRoot, folderName, page.relativePath)}
                alt={`${story.title} ${page.title}`}
                className="max-h-[min(70vh,640px)] w-full object-contain"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {story.pages.length > 1 && (
          <>
            <button
              type="button"
              aria-label={`${story.title} 上一页`}
              onClick={() => scrollToPage(pageIndex - 1)}
              disabled={pageIndex === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1.5 text-sm text-neutral-500 shadow-sm transition hover:text-neutral-800 disabled:opacity-0"
            >
              ←
            </button>
            <button
              type="button"
              aria-label={`${story.title} 下一页`}
              onClick={() => scrollToPage(pageIndex + 1)}
              disabled={pageIndex === story.pages.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-2 py-1.5 text-sm text-neutral-500 shadow-sm transition hover:text-neutral-800 disabled:opacity-0"
            >
              →
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function PracticeStoryViewer({
  stories,
  folderRoot,
  folderName,
}: {
  stories: StoryGroup[];
  folderRoot: string;
  folderName: string;
}) {
  return (
    <section className="space-y-10">
      {stories.map((story) => (
        <StoryStrip
          key={story.folder}
          story={story}
          folderRoot={folderRoot}
          folderName={folderName}
        />
      ))}
    </section>
  );
}
