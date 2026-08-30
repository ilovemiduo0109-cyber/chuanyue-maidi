import PageShell from "@/components/PageShell";
import PracticeList from "@/components/PracticeList";
import { practices } from "@/data/practices";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "美育项目实践 · 穿越麦地",
};

export default function PracticesPage() {
  const sorted = [...practices].sort((a, b) =>
    b.sessionDate.localeCompare(a.sessionDate),
  );

  return (
    <PageShell className="bg-[#FAFAF8]">
      <div className="mx-auto max-w-3xl pt-8">
        <div className="px-5 sm:px-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            美育项目实践
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{sorted.length} 项</p>
        </div>
        <PracticeList items={sorted} />
      </div>
    </PageShell>
  );
}
