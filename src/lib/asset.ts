// Prefix for static assets served from /public.
// In production the app is deployed under a repo subpath on GitHub Pages,
// so absolute asset paths (e.g. "/icons/logo.png") must include the basePath.
// next/image with `unoptimized: true` does NOT add basePath automatically,
// so we prepend it manually here.
export const BASE_PATH =
  process.env.NODE_ENV === "production" ? "/sangomanewgen" : "";

export function asset(path: string): string {
  if (!path || !path.startsWith("/")) return path;
  return `${BASE_PATH}${path}`;
}
