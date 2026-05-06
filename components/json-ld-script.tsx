"use client";

import { useServerInsertedHTML } from "next/navigation";
import { useRef } from "react";

interface JsonLdScriptProps {
  encodedJson: string;
}

function decodeBase64Utf8(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function JsonLdScript({ encodedJson }: JsonLdScriptProps) {
  const hasInserted = useRef(false);

  useServerInsertedHTML(() => {
    if (hasInserted.current) return null;
    hasInserted.current = true;

    return (
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: decodeBase64Utf8(encodedJson) }}
      />
    );
  });

  return null;
}
