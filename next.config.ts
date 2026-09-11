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
    "/api/admin/insight-text": ["./public/**"],
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

  /**
   * A cache-busting prefix for the film and its poster.
   *
   * Fixing the header above stops the problem recurring, but it cannot undo
   * it: a browser holding an `immutable` copy will not revalidate, so it would
   * go on playing the wrong cut until 2027. Only a different URL dislodges
   * that, and the version has to live in the PATH rather than a query string
   * because `images.localPatterns` matches `search` verbatim — the same
   * reasoning the Insights image route already follows.
   *
   * The files keep their real names on disk. `public/video/manufacturing.mp4`
   * stays exactly where Zafieon drops it; this only changes the URL the page
   * asks for. Swapping the file needs no change here — `must-revalidate` picks
   * it up — so `r2` is expected to stay `r2`.
   */
  async rewrites() {
    return [{ source: "/video/r2/:file", destination: "/video/:file" }];
  },

  async headers() {
    return [
      {
        /**
         * Revalidated, NOT `immutable`. This header used to say
         * `max-age=31536000, immutable` on the reasoning that the film "is
         * replaced by a rebuild, not in place" — which was simply wrong. The
         * URL is stable across rebuilds, so replacing the file does not
         * change it, and `immutable` tells the browser never to revalidate.
         *
         * That cost a day. The film was swapped three times at this one path;
         * every browser that had loaded the page kept playing whichever cut
         * it happened to cache, for a year, and a normal refresh did not
         * dislodge it — measured, not assumed: on reload Chrome served the
         * body with `fromCache=true` and issued no request at all. The client
         * was looking at a film with no product reveal in it while the file
         * on disk had one.
         *
         * `max-age=0, must-revalidate` means a conditional request on every
         * load: a 304 with no body when the film is unchanged, which is what
         * the long cache was protecting against anyway, and the real bytes the
         * moment it changes. Correctness over one round trip.
         *
         * Do not restore `immutable` here unless the URL carries a content
         * hash, which is the only thing that makes that promise true.
         */
        source: "/video/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
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
