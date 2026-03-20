import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube } from "lucide-react";

import { COMPANY, CONTACT, SOCIAL, NAV_ITEMS } from "@/lib/constants";
import { equipmentTypes } from "@/content/equipment";
import { destinations } from "@/content/destinations";

const SERVICE_LINKS = [
  { label: "Machinery Dismantling & Packing", href: "/services/machinery-packing" },
  { label: "Container Loading & Export", href: "/services/container-loading" },
  { label: "Agricultural Equipment", href: "/services/agricultural" },
  { label: "Equipment Sourcing & Procurement", href: "/services/equipment-sales" },
  { label: "Export Documentation", href: "/services/documentation" },
  { label: "Warehouse & Storage", href: "/services/warehousing" },
];

const QUICK_LINKS = NAV_ITEMS.filter(
  (item) => !("children" in item && item.children)
);

const EQUIPMENT_LINKS = equipmentTypes.map((e) => ({
  label: e.pluralName,
  href: `/equipment/${e.slug}`,
}));

const DESTINATION_LINKS = destinations.map((d) => ({
  label: d.country,
  href: `/destinations/${d.slug}`,
}));

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-6">
          {/* Column 1: Company info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Meridian Freight Inc. — Home">
              <Image
                src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
                alt={COMPANY.name}
                width={200}
                height={45}
                className="h-10 w-auto brightness-110"
              />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              One company for the entire export chain — equipment pickup,
              dismantling, packing, documentation, and worldwide shipping
              from the USA and Canada.
            </p>

            {/* Contact details */}
            <div className="mt-6 space-y-3">
              <a
                href={CONTACT.phoneHref}
                className="flex items-center gap-3 text-sm transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4 text-sky-400" />
                {CONTACT.phone}
              </a>
              <a
                href={CONTACT.emailHref}
                className="flex items-center gap-3 text-sm transition-colors hover:text-white"
              >
                <Mail className="h-4 w-4 text-sky-400" />
                {CONTACT.email}
              </a>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 shrink-0 text-sky-400" />
                {CONTACT.address.full}
              </div>
            </div>

            {/* Social icons */}
            <div className="mt-6 flex gap-3">
              <a
                href={SOCIAL.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-sky-500 hover:text-white hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-pink-500 hover:text-white hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href={SOCIAL.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-all hover:bg-red-600 hover:text-white hover:scale-110"
                aria-label="Watch our YouTube videos"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm transition-colors hover:text-white link-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/faq"
                  className="text-sm transition-colors hover:text-white link-underline"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="mt-4 space-y-3">
              {SERVICE_LINKS.map((link) => (
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

          {/* Column 4: Equipment */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
              Equipment
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
              Destinations
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
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              {LEGAL_LINKS.map((link) => (
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

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Get a Quote
              </h3>
            <p className="mt-3 text-sm text-slate-400">
                Tell us what you need shipped — free quote within 24 hours.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-block rounded-lg bg-sky-500 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-sky-600"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        <div className="my-10 h-px bg-slate-800/50" />

        {/* Trust signals */}
        <p className="text-center text-sm font-medium text-slate-400 mb-6">
          Fully Insured &middot; 500+ Exports Completed &middot; Licensed Freight Forwarder
        </p>

        {/* Copyright */}
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            &copy; {year} {COMPANY.legalName} All rights reserved.
          </p>
          <p className="text-xs text-slate-600">
            {CONTACT.address.full} &middot; We speak English, Spanish, Russian &amp; Arabic
          </p>
        </div>
      </div>
    </footer>
  );
}
