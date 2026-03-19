/**
 * Simple server-side markdown-to-HTML converter.
 * Handles a subset of markdown used in blog content:
 * ## headings, ### headings, **bold**, - lists, [links](url), paragraphs.
 * No external dependencies.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function processInline(line: string): string {
  // Bold: **text**
  let result = line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );
  return result;
}

export function renderMarkdown(md: string): string {
  const blocks = md.split(/\n\n+/);
  const htmlParts: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    // Heading 2: ## text
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      const text = processInline(escapeHtml(trimmed.slice(3)));
      htmlParts.push(`<h2>${text}</h2>`);
      continue;
    }

    // Heading 3: ### text
    if (trimmed.startsWith("### ")) {
      const text = processInline(escapeHtml(trimmed.slice(4)));
      htmlParts.push(`<h3>${text}</h3>`);
      continue;
    }

    // Unordered list: lines starting with -
    const lines = trimmed.split("\n");
    const isListBlock = lines.every((l) => l.trimStart().startsWith("- "));
    if (isListBlock) {
      const items = lines.map((l) => {
        const content = l.trimStart().slice(2);
        return `<li>${processInline(escapeHtml(content))}</li>`;
      });
      htmlParts.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    // Paragraph: wrap in <p>, handle single newlines as <br>
    const paragraphLines = lines.map((l) => processInline(escapeHtml(l.trim())));
    htmlParts.push(`<p>${paragraphLines.join("<br>")}</p>`);
  }

  return htmlParts.join("");
}
