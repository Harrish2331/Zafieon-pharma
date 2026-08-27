"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PrimaryButton } from "@/components/ui/Button";
import { contact } from "@/data/site";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Enquiry form.
 *
 * No backend endpoint was supplied, so submission is not wired to one — the
 * form validates, then hands the enquiry off via the visitor's own mail client
 * rather than silently pretending to have sent something. Swap `handleSubmit`
 * for a POST when the endpoint exists; nothing else needs to change.
 *
 * Fields are real labels, not placeholders, and the error state is announced.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const next: Record<string, string> = {};

    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();

    if (!name) next.name = "Please tell us your name.";
    if (!email) next.email = "Please give us an email address.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email))
      next.email = "That email address does not look right.";
    if (!message) next.message = "Please tell us what you need.";

    setErrors(next);
    if (Object.keys(next).length) return;

    const subject = `${form.get("enquiry") || "Enquiry"} — ${name}`;
    const body = [
      `Name: ${name}`,
      form.get("company") ? `Company: ${form.get("company")}` : null,
      `Email: ${email}`,
      form.get("phone") ? `Phone: ${form.get("phone")}` : null,
      `Enquiry type: ${form.get("enquiry")}`,
      "",
      String(message),
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `mailto:${contact.email.value}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const field =
    "w-full border border-line bg-paper px-4 py-3.5 text-[0.95rem] text-navy transition-colors placeholder:text-muted-light focus:border-navy focus:outline-none";
  const labelCls =
    "mb-2.5 block text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted";

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="border border-line bg-paper-50 p-9 lg:p-12"
            role="status"
          >
            <span className="eyebrow text-magenta-600">Thank you</span>
            <h3 className="mt-5 text-[length:var(--text-display-3)] text-navy">
              Your email client should now be open
            </h3>
            <p className="mt-5 max-w-[52ch] text-[0.95rem] leading-[1.75] text-muted">
              We have prepared your enquiry with everything you entered. Send it
              and a member of the team will come back to you. If nothing opened,
              write to us directly at{" "}
              <a
                href={`mailto:${contact.email.value}`}
                className="text-navy underline decoration-line-strong underline-offset-4 hover:decoration-magenta"
              >
                {contact.email.value}
              </a>
              .
            </p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-8 text-[0.7rem] font-semibold tracking-[0.16em] text-magenta-600 uppercase underline underline-offset-4"
            >
              Send another enquiry
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-7"
          >
            <div className="grid gap-7 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelCls}>
                  Name <span className="text-magenta-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-err" : undefined}
                  className={field}
                />
                {errors.name && (
                  <p id="name-err" className="mt-2 text-[0.8rem] text-magenta-600">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="company" className={labelCls}>
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  autoComplete="organization"
                  className={field}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelCls}>
                  Email <span className="text-magenta-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-err" : undefined}
                  className={field}
                />
                {errors.email && (
                  <p id="email-err" className="mt-2 text-[0.8rem] text-magenta-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className={labelCls}>
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  className={field}
                />
              </div>
            </div>

            <div>
              <label htmlFor="enquiry" className={labelCls}>
                Enquiry type
              </label>
              <select id="enquiry" name="enquiry" className={field} defaultValue={contact.enquiryTypes[0]}>
                {contact.enquiryTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className={labelCls}>
                Message <span className="text-magenta-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? "message-err" : undefined}
                className={`${field} resize-y`}
              />
              {errors.message && (
                <p id="message-err" className="mt-2 text-[0.8rem] text-magenta-600">
                  {errors.message}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <PrimaryButton type="submit">Send Enquiry</PrimaryButton>
              <p className="max-w-[38ch] text-[0.78rem] leading-relaxed text-muted-light">
                We use what you send only to answer your enquiry.
              </p>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
