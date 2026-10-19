import { googleReviews, whatsappHref, whatsapp } from "@/data/site";

/**
 * The two optional contact actions: WhatsApp, and Google reviews.
 *
 * Both are configured in `src/data/site.ts` and both render nothing at all
 * until they are. That is the whole design: a WhatsApp button needs Zafieon's
 * business number and a review button needs Zafieon's own Business Profile
 * links, and a guessed number or an unverified review URL is worse than no
 * button — one reaches a stranger, the other sends a customer to someone
 * else's listing.
 *
 * No rating or review count is shown anywhere. The only legitimate source for
 * those is the Google Business Profile API with Zafieon's own credentials, so
 * until that exists this links to Google and lets Google state the numbers.
 *
 * Styling follows the existing detail rows on Contact: a hairline frame, upper
 * case micro-type, magenta on hover. No new colour, radius or shadow.
 */

const ACTION =
  "inline-flex items-center gap-2.5 border border-line px-4 py-2.5 text-[0.68rem] font-semibold tracking-[0.14em] text-navy uppercase transition-colors duration-400 hover:border-navy/40 hover:text-magenta-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-magenta";

/** WhatsApp's glyph, from Simple Icons, as used by SocialLinks. */
const WHATSAPP_PATH =
  "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.966 1.164-.198.199-.396.223-.693.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.347-.361.521-.56.174-.198.223-.34.335-.536.112-.197.056-.371-.028-.52-.084-.149-.633-1.527-.867-2.09-.234-.563-.471-.492-.67-.492-.198 0-.396-.025-.594-.025-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488";

/** Google's "G", from Simple Icons. */
const GOOGLE_PATH =
  "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z";

const Glyph = ({ d }: { d: string }) => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
    className="h-3.5 w-3.5 fill-current"
  >
    <path d={d} />
  </svg>
);

export default function ContactActions() {
  const hasReviews = !!googleReviews.readUrl || !!googleReviews.writeUrl;
  if (!whatsappHref && !hasReviews) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {whatsappHref && (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={ACTION}
        >
          <Glyph d={WHATSAPP_PATH} />
          {whatsapp.label}
        </a>
      )}
      {googleReviews.readUrl && (
        <a
          href={googleReviews.readUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={ACTION}
        >
          <Glyph d={GOOGLE_PATH} />
          Read our Google reviews
        </a>
      )}
      {googleReviews.writeUrl && (
        <a
          href={googleReviews.writeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={ACTION}
        >
          <Glyph d={GOOGLE_PATH} />
          Write a review
        </a>
      )}
    </div>
  );
}
