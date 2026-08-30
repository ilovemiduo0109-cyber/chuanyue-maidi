"use client";

import PracticePhotoLightbox, {
  photoSrc,
  photoTitle,
} from "@/components/PracticePhotoLightbox";
import { useState } from "react";

type PhotoItem = {
  assetId: string;
  title: string;
  relativePath: string;
};

export default function PracticePhotoGrid({
  photos,
  folderRoot,
  folderName,
}: {
  photos: PhotoItem[];
  folderRoot: string;
  folderName: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const current =
    lightboxIndex !== null ? photos[lightboxIndex] : null;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <button
            key={photo.assetId}
            type="button"
            onClick={() => setLightboxIndex(index)}
            aria-label={`放大查看 ${photoTitle(photo.title)}`}
            className="flex h-24 cursor-zoom-in items-center justify-center bg-neutral-50 p-1.5 transition hover:bg-neutral-100 sm:h-28 sm:p-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoSrc(folderRoot, folderName, photo.relativePath)}
              alt={photoTitle(photo.title)}
              className="max-h-full max-w-full object-contain"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      {current && lightboxIndex !== null && (
        <PracticePhotoLightbox
          imageSrc={photoSrc(folderRoot, folderName, current.relativePath)}
          title={photoTitle(current.title)}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((index) => (index ?? 0) - 1)}
          onNext={() => setLightboxIndex((index) => (index ?? 0) + 1)}
          hasPrev={lightboxIndex > 0}
          hasNext={lightboxIndex < photos.length - 1}
        />
      )}
    </>
  );
}
