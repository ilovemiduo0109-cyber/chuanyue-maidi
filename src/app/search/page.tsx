import PageShell from "@/components/PageShell";
import { searchPractices, formatPracticeDate } from "@/data/practices";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search · 穿越麦地",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const results = searchPractices(q);

  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Search</h1>
        {q ? (
          <p className="mt-4 text-sm text-neutral-500">
            搜索「{q}」· 找到 {results.length} 条结果
          </p>
        ) : (
          <p className="mt-4 text-sm text-neutral-500">请输入关键词</p>
        )}

        {q && results.length === 0 && (
          <p className="mt-8 text-neutral-600">暂无匹配的美育实践。</p>
        )}

        <ul className="mt-8 space-y-4">
          {results.map((p) => (
            <li
              key={p.sessionId}
              className="rounded-lg border border-neutral-200 bg-white px-4 py-3"
            >
              <p className="font-medium">《{p.sessionTitle}》</p>
              <p className="mt-1 text-sm text-neutral-500">
                {p.executors.join("·")} | {p.location} |{" "}
                {formatPracticeDate(p.sessionDate)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
