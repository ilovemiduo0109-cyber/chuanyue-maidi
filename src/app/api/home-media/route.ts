import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const ARCHIVE_ROOT = path.resolve(process.cwd(), "..");

const SOURCE_DIRS: Record<string, string> = {
  合影: path.join(ARCHIVE_ROOT, "合影"),
  宣传物料: path.join(ARCHIVE_ROOT, "穿越麦地 宣传物料"),
};

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".mp4": "video/mp4",
  ".mov": "video/quicktime",
  ".webm": "video/webm",
};

export async function GET(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("source");
  const file = request.nextUrl.searchParams.get("file");

  if (!source || !file || !SOURCE_DIRS[source]) {
    return new NextResponse("Not found", { status: 404 });
  }

  if (file.includes("..") || file.includes("/") || file.includes("\\")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const base = SOURCE_DIRS[source];
  const full = path.normalize(path.join(base, file));

  if (!full.startsWith(path.normalize(base + path.sep))) {
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
