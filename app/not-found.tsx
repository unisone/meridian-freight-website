import Link from "next/link";
import { ArrowRight, MessageCircle, Package, Globe, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, CONTACT } from "@/lib/constants";

const suggestedLinks = [
  { label: "Machinery Packing & Dismantling", href: "/services/machinery-packing", icon: Package },
  { label: "Container Loading & Export", href: "/services/container-loading", icon: Package },
  { label: "Agricultural Equipment", href: "/services/agricultural", icon: Package },
  { label: "Ship to Brazil", href: "/destinations/brazil", icon: Globe },
  { label: "Ship to UAE", href: "/destinations/uae", icon: Globe },
  { label: "Ship to Turkey", href: "/destinations/turkey", icon: Globe },
  { label: "Pricing & Calculator", href: "/pricing", icon: FileText },
  { label: "Completed Projects", href: "/projects", icon: FileText },
];

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 pt-20 pb-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
        <p className="mt-4 text-xl text-muted-foreground">
          This page doesn&apos;t exist — but your equipment still needs to ship.
        </p>
        <p className="mt-2 text-muted-foreground">
          {COMPANY.name} — {COMPANY.tagline}
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg"
            render={<Link href="/" />}
          >
            Back to Home
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
            render={
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
              />
            }
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chat on WhatsApp
          </Button>
        </div>

        {/* Suggested links */}
        <div className="mt-12 text-left">
          <h2 className="text-lg font-semibold text-foreground">
            Looking for one of these?
          </h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {suggestedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <link.icon className="h-4 w-4 shrink-0 text-primary" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact fallback */}
        <div className="mt-10 rounded-xl bg-muted p-6 text-center">
          <p className="text-sm font-medium text-foreground">
            Need help? Call us at{" "}
            <a href={CONTACT.phoneHref} className="text-primary hover:underline">
              {CONTACT.phone}
            </a>{" "}
            or email{" "}
            <a href={CONTACT.emailHref} className="text-primary hover:underline">
              {CONTACT.email}
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
