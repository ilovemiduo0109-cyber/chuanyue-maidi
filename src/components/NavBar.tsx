"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function NavBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-6 px-5">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-wide text-neutral-800"
        >
          穿越麦地×美育计划
        </Link>

        <nav className="flex items-center gap-6 text-sm text-neutral-600">
          <Link href="/about" className="transition hover:text-neutral-900">
            About us
          </Link>
          <Link href="/contact" className="transition hover:text-neutral-900">
            Contact
          </Link>
        </nav>

        <form onSubmit={handleSearch} className="flex shrink-0 items-center">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            aria-label="Search"
            className="h-8 w-36 rounded-full border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-neutral-400 focus:w-44 sm:w-44 sm:focus:w-52"
          />
        </form>
      </div>
    </header>
  );
}
