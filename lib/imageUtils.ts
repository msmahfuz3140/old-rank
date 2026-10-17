/**
 * Image Optimization & Cloudinary CDN Delivery Utilities
 *
 * Provides:
 * - Dynamic Cloudinary URL transformations (f_auto, q_auto, c_limit, responsive widths)
 * - Browser caching headers compatibility (public, max-age=31536000, immutable)
 * - Bandwidth protection by avoiding delivering full-resolution unoptimized assets
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
 * - Inserts 'q_auto' to apply AI perceptual compression without visual loss
 * - Applies responsive width limit (e.g. w_800) to protect Cloudinary bandwidth
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

  // 1. Cloudinary URLs
  if (trimmed.includes("res.cloudinary.com")) {
    const width = options.width || 800;
    const quality = options.quality || "auto";
    const crop = options.crop || "limit";
    const format = options.format || "auto";

    const transformSegment = `f_${format},q_${quality},w_${width},c_${crop}`;

    // If already has transformation parameters right after /upload/
    const uploadIndex = trimmed.indexOf("/image/upload/");
    if (uploadIndex !== -1) {
      const prefix = trimmed.substring(0, uploadIndex + "/image/upload/".length);
      const rest = trimmed.substring(uploadIndex + "/image/upload/".length);

      // Check if already transformed
      if (/^(f_[^/]+|q_[^/]+|w_[^/]+|c_[^/]+|v\d+)/.test(rest)) {
        // If it starts with v\d+, insert transformations before version
        if (/^v\d+\//.test(rest)) {
          return `${prefix}${transformSegment}/${rest}`;
        }
        // If it already has f_auto,q_auto, leave or replace with dimension limit
        if (rest.startsWith("f_auto,q_auto/")) {
          return `${prefix}f_auto,q_auto,w_${width},c_${crop}/${rest.replace("f_auto,q_auto/", "")}`;
        }
        return trimmed;
      }

      return `${prefix}${transformSegment}/${rest}`;
    }
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
