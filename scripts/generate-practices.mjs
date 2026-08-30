/**
 * 扫描 D:\穿越麦地 实践文件夹，生成 practices 数据
 * 运行: node scripts/generate-practices.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(__dirname, "..", "src", "data", "practices.generated.json");

const YEAR_FOLDERS = [
  { year: 2023, dir: "穿越麦地2023 云南高黎贡山", location: "云南保山" },
  { year: 2025, dir: "穿越麦地2025 云南高黎贡山", location: "云南保山" },
  {
    year: 2025,
    dir: "穿越麦地2025 山东招远",
    location: "山东招远",
    include: (name) => name.includes("鱼旗") || name.includes("一人一首歌"),
  },
];

const IMAGE_EXT = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".JPG",
  ".JPEG",
  ".PNG",
]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm", ".MP4"]);
const AUDIO_EXT = new Set([".wav", ".mp3", ".m4a", ".WAV", ".MP3", ".M4A"]);

function shouldSkipFile(name) {
  if (name.startsWith("._")) return true;
  if (/^\d+_.*\.(jpg|jpeg|png|gif|webp)$/i.test(name)) return true;
  return false;
}

function isAuthorNamedPhoto(name) {
  return /^[\u4e00-\u9fa5A-Za-z]+\.(jpg|jpeg|png|gif|webp)$/i.test(name);
}

const MANUAL_OVERRIDES = {
  "咔嚓，我的自画像 多名成员 摄影": {
    sessionId: "S2023-咔嚓-我的自画像",
    sessionTitle: "咔嚓，我的自画像",
    executors: ["多名成员"],
    practiceType: "摄影",
    location: "云南保山",
  },
  "《三个小故事》高宇 2023云南保山 摄影": {
    sessionId: "S2023-三个小故事",
    sessionTitle: "三个小故事",
    executors: ["高宇"],
    practiceType: "摄影",
    location: "云南保山",
    storyGroups: true,
    storyOrder: ["小蓝", "伙伴旅行", "快乐游戏记"],
  },
  "《鱼旗》开心 2025山东招远 绘画 手工": {
    sessionId: "S2025-鱼旗",
    sessionTitle: "鱼旗",
    executors: ["开心"],
    practiceType: "绘画",
    location: "山东招远",
  },
  "《一人一首歌》西西弗 2025山东招远 文学 音乐": {
    sessionId: "S2025-一人一首歌",
    sessionTitle: "一人一首歌",
    executors: ["西西弗"],
    practiceType: "文学",
    location: "山东招远",
  },
  "薛薛 天歌《我的梦想豪宅》2025 云南保山 手工": {
    sessionId: "S2025-我的梦想豪宅",
    sessionTitle: "我的梦想豪宅",
    executors: ["天歌", "薛薛"],
    practiceType: "手工",
    location: "云南保山",
  },
};

function parseFolderName(name, folderConfig) {
  const { year, dir, location: defaultLocation } = folderConfig;

  if (MANUAL_OVERRIDES[name]) {
    const o = MANUAL_OVERRIDES[name];
    return {
      sessionId: o.sessionId,
      sessionTitle: o.sessionTitle,
      sessionDate: `${year}-07-01`,
      year,
      location: o.location ?? defaultLocation,
      executors: o.executors,
      practiceType: o.practiceType ?? "综合",
      folderRoot: dir,
      folderName: name,
    };
  }

  const titleMatch = name.match(/《([^》]+)》/);
  let sessionTitle = titleMatch ? titleMatch[1] : name.split(/\d{4}/)[0].trim();
  sessionTitle = sessionTitle.replace(/^["“]|["”]$/g, "").trim();

  let executorsRaw = name;
  if (titleMatch) {
    executorsRaw = name.replace(/《[^》]+》/, " ");
  }
  executorsRaw = executorsRaw
    .replace(/\d{4}\s*云南[^\s]*/g, " ")
    .replace(/\d{4}\s*山东[^\s]*/g, " ")
    .replace(
      /(绘画|手工|音乐|多媒介中药主题|多媒介|摄影|计算机|身体互动|戏剧|文学|AI workshop)/gi,
      " ",
    )
    .replace(/中药主题/g, " ")
    .trim();

  const executors = executorsRaw
    .split(/[&、,，]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const typeMatch = name.match(
    /(绘画|手工|音乐|多媒介中药主题|多媒介|摄影|计算机|身体互动|戏剧|文学)(?:\s|$)/,
  );
  const practiceType = typeMatch ? typeMatch[1] : "综合";

  const sessionId =
    `S${year}-` +
    sessionTitle
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);

  return {
    sessionId,
    sessionTitle,
    sessionDate: `${year}-07-01`,
    year,
    location: defaultLocation,
    executors,
    practiceType,
    folderRoot: dir,
    folderName: name,
  };
}

function numericPageSort(a, b) {
  const numA = parseInt(path.basename(a, path.extname(a)), 10);
  const numB = parseInt(path.basename(b, path.extname(b)), 10);
  if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numA - numB;
  return a.localeCompare(b, "zh-CN");
}

function storyGroupRank(group, orderHints) {
  const index = orderHints.findIndex(
    (hint) => group.folder.includes(hint) || group.title.includes(hint),
  );
  return index === -1 ? orderHints.length : index;
}

function listStoryGroups(folderPath, orderHints = []) {
  if (!fs.existsSync(folderPath)) return [];

  const groups = [];

  for (const ent of fs.readdirSync(folderPath, { withFileTypes: true })) {
    if (!ent.isDirectory() || ent.name.startsWith(".")) continue;

    const storyDir = path.join(folderPath, ent.name);
    const pages = [];

    for (const file of fs.readdirSync(storyDir)) {
      if (shouldSkipFile(file)) continue;
      const ext = path.extname(file);
      if (!IMAGE_EXT.has(ext)) continue;

      const rel = path.join(ent.name, file).replace(/\\/g, "/");
      pages.push({
        assetId: rel,
        title: file,
        assetType: "photo",
        relativePath: rel,
      });
    }

    pages.sort((a, b) => numericPageSort(a.title, b.title));

    if (pages.length > 0) {
      groups.push({
        title: ent.name.replace(/^《|》$/g, ""),
        folder: ent.name,
        pages,
      });
    }
  }

  if (orderHints.length > 0) {
    groups.sort(
      (a, b) =>
        storyGroupRank(a, orderHints) - storyGroupRank(b, orderHints) ||
        a.folder.localeCompare(b.folder, "zh-CN"),
    );
  } else {
    groups.sort((a, b) => a.folder.localeCompare(b.folder, "zh-CN"));
  }
  return groups;
}

function listMedia(folderPath, options = {}) {
  const { authorPhotosOnly = false } = options;
  const photos = [];
  const videos = [];
  const audiosByBase = new Map();
  if (!fs.existsSync(folderPath)) return [];

  function walk(dir, relDir) {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      if (shouldSkipFile(ent.name)) continue;

      const abs = path.join(dir, ent.name);
      const rel = path.join(relDir, ent.name).replace(/\\/g, "/");
      if (ent.isDirectory()) {
        if (!ent.name.startsWith(".")) walk(abs, rel);
        continue;
      }

      const ext = path.extname(ent.name);
      const base = path.basename(ent.name, ext);

      if (IMAGE_EXT.has(ext)) {
        if (authorPhotosOnly && !isAuthorNamedPhoto(ent.name)) continue;
        photos.push({
          assetId: rel,
          title: ent.name,
          assetType: "photo",
          relativePath: rel,
        });
      } else if (AUDIO_EXT.has(ext)) {
        audiosByBase.set(base, rel);
      } else if (VIDEO_EXT.has(ext)) {
        videos.push({
          assetId: rel,
          title: ent.name,
          assetType: "video",
          relativePath: rel,
        });
      }
    }
  }

  walk(folderPath, "");

  const pairedPhotos = photos.map((photo) => {
    const base = path.basename(photo.relativePath, path.extname(photo.relativePath));
    const pairedAudioPath = audiosByBase.get(base);
    return pairedAudioPath ? { ...photo, pairedAudioPath } : photo;
  });

  return [...pairedPhotos, ...videos].slice(0, 120);
}

const practices = [];

for (const folderConfig of YEAR_FOLDERS) {
  const fullDir = path.join(ARCHIVE_ROOT, folderConfig.dir);
  if (!fs.existsSync(fullDir)) {
    console.warn("Missing:", fullDir);
    continue;
  }
  for (const ent of fs.readdirSync(fullDir, { withFileTypes: true })) {
    if (!ent.isDirectory()) continue;
    if (folderConfig.include && !folderConfig.include(ent.name)) continue;

    const parsed = parseFolderName(ent.name, folderConfig);
    const folderPath = path.join(fullDir, ent.name);
    const override = MANUAL_OVERRIDES[ent.name];
    const authorPhotosOnly = parsed.sessionId === "S2025-一人一首歌";
    const storyGroups = override?.storyGroups
      ? listStoryGroups(folderPath, override.storyOrder ?? [])
      : undefined;
    const mediaAssets = storyGroups
      ? storyGroups.flatMap((group) => group.pages)
      : listMedia(folderPath, { authorPhotosOnly });

    practices.push({
      ...parsed,
      ...(storyGroups ? { storyGroups } : {}),
      mediaAssets,
    });
  }
}

practices.sort((a, b) => b.sessionDate.localeCompare(a.sessionDate));

fs.writeFileSync(OUT, JSON.stringify(practices, null, 2), "utf8");
console.log(`Wrote ${practices.length} practices to ${OUT}`);
