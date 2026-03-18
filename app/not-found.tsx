import Link from "next/link";
import { COMPANY } from "@/lib/constants";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold tracking-tight text-foreground">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <p className="mt-2 text-muted-foreground">
        {COMPANY.name} — {COMPANY.tagline}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        Back to Home
      </Link>
    </main>
  );
}
