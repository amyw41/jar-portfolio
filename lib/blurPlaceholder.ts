// Shared placeholder for next/image's `placeholder="blur"` on images whose
// src is a runtime string (plates, gallery photos) rather than a static
// import — Next only auto-generates a blurDataURL for statically imported
// images, so anything loaded via a plain string path (everything on the
// /etc pages) needs one supplied by hand or blur just silently does nothing.
// This is a tiny inline SVG (a soft light-gray rectangle, the standard
// Next.js "shimmer" pattern), not a scaled-down version of any real photo —
// it doesn't need to match each image's own colors, just fill the space
// with something softer than blank white while the real photo loads in.
const SHIMMER = `
<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <rect width="100" height="100" fill="#ececec" />
</svg>`;

function toBase64(str: string) {
  return typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);
}

export const SHIMMER_BLUR_DATA_URL = `data:image/svg+xml;base64,${toBase64(SHIMMER)}`;
