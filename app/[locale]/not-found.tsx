"use client";

import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackNotFound } from "@/lib/tracking";

export default function NotFoundPage() {
  useEffect(() => {
    trackNotFound();
  }, []);

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">
          Page not found
        </h1>
        <p className="mt-3 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button
          render={<Link href="/" />}
          className="mt-8"
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to homepage
        </Button>
      </div>
    </main>
  );
}
