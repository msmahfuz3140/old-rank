/**
 * Image Optimization & Cloudinary CDN Delivery Utilities
 *
 * Provides:
 * - Dynamic Cloudinary URL transformations (f_auto, q_auto, c_limit, responsive widths)
 * - Browser caching headers compatibility (public, max-age=31536000, immutable)
 * - Bandwidth protection by avoiding delivering full-resolution unoptimized assets
 * - Instant local preview support (blob: and data: URIs)
 * - Fast client-side image compression prior to uploading
 * - Graceful fallback handling for local and third-party images
 */

interface OptimizeImageOptions {
  width?: number;
  height?: number;
  quality?: "auto" | "auto:good" | "auto:best" | "auto:eco" | number;
  format?: "auto" | "webp" | "avif" | "jpg";
  crop?: "limit" | "fill" | "thumb" | "scale";
}

/**
 * Optimizes a Cloudinary or third-party image URL for web delivery:
 * - Inserts 'f_auto' to serve modern formats (WebP/AVIF) dynamically
 * - Inserts 'q_auto:good' for high perceptual quality with tiny file size
 * - Applies responsive width limit (e.g. w_800 or w_150 for thumbs) to protect Cloudinary bandwidth
 * - Guarantees safe bypass for client-side blob: / data: preview URLs
 */
export function optimizeImageUrl(
  url?: string | null,
  options: OptimizeImageOptions = {}
): string {
  if (!url || typeof url !== "string") {
    return "";
  }

  const trimmed = url.trim();
  if (!trimmed) return "";

  // 0. Local instant preview URLs (blob: / data:) - preserve unchanged
  if (trimmed.startsWith("blob:") || trimmed.startsWith("data:")) {
    return trimmed;
  }

  // 1. Cloudinary URLs
  if (trimmed.includes("res.cloudinary.com")) {
    const width = options.width || 800;
    const quality = options.quality || "auto:good";
    const crop = options.crop || "limit";
    const format = options.format || "auto";

    const transformSegment = `f_${format},q_${quality},w_${width},c_${crop}`;
    const uploadMarker = "/image/upload/";
    const uploadIndex = trimmed.indexOf(uploadMarker);

    if (uploadIndex !== -1) {
      const prefix = trimmed.substring(0, uploadIndex + uploadMarker.length);
      const afterUpload = trimmed.substring(uploadIndex + uploadMarker.length);

      const segments = afterUpload.split("/");
      // Cloudinary version segment starts with 'v' followed by digits (e.g. v17454231)
      const versionIndex = segments.findIndex((seg) => /^v\d+$/.test(seg));

      if (versionIndex !== -1) {
        // Strip out any previous transformations and insert our exact dimensions
        const pathFromVersion = segments.slice(versionIndex).join("/");
        return `${prefix}${transformSegment}/${pathFromVersion}`;
      } else {
        // If there's no version tag, check if first segment is a transformation
        const firstSeg = segments[0] || "";
        const isTransformation = /^(f_|q_|w_|c_|h_|g_|r_|e_|b_|dpr_)/.test(firstSeg);
        const pathPart = isTransformation ? segments.slice(1).join("/") : afterUpload;
        return `${prefix}${transformSegment}/${pathPart}`;
      }
    }

    return trimmed;
  }

  // 2. Unsplash URLs
  if (trimmed.includes("images.unsplash.com")) {
    try {
      const parsed = new URL(trimmed);
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("q", "75");
      if (options.width) {
        parsed.searchParams.set("w", String(options.width));
      }
      return parsed.toString();
    } catch {
      return trimmed;
    }
  }

  // 3. Local or other images returned directly
  return trimmed;
}

/**
 * Compresses an image on the client before upload:
 * - Downscales large smartphone/camera photos (e.g., 4000x3000) to max 1600x1600
 * - Compresses down to lightweight WebP/JPEG (reducing multi-MB files to ~150-300KB)
 * - Drastically saves upload latency, mobile user data, and Cloudinary storage/bandwidth
 * - Operates safely in-browser using HTMLCanvasElement
 */
export async function compressImageClient(
  file: File,
  maxDimension: number = 1600,
  quality: number = 0.82
): Promise<File> {
  // If not in browser or not an image (e.g. PDF/SVG), return untouched
  if (typeof window === "undefined" || !file || !file.type.startsWith("image/") || file.type === "image/svg+xml") {
    return file;
  }

  // If already lightweight (< 350 KB), no need to compress further
  if (file.size <= 350 * 1024) {
    return file;
  }

  try {
    return await new Promise<File>((resolve) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        let { width, height } = img;

        if (width <= 0 || height <= 0) {
          resolve(file);
          return;
        }

        // Maintain aspect ratio while bounding within maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to webp if supported, otherwise jpeg
        const outputMime = file.type === "image/png" ? "image/webp" : "image/jpeg";

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              resolve(file);
              return;
            }

            const extension = outputMime === "image/webp" ? ".webp" : ".jpg";
            const newName = file.name.replace(/\.[^/.]+$/, "") + extension;
            const compressedFile = new File([blob], newName, {
              type: outputMime,
              lastModified: Date.now(),
            });

            console.log(
              `⚡ Client compressed (${file.name}): ${(file.size / 1024).toFixed(0)} KB -> ${(blob.size / 1024).toFixed(0)} KB (${Math.round((1 - blob.size / file.size) * 100)}% saved)`
            );

            resolve(compressedFile);
          },
          outputMime,
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve(file);
      };

      img.src = objectUrl;
    });
  } catch (err) {
    console.warn("Client image compression fallback to original:", err);
    return file;
  }
}

/**
 * Returns tiny base64 SVG shimmer blur placeholder for Next.js Image
 */
export const shimmerPlaceholder = (w: number = 700, h: number = 700): string => {
  const shimmer = `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f1f5f9" offset="20%" />
      <stop stop-color="#e2e8f0" offset="50%" />
      <stop stop-color="#f1f5f9" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f8fafc" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1.2s" repeatCount="indefinite"  />
</svg>`;

  if (typeof window === "undefined") {
    return `data:image/svg+xml;base64,${Buffer.from(shimmer).toString("base64")}`;
  }
  return `data:image/svg+xml;base64,${window.btoa(shimmer)}`;
};

/**
 * Converts a File or Blob into a base64 Data URL
 */
export function fileToDataUrl(file: Blob | File): Promise<string> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !file) {
      resolve("");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve((reader.result as string) || "");
    };
    reader.onerror = () => resolve("");
    reader.readAsDataURL(file);
  });
}

