import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/admin-auth";
import {
  allSlotImages,
  driver,
  slotRecords,
  slotText,
  SLOTS,
} from "@/lib/insight-store";
import { insights } from "@/data/insights";
import SlotEditor from "@/components/admin/SlotEditor";
import TextEditor from "@/components/admin/TextEditor";
import SignOutButton from "@/components/admin/SignOutButton";

/**
 * ADMIN DASHBOARD
 *
 * One job: maintain the four Zafieon Insights entries — the image, and the
 * text beside it. Nothing else on the site can be changed from here, and
 * nothing else should be: the rest is content in `src/data` under version
 * control, where a change is reviewable and a mistake is revertable.
 *
 * Image and text are two separate saves against two separate endpoints, so
 * replacing artwork never disturbs copy and editing copy never disturbs
 * artwork.
 */
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const [images, records, text] = await Promise.all([
    allSlotImages(),
    slotRecords(),
    slotText(),
  ]);
  const store = driver();

  return (
    <div className="shell py-14 lg:py-20">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <span className="eyebrow text-magenta-600">Zafieon Insights</span>
          <h1 className="mt-5 text-[length:var(--text-display-2)] leading-[1.02] text-navy">
            Insights content
          </h1>
          <p className="mt-5 max-w-[54ch] text-[0.95rem] leading-[1.75] text-muted">
            Each slot below is one entry on the public Zafieon Insights
            section. Replace the image or edit the text and it appears on the
            website immediately — nothing needs to be rebuilt or redeployed.
            The two save separately, so changing one leaves the other alone.
          </p>
        </div>
        <SignOutButton />
      </div>

      <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
        {SLOTS.map((slot) => {
          const insight = insights.find((i) => i.slot === slot);
          const stored = text[slot];
          return (
            <div
              key={slot}
              className="flex flex-col border border-line bg-paper"
            >
              <SlotEditor
                slot={slot}
                title={stored?.title ?? insight?.title ?? `Insight ${slot}`}
                currentUrl={images[slot]}
                replaced={records[slot]?.updatedAt ?? null}
                bytes={records[slot]?.bytes ?? null}
              />
              <TextEditor
                slot={slot}
                shipped={{
                  title: insight?.title ?? "",
                  standfirst: insight?.standfirst ?? "",
                  body: insight?.body ?? [],
                }}
                override={
                  stored
                    ? {
                        title: stored.title,
                        standfirst: stored.standfirst,
                        body: stored.body,
                      }
                    : null
                }
              />
            </div>
          );
        })}
      </div>

      <div className="mt-14 border border-line bg-paper p-7 lg:p-9">
        <span className="eyebrow text-muted-light">Storage</span>
        <p className="mt-4 max-w-[74ch] text-[0.88rem] leading-[1.75] text-muted">
          {store === "blob" ? (
            <>
              Uploads are stored in Vercel Blob and served from its CDN. They
              survive redeployment.
            </>
          ) : (
            <>
              Uploads are stored on this server&apos;s filesystem, in{" "}
              <code className="text-navy">
                {process.env.INSIGHT_STORAGE_DIR ?? ".data/insights"}
              </code>
              . They survive redeployment as long as that directory is on
              persistent storage — a mounted volume rather than an ephemeral
              container filesystem. On a serverless host, set{" "}
              <code className="text-navy">BLOB_READ_WRITE_TOKEN</code> to switch
              to Vercel Blob instead.
            </>
          )}
        </p>
      </div>
    </div>
  );
}
