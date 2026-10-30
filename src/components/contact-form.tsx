"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";

type Option = { value: string; label: string };
export type ContactFormCopy = {
  title: string; titleAccent: string; subtitle: string;
  fullName: string; fullNamePlaceholder: string; email: string;
  phone: string; phonePlaceholder: string; brand: string; brandPlaceholder: string;
  package: string; packages: Option[]; budget: string; budgets: Option[];
  message: string; messagePlaceholder: string;
  submit: string; sending: string; successTitle: string; successBody: string; error: string; close: string;
};

const dialCodes = [
  ["SA", "+966"], ["AE", "+971"], ["EG", "+20"], ["KW", "+965"], ["QA", "+974"], ["BH", "+973"], ["OM", "+968"],
  ["JO", "+962"], ["IQ", "+964"], ["MA", "+212"], ["US", "+1"], ["GB", "+44"], ["DE", "+49"], ["TR", "+90"],
] as const;
const flag = (country: string) => String.fromCodePoint(...[...country].map((letter) => 0x1f1a5 + letter.charCodeAt(0)));

export function ContactForm({ copy, isRtl = false }: { copy: ContactFormCopy; isRtl?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const Arrow = isRtl ? ArrowLeft : ArrowRight;

  // Every "#contact" link on the page opens this dialog; without JS they still scroll to the CTA band.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element) || !event.target.closest('a[href="#contact"]')) return;
      event.preventDefault();
      setStatus("idle");
      setOpen(true);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const dialog = ref.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const close = () => setOpen(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const digits = String(data.get("phone")).replace(/\D/g, "").replace(/^0+/, "");
    const lead = {
      full_name: data.get("full_name"), email: data.get("email"), phone: `${data.get("dial")}${digits}`,
      brand_link: data.get("brand_link"), package: data.get("package"), budget: data.get("budget"), message: data.get("message"),
    };
    setStatus("sending");
    const response = await fetch("/api/contact", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead),
    }).catch(() => null);
    setStatus(response?.ok ? "sent" : "error");
  }

  if (!open) return null;
  return (
    <dialog ref={ref} className="contact-dialog" aria-labelledby="contact-title" onCancel={close}
      onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <button className="reel-dialog-close" type="button" onClick={close} aria-label={copy.close}>
        <X size={22} />
      </button>
      <div className="contact-scroll">
        {status === "sent" ? (
          <div className="contact-success">
            <h2 id="contact-title">{copy.successTitle}</h2>
            <p>{copy.successBody}</p>
            <button className="contact-submit" type="button" onClick={close}>{copy.close}</button>
          </div>
        ) : (
          <>
            <h2 id="contact-title">{copy.title} <span>{copy.titleAccent}</span></h2>
            <p className="contact-subtitle">{copy.subtitle}</p>
            <form className="contact-form" onSubmit={submit}>
              <label className="contact-field">
                <span>{copy.fullName}</span>
                <input className="contact-input" name="full_name" placeholder={copy.fullNamePlaceholder} autoComplete="name" required maxLength={120} />
              </label>
              <label className="contact-field">
                <span>{copy.email}</span>
                <input className="contact-input" type="email" name="email" placeholder="you@example.com" autoComplete="email" required maxLength={254} dir="ltr" />
              </label>
              <div className="contact-field">
                <span>{copy.phone}</span>
                <div className="contact-phone" dir="ltr">
                  <select className="contact-input" name="dial" defaultValue="+966" aria-label="Country code">
                    {dialCodes.map(([country, dial]) => (
                      <option key={country} value={dial}>{flag(country)} {country} {dial}</option>
                    ))}
                  </select>
                  <input className="contact-input" type="tel" name="phone" inputMode="numeric" pattern="[0-9 ]{6,15}" placeholder={copy.phonePlaceholder} autoComplete="tel-national" required />
                </div>
              </div>
              <label className="contact-field">
                <span>{copy.brand}</span>
                <input className="contact-input" name="brand_link" placeholder={copy.brandPlaceholder} autoComplete="url" required maxLength={300} dir="ltr" />
              </label>
              <fieldset className="contact-field">
                <legend>{copy.package}</legend>
                <div className="contact-options">
                  {copy.packages.map((option) => (
                    <label key={option.value} className="contact-option">
                      <input type="radio" name="package" value={option.value} required />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="contact-field">
                <legend>{copy.budget}</legend>
                <div className="contact-options contact-options-2">
                  {copy.budgets.map((option) => (
                    <label key={option.value} className="contact-option">
                      <input type="radio" name="budget" value={option.value} required />
                      {option.label}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="contact-field contact-span">
                <span>{copy.message}</span>
                <textarea className="contact-input" name="message" rows={3} placeholder={copy.messagePlaceholder} required maxLength={5000} />
              </label>
              {status === "error" && <p className="contact-error" role="alert">{copy.error}</p>}
              <button className="contact-submit" type="submit" disabled={status === "sending"}>
                {status === "sending" ? copy.sending : copy.submit}
                <Arrow size={20} aria-hidden="true" />
              </button>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}
