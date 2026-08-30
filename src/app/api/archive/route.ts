import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const ARCHIVE_ROOT = path.resolve(process.cwd(), "..");

const ALLOWED_ROOTS = new Set([
  "穿越麦地2023 云南高黎贡山",
  "穿越麦地2025 云南高黎贡山",
  "穿越麦地2025 山东招远",
]);

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
};

export async function GET(request: NextRequest) {
  const root = request.nextUrl.searchParams.get("root");
  const session = request.nextUrl.searchParams.get("session");
  const file = request.nextUrl.searchParams.get("file");

  if (!root || !session || !file || !ALLOWED_ROOTS.has(root)) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (file.includes("..")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const base = path.join(ARCHIVE_ROOT, root, session);
  const full = path.normalize(path.join(base, file));

  if (!full.startsWith(path.normalize(base + path.sep)) && full !== base) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(full) || !fs.statSync(full).isFile()) {
    return new NextResponse("Not found", { status: 404 });
  }

  const ext = path.extname(full).toLowerCase();
  const mime = MIME[ext] ?? "application/octet-stream";
  const buffer = fs.readFileSync(full);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": mime,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
