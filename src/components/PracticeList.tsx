"use client";

import Link from "next/link";
import { useState } from "react";
import {
  formatExecutors,
  formatPracticeDate,
  type Practice,
  yearColor,
} from "@/data/practices";

export default function PracticeList({ items }: { items: Practice[] }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const hoveredPractice = items.find((p) => p.sessionId === hovered);

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      {hoveredPractice && (
        <div
          className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center pt-14"
          aria-hidden
        >
          <span
            className="max-w-[90vw] text-center font-bold leading-none opacity-[0.16]"
            style={{
              color: yearColor(hoveredPractice.year),
              fontSize: "clamp(2.5rem, 10vw, 7rem)",
            }}
          >
            {hoveredPractice.sessionTitle}
          </span>
        </div>
      )}

      <ul className="relative z-[1] divide-y divide-neutral-200/80">
        {items.map((p) => (
          <li key={p.sessionId}>
            <Link
              href={`/practices/${encodeURIComponent(p.sessionId)}`}
              className="group block px-5 py-5 transition hover:bg-white/60 sm:px-8"
              style={{ borderLeft: `4px solid ${yearColor(p.year)}` }}
              onMouseEnter={() => setHovered(p.sessionId)}
              onMouseLeave={() => setHovered(null)}
            >
              <p className="text-sm tabular-nums text-neutral-400">
                {formatPracticeDate(p.sessionDate)}
              </p>
              <p className="mt-1 text-lg font-medium text-neutral-900 group-hover:text-neutral-700">
                {p.sessionTitle}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {formatExecutors(p.executors)} | {p.location} |{" "}
                {formatPracticeDate(p.sessionDate)}
              </p>
              <span
                className="mt-2 inline-block text-xs text-neutral-600"
                style={{ color: yearColor(p.year) }}
              >
                [ {p.practiceType} ]
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
