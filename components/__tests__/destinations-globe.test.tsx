// @vitest-environment jsdom

import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";

import { DestinationsGlobe } from "@/components/destinations-globe";

// react-globe.gl pulls in WebGL/three internals that are never rendered on the
// no-WebGL fallback path; stub it so the dynamic import is inert under jsdom.
vi.mock("react-globe.gl", () => ({ default: () => null }));

beforeAll(() => {
  // jsdom lacks ResizeObserver (the globe's responsive effect constructs one).
  if (!globalThis.ResizeObserver) {
    globalThis.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
  // Avoid a real network call for the country polygons.
  vi.stubGlobal(
    "fetch",
    vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve({ features: [] }) }),
    ),
  );
});

afterEach(() => cleanup());
afterAll(() => vi.unstubAllGlobals());

describe("DestinationsGlobe — WebGL resilience", () => {
  it("renders the static fallback (not a crash) when WebGL is unavailable", () => {
    // jsdom provides no WebGL context, so webglSupported() resolves false and the
    // component must render the fallback instead of attempting the globe. This is
    // the exact path that previously threw and blanked the /destinations route.
    render(<DestinationsGlobe />);
    expect(
      screen.getByText(/worldwide machinery export/i),
    ).toBeInTheDocument();
    // The route badge stays visible in the fallback state too.
    expect(screen.getByText(/8 Featured Routes/i)).toBeInTheDocument();
  });
});
