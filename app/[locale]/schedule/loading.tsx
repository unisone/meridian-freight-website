export default function ScheduleLoading() {
  return (
    <div className="pt-20 animate-pulse">
      {/* Breadcrumb placeholder */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-40 rounded bg-muted" />
      </div>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mx-auto h-4 w-48 rounded bg-muted" />
          <div className="mx-auto mt-3 h-10 w-80 rounded bg-muted" />
          <div className="mx-auto mt-4 h-5 w-96 max-w-full rounded bg-muted" />

          {/* Stats skeleton */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-5 w-5 rounded bg-muted" />
                <div className="h-8 w-12 rounded bg-muted" />
                <div className="h-3 w-20 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter bar skeleton */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-2 pb-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between py-3 border-b">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-9 w-24 rounded-md bg-muted" />
            ))}
          </div>
          <div className="h-9 w-40 rounded-md bg-muted" />
        </div>

        {/* Card skeletons */}
        <div className="mt-8 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl ring-1 ring-foreground/10 bg-white p-5 sm:p-6 space-y-4"
            >
              <div className="flex items-start gap-4">
                <div className="hidden sm:block h-12 w-12 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-48 rounded bg-muted" />
                  <div className="h-4 w-64 rounded bg-muted" />
                </div>
                <div className="h-9 w-24 rounded-md bg-muted" />
              </div>
              <div className="h-14 rounded-lg bg-muted/40" />
              <div className="h-2.5 rounded-full bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
