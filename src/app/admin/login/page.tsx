import { redirect } from "next/navigation";
import { isAuthenticated, isConfigured } from "@/lib/admin-auth";
import LoginForm from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await isAuthenticated()) redirect("/admin");
  const cfg = isConfigured();

  return (
    <div className="shell flex min-h-[calc(100vh-84px)] items-center justify-center py-16">
      <div className="w-full max-w-[26rem]">
        <span className="eyebrow text-magenta-600">Restricted</span>
        <h1 className="mt-5 text-[length:var(--text-display-3)] leading-[1.05] text-navy">
          Sign in
        </h1>
        <p className="mt-4 text-[0.92rem] leading-[1.7] text-muted">
          The dashboard manages the four Zafieon Insights entries — their
          images and their text. Nothing else on the website can be changed
          from here.
        </p>

        {cfg.ok ? (
          <>
            <div className="mt-9">
              <LoginForm />
            </div>
            {cfg.usingPlaintext && (
              <p className="mt-6 border-l-2 border-magenta py-1 pl-5 text-[0.8rem] leading-[1.65] text-muted">
                This deployment is using a plaintext{" "}
                <code className="text-navy">ADMIN_PASSWORD</code>. Set{" "}
                <code className="text-navy">ADMIN_PASSWORD_HASH</code> instead
                before going live — run{" "}
                <code className="text-navy">node tools/admin-hash.mjs</code>.
              </p>
            )}
          </>
        ) : (
          <div className="mt-9 border border-line bg-paper p-7">
            <span className="eyebrow text-magenta-600">Not configured</span>
            <p className="mt-4 text-[0.9rem] leading-[1.7] text-muted">
              {cfg.reason} The dashboard stays closed until the deployment
              supplies both a session secret and a password. See the Admin
              Dashboard section of the README.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
