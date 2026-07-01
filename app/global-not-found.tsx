import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { CONTACT, SITE } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic", "latin-ext"],
  preload: false,
});

export const metadata: Metadata = {
  title: `404 - Page Not Found | ${SITE.name}`,
  description: "The page you are looking for does not exist.",
  robots: {
    index: false,
    follow: false,
  },
};

const suggestedLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/pricing", label: "Pricing" },
  { href: "/pricing/calculator", label: "Freight Calculator" },
  { href: "/projects", label: "Projects" },
  { href: "/contact", label: "Contact" },
] as const;

export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-background text-foreground antialiased">
        <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <div className="mx-auto max-w-xl">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              404
            </h1>
            <p className="mt-3 text-muted-foreground">
              This page does not exist, but your equipment still needs to ship.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>

            <div className="mt-10">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Looking for one of these?
              </h2>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {suggestedLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Need help? Call us at{" "}
              <a
                href={CONTACT.phoneHref}
                className="font-medium text-primary hover:underline"
              >
                {CONTACT.phone}
              </a>{" "}
              or email{" "}
              <a
                href={CONTACT.emailHref}
                className="font-medium text-primary hover:underline"
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
