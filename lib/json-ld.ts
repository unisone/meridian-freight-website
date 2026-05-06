export function encodeJsonLd(value: unknown): string {
  return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
}
