import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * The Insights image store resolves its directory at runtime, from
   * INSIGHT_STORAGE_DIR. Turbopack cannot statically scope those filesystem
   * calls, so it falls back to tracing the whole project into the server
   * bundle — which pulls all of `public/` in with it, the 11.8 MB
   * manufacturing film included, for routes that never read a single file
   * from there.
   *
   * `public/` is served as static assets by the host, never read by server
   * code, so excluding it from the trace is safe and removes the bulk of the
   * deployed function. The exclusions are scoped to the three routes that
   * actually touch the store.
   *
   * If a future route genuinely needs to read from `public/` on the server,
   * remove its glob here rather than working around this.
   */
  outputFileTracingExcludes: {
    "/": ["./public/**"],
    "/insights": ["./public/**"],
    "/insights/[slug]": ["./public/**"],
    "/api/insight-image/[slot]/[version]": ["./public/**"],
    "/api/admin/insight-image": ["./public/**"],
    "/admin": ["./public/**"],
  },

  images: {
    /**
     * The Insights images can be replaced at runtime. Under the filesystem
     * driver they are served from /api/insight-image/<slot>/<version>, which
     * is a local path the optimiser will not touch unless it is declared here.
     *
     * `search: ""` is deliberate: the version lives in the path precisely so
     * that no query string is needed, because `localPatterns` can only match a
     * `search` value verbatim and ours would change on every upload.
     */
    localPatterns: [
      { pathname: "/images/**", search: "" },
      { pathname: "/products/**", search: "" },
      { pathname: "/partners/**", search: "" },
      { pathname: "/certifications/**", search: "" },
      { pathname: "/brand/**", search: "" },
      { pathname: "/video/**", search: "" },
      { pathname: "/api/insight-image/**", search: "" },
    ],
    /** Vercel Blob, when that driver is in use. */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        // The film is immutable for the life of a deployment: it is replaced
        // by a rebuild, not in place. Long-cache it so a returning visitor
        // never pays for 11.8 MB twice.
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // The dashboard is an operator tool. Keep it out of indexes and out of
        // other origins' frames, whatever a crawler decides to do with
        // robots.txt.
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
