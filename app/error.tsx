"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        We hit an unexpected error loading this page. Try again, or reach out
        directly — we&apos;re here to help.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={reset}
          className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg"
        >
          Try again
        </Button>
        <Button
          variant="outline"
          className="rounded-lg"
          render={<Link href="/" />}
        >
          Back to Home
        </Button>
      </div>

      {/* Suggested pages */}
      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {[
          { href: "/services", label: "Services" },
          { href: "/pricing", label: "Pricing" },
          { href: "/pricing/calculator", label: "Freight Calculator" },
          { href: "/projects", label: "Projects" },
          { href: "/contact", label: "Contact" },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Contact fallback */}
      <div className="mt-6 rounded-xl bg-muted p-6 text-center max-w-md">
        <p className="text-sm text-muted-foreground">
          If this keeps happening, contact us directly:
        </p>
        <div className="mt-3 flex flex-col items-center gap-2 text-sm">
          <a href={CONTACT.phoneHref} className="font-medium text-primary hover:underline">
            {CONTACT.phone}
          </a>
          <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-emerald-600 hover:underline">
            Chat on WhatsApp
          </a>
          <a href={CONTACT.emailHref} className="font-medium text-primary hover:underline">
            {CONTACT.email}
          </a>
        </div>
      </div>
    </main>
  );
}
