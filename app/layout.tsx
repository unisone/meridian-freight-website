// Minimal root layout — the full layout lives in app/[locale]/layout.tsx
// This file exists because Next.js requires a root layout, but next-intl
// handles the <html> and <body> tags in the locale-specific layout.

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
