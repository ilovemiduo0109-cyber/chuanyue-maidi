/**
 * 扫描首页轮播素材：合影照片 + 宣传物料视频
 * 运行: node scripts/generate-home-media.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVE_ROOT = path.join(__dirname, "..", "..");
const PHOTOS_DIR = path.join(ARCHIVE_ROOT, "合影");
const PROMO_DIR = path.join(ARCHIVE_ROOT, "穿越麦地 宣传物料");
const OUT = path.join(__dirname, "..", "src", "data", "home-media.generated.json");

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

const PROMO_VIDEOS = [
  { match: "群山回唱", title: "群山回唱" },
  { match: "乐园的边界", title: "乐园的边界-预告片" },
];

function shouldSkipFile(name) {
  return name.startsWith("._");
}

const items = [];

if (fs.existsSync(PHOTOS_DIR)) {
  const photos = fs
    .readdirSync(PHOTOS_DIR)
    .filter((name) => {
      if (shouldSkipFile(name)) return false;
      return IMAGE_EXT.has(path.extname(name));
    })
    .sort((a, b) => a.localeCompare(b, "zh-CN"));

  for (const file of photos) {
    items.push({ type: "photo", source: "合影", file });
  }
}

if (fs.existsSync(PROMO_DIR)) {
  const promoFiles = fs.readdirSync(PROMO_DIR).filter((name) => !shouldSkipFile(name));

  for (const { match, title } of PROMO_VIDEOS) {
    const file = promoFiles.find((name) => name.includes(match));
    if (file) {
      items.push({ type: "video", source: "宣传物料", file, title });
    }
  }
}

fs.writeFileSync(OUT, JSON.stringify(items, null, 2), "utf8");
console.log(`Wrote ${items.length} home media items to ${OUT}`);
