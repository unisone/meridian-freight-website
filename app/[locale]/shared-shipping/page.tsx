import { permanentRedirect } from "next/navigation";

/**
 * /shared-shipping now redirects to /schedule (unified page).
 * 308 redirect preserves SEO link equity.
 */
export default async function SharedShippingRedirect({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const prefix = locale === "en" ? "" : `/${locale}`;
  permanentRedirect(`${prefix}/schedule`);
}
