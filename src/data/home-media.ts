import generated from "./home-media.generated.json";

export type HomeMediaItem = {
  type: "photo" | "video";
  source: "合影" | "宣传物料";
  file: string;
  title?: string;
};

export const homeMedia = generated as HomeMediaItem[];

export function homeMediaUrl(item: HomeMediaItem): string {
  const params = new URLSearchParams({
    source: item.source,
    file: item.file,
  });
  return `/api/home-media?${params.toString()}`;
}

export function homeMediaLabel(item: HomeMediaItem): string {
  if (item.title) return item.title;
  return item.file.replace(/\.[^.]+$/, "");
}
