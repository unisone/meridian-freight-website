import { Package } from "lucide-react";
import { CONTACT } from "@/lib/constants";

interface EmptyStateProps {
  /** "no-data" = Supabase returned null, "no-results" = filter has 0 matches */
  variant: "no-data" | "no-results";
  filterCountry?: string;
  onClearFilters?: () => void;
}

export function EmptyState({ variant, filterCountry, onClearFilters }: EmptyStateProps) {
  if (variant === "no-results") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 rounded-full bg-muted p-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">
          No containers heading to {filterCountry ?? "this destination"}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground max-w-md">
          We don&apos;t have containers on this route right now. New shipments are added regularly.
        </p>
        <div className="mt-4 flex gap-3">
          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
            >
              Clear filters
            </button>
          )}
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80"
          >
            Contact us about this route
          </a>
        </div>
      </div>
    );
  }

  // no-data
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-muted p-4">
        <Package className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold">No containers available right now</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        New shipments are added regularly. Contact us to discuss your shipping needs
        or check back soon.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          WhatsApp Us
        </a>
        <a
          href={CONTACT.phoneHref}
          className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          or call {CONTACT.phone}
        </a>
      </div>
    </div>
  );
}
