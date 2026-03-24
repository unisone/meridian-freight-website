"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ display: "flex", minHeight: "100vh", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: "1rem", color: "#666" }}>
            {error.message || "A critical error occurred."}
          </p>
          <button
            onClick={reset}
            style={{ marginTop: "2rem", padding: "0.75rem 1.5rem", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
