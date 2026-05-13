/**
 * Simple server-side markdown-to-HTML converter.
 * Handles a subset of markdown used in blog content:
 * ## headings, ### headings, **bold**, - lists, [links](url), paragraphs.
 * No external dependencies.
 *
 * Internal links (starting with "/") are prefixed with the current non-English
 * locale so Spanish/Russian articles route readers to localized paths.
 * External links and absolute URLs are left untouched.
 */

const SUPPORTED_LOCALES = ["en", "es", "ru"] as const;

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string): string {
  return value.replace(/"/g, "&quot;");
}

function isSafeHref(href: string): boolean {
  if (href.startsWith("/")) return true;
  if (href.startsWith("#")) return true;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return true;
  try {
    const url = new URL(href);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

function isAbsoluteUrl(href: string): boolean {
  return /^[a-z][a-z0-9+\-.]*:/i.test(href);
}

function hasLocalePrefix(href: string): boolean {
  return SUPPORTED_LOCALES.some(
    (locale) => href === `/${locale}` || href.startsWith(`/${locale}/`),
  );
}

export function localizeHref(href: string, locale: string): string {
  if (locale === "en") return href;
  if (!href.startsWith("/")) return href;
  if (isAbsoluteUrl(href)) return href;
  if (hasLocalePrefix(href)) return href;
  return `/${locale}${href}`;
}

function processInline(line: string, locale: string): string {
  // Bold: **text**
  let result = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_match, text: string, rawHref: string) => {
      const href = rawHref.trim();
      if (!isSafeHref(href)) {
        return text;
      }
      const localized = localizeHref(href, locale);
      const isExternal = /^https?:\/\//i.test(localized);
      const attrs = isExternal
        ? ` target="_blank" rel="noopener noreferrer"`
        : "";
      return `<a href="${escapeAttribute(localized)}"${attrs}>${text}</a>`;
    },
  );
  return result;
}

export function renderMarkdown(md: string, locale: string = "en"): string {
  const blocks = md.split(/\n\n+/);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Heading 2: ## text
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      const text = processInline(escapeHtml(trimmed.slice(3)), locale);
      htmlParts.push(`<h2>${text}</h2>`);
      continue;
    }

    // Heading 3: ### text
    if (trimmed.startsWith("### ")) {
      const text = processInline(escapeHtml(trimmed.slice(4)), locale);
      htmlParts.push(`<h3>${text}</h3>`);
      continue;
    }

    // Unordered list: lines starting with -
    const lines = trimmed.split("\n");
    const isListBlock = lines.every((l) => l.trimStart().startsWith("- "));
    if (isListBlock) {
      const items = lines.map((l) => {
        const content = l.trimStart().slice(2);
        return `<li>${processInline(escapeHtml(content), locale)}</li>`;
      });
      htmlParts.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Paragraph: wrap in <p>, handle single newlines as <br>
    const paragraphLines = lines.map((l) =>
      processInline(escapeHtml(l.trim()), locale),
    );
    htmlParts.push(`<p>${paragraphLines.join("<br>")}</p>`);
  }

  return htmlParts.join("");
}
