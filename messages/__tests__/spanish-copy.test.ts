import { describe, expect, it } from "vitest";
import esMessages from "@/messages/es.json";

function flattenText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(flattenText).join("\n");
  if (value && typeof value === "object") {
    return Object.values(value).map(flattenText).join("\n");
  }
  return "";
}

describe("Spanish message catalog copy", () => {
  it("does not reintroduce generic LATAM destination or chrome copy", () => {
    const text = flattenText(esMessages);
    const bannedPatterns = [
      /Enlaces Rapidos/,
      /Busqueda y Adquisicion/,
      /Almacen y Bodega/,
      /Exportaciónes|exportaciónes/,
      /Cotizaciónes|cotizaciónes/,
      /Diganos/,
      /Hablamos ingles, espanol, ruso y arabe/,
      /\btrafico\b/,
      /\banalisis\b/,
      /\bestimacion\b/,
      /Envienos/,
      /Recibira/,
      /Como Funciona/,
      /Listo para Enviar/,
      /enviar maquinaria/i,
      /Detalles de la Ruta/,
      /detalles de la ruta/i,
      /Equipos que Enviamos/,
      /Lo Que Necesita Saber/,
      /lo que necesita saber/i,
      /Equipo Agrícola/,
      /¿{2,}/,
      /Ã|Â/,
    ];

    for (const pattern of bannedPatterns) {
      expect(text).not.toMatch(pattern);
    }

    expect(text).toContain("Enlaces rápidos");
    expect(text).toContain("Búsqueda y adquisición de equipos");
    expect(text).toContain("Almacén y bodega");
    expect(text).toContain("Maquinaria agrícola");
    expect(text).toContain("Hablamos inglés, español, ruso y árabe");
    expect(text).toContain("tráfico");
    expect(text).toContain("análisis");
  });
});
