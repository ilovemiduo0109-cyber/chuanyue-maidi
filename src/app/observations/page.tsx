import PageShell from "@/components/PageShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "美育观察 · 穿越麦地",
};

export default function ObservationsPage() {
  return (
    <PageShell>
      <div className="mx-auto max-w-2xl px-5 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">美育观察</h1>
        <p className="mt-6 text-neutral-500">内容建设中。</p>
      </div>
    </PageShell>
  );
}
