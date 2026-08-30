import generated from "./practices.generated.json";

export type MediaAsset = {
  assetId: string;
  title: string;
  assetType: "photo" | "video" | "audio";
  relativePath: string;
  pairedAudioPath?: string;
};

export type StoryGroup = {
  title: string;
  folder: string;
  pages: MediaAsset[];
};

export type Practice = {
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  year: number;
  location: string;
  executors: string[];
  practiceType: string;
  folderRoot: string;
  folderName: string;
  mediaAssets: MediaAsset[];
  storyGroups?: StoryGroup[];
};

export const practices = generated as Practice[];

export function getPracticeById(id: string): Practice | undefined {
  return practices.find((p) => p.sessionId === decodeURIComponent(id));
}

export function formatExecutors(executors: string[]): string {
  return executors
    .flatMap((e) => e.split(/\s+/))
    .filter(Boolean)
    .join("·");
}

export function formatPracticeDate(date: string): string {
  const year = date.split("-")[0];
  return `${year} 夏季`;
}

export const YEAR_COLORS: Record<number, string> = {
  2025: "#5B8FD9",
  2024: "#9B7BB8",
  2023: "#D9955B",
  2022: "#6BA872",
};

export function yearColor(year: number): string {
  return YEAR_COLORS[year] ?? "#A8A29E";
}

export function archiveUrl(
  root: string,
  session: string,
  file: string,
): string {
  const params = new URLSearchParams({
    root,
    session,
    file,
  });
  return `/api/archive?${params.toString()}`;
}

export function searchPractices(query: string): Practice[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return practices.filter((p) => {
    const haystack = [
      p.sessionTitle,
      p.location,
      p.practiceType,
      p.folderName,
      ...p.executors,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
