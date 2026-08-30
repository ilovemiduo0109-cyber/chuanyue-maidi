import PageShell from "@/components/PageShell";
import PracticePhotoAudioGrid from "@/components/PracticePhotoAudioGrid";
import PracticePhotoGrid from "@/components/PracticePhotoGrid";
import PracticeStoryViewer from "@/components/PracticeStoryViewer";
import {
  archiveUrl,
  formatExecutors,
  formatPracticeDate,
  getPracticeById,
  yearColor,
} from "@/data/practices";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { practices } = await import("@/data/practices");
  return practices.map((p) => ({ id: p.sessionId }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const practice = getPracticeById(id);
  if (!practice) return { title: "实践 · 穿越麦地" };
  return { title: `${practice.sessionTitle} · 穿越麦地` };
}

export default async function PracticeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const practice = getPracticeById(id);
  if (!practice) notFound();

  const photos = practice.mediaAssets.filter((a) => a.assetType === "photo");
  const videos = practice.mediaAssets.filter((a) => a.assetType === "video");
  const hasPhotoAudio = photos.some((photo) => photo.pairedAudioPath);
  const storyGroups = practice.storyGroups;
  const color = yearColor(practice.year);

  return (
    <PageShell className="bg-[#FAFAF8]">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <Link
          href="/practices"
          className="text-sm text-neutral-500 transition hover:text-neutral-800"
        >
          ← 全部实践
        </Link>

        <header className="mt-8 border-b border-neutral-200 pb-8">
          <h1 className="text-2xl font-semibold sm:text-3xl">
            《{practice.sessionTitle}》
          </h1>
          <p className="mt-4 text-sm text-neutral-600 sm:text-base">
            {formatExecutors(practice.executors)} | {practice.location} |{" "}
            {formatPracticeDate(practice.sessionDate)}
          </p>
          <span
            className="mt-4 inline-block text-sm font-medium"
            style={{ color }}
          >
            [ {practice.practiceType} ]
          </span>
        </header>

        {storyGroups && storyGroups.length > 0 ? (
          <section className="mt-10">
            <PracticeStoryViewer
              stories={storyGroups}
              folderRoot={practice.folderRoot}
              folderName={practice.folderName}
            />
          </section>
        ) : (
          photos.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-sm font-medium text-neutral-500">
                照片 · {photos.length}
                {hasPhotoAudio && (
                  <span className="ml-2 text-neutral-400">
                    点击照片放大 · 点击播放听录音
                  </span>
                )}
              </h2>
              {hasPhotoAudio ? (
                <PracticePhotoAudioGrid
                  photos={photos}
                  folderRoot={practice.folderRoot}
                  folderName={practice.folderName}
                />
              ) : (
                <PracticePhotoGrid
                  photos={photos}
                  folderRoot={practice.folderRoot}
                  folderName={practice.folderName}
                />
              )}
            </section>
          )
        )}

        {videos.length > 0 && (
          <section className="mt-10">
            <h2 className="mb-4 text-sm font-medium text-neutral-500">
              视频 · {videos.length}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {videos.map((asset) => (
                <div key={asset.assetId} className="bg-neutral-100">
                  <video
                    src={archiveUrl(
                      practice.folderRoot,
                      practice.folderName,
                      asset.relativePath,
                    )}
                    controls
                    className="w-full"
                    preload="metadata"
                  />
                  <p className="truncate px-2 py-1 text-xs text-neutral-500">
                    {asset.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {!storyGroups?.length && photos.length === 0 && videos.length === 0 && (
          <p className="mt-10 text-neutral-500">暂无已索引的照片或视频。</p>
        )}
      </div>
    </PageShell>
  );
}
