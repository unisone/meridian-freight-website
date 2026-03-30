import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

import { COMPANY, CONTACT, SOCIAL, NAV_ITEMS } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/language-switcher";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { getAllEquipmentTypes } from "@/content/equipment";
import { getAllDestinations } from "@/content/destinations";
import { useTranslations, useLocale } from "next-intl";

const SERVICE_LINKS = [
  { labelKey: "Machinery Dismantling & Packing", href: "/services/machinery-packing" },
  { labelKey: "Container Loading & Export", href: "/services/container-loading" },
  { labelKey: "Agricultural Equipment", href: "/services/agricultural" },
  { labelKey: "Equipment Sourcing & Procurement", href: "/services/equipment-sales" },
  { labelKey: "Export Documentation", href: "/services/documentation" },
  { labelKey: "Warehouse & Storage", href: "/services/warehousing" },
];

const QUICK_LINKS = NAV_ITEMS.filter(
  (item) => !("children" in item && item.children)
);

export function Footer() {
  const t = useTranslations("Footer");
  const th = useTranslations("Header");
  const tc = useTranslations("Common");
  const locale = useLocale();
  const year = new Date().getFullYear();

  const EQUIPMENT_LINKS = getAllEquipmentTypes(locale).map((e) => ({
    label: e.pluralName,
    href: `/equipment/${e.slug}`,
  }));

  const DESTINATION_LINKS = getAllDestinations(locale).map((d) => ({
    label: d.country,
    href: `/destinations/${d.slug}`,
  }));

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <nav aria-label="Footer navigation" className="grid grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-6 lg:gap-12">
          {/* Column 1: Company info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label={t("homeAriaLabel")}>
              <Image
                src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
                alt={COMPANY.name}
                width={200}
                height={45}
                className="h-10 w-auto brightness-110"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {t("companyDescription")}
            </p>

            {/* Contact details */}
            <div className="mt-6 space-y-3">
              <TrackedContactLink
                href={CONTACT.phoneHref}
                type="phone"
                location="footer"
                className="flex items-center gap-3 text-sm transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                {CONTACT.phone}
              </TrackedContactLink>
              <TrackedContactLink
                href={CONTACT.emailHref}
                type="email"
                location="footer"
                className="flex items-center gap-3 text-sm transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                {CONTACT.email}
              </TrackedContactLink>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {CONTACT.address.full}
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-[color,background-color,transform] hover:bg-primary hover:text-white hover:scale-110"
                aria-label={t("followFacebook")}
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-[color,background-color,transform] hover:bg-pink-500 hover:text-white hover:scale-110"
                aria-label={t("followInstagram")}
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-[color,background-color,transform] hover:bg-red-600 hover:text-white hover:scale-110"
                aria-label={t("watchYouTube")}
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("quickLinks")}
            </h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white link-underline"
                  >
                    {th(`nav.${link.label}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/faq"
                  className="text-sm transition-colors hover:text-white link-underline"
                >
                  {t("faq")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("services")}
            </h3>
            <ul className="mt-4 space-y-3">
              {SERVICE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white link-underline"
                  >
                    {t(`nav.${link.labelKey}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Equipment */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("equipment")}
            </h3>
            <ul className="mt-4 space-y-3">
              {EQUIPMENT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Destinations */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("destinations")}
            </h3>
            <ul className="mt-4 space-y-3">
              {DESTINATION_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 6: Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t("legal")}
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/privacy"
                  className="text-sm transition-colors hover:text-white link-underline"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm transition-colors hover:text-white link-underline"
                >
                  {t("termsOfService")}
                </Link>
              </li>
            </ul>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                {t("getAQuote")}
              </h3>
            <p className="mt-3 text-sm text-slate-400">
                {t("quoteDescription")}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
              >
                {tc("contactUs")}
              </Link>
            </div>
          </div>
        </nav>

        <div className="my-10 h-px bg-slate-800/50" />

        {/* Trust signals */}
        <p className="text-center text-sm font-medium text-slate-400 mb-6">
          {t("trustSignals")}
        </p>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-400">
            {t("copyright", { year, company: COMPANY.legalName })}
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <p className="hidden text-xs text-slate-400 sm:block">
              {CONTACT.address.full} &middot; {t("languagesSpoken")}
            </p>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
