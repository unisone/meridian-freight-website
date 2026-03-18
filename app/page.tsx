import { COMPANY } from "@/lib/constants";

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center pt-20">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {COMPANY.name}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {COMPANY.tagline}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Homepage sections coming in Phase 3
        </p>
      </div>
    </div>
  );
}
