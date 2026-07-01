// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { CookieConsent } from "@/components/cookie-consent";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      message: "We use cookies to analyze site traffic.",
      privacyPolicy: "Privacy Policy",
      accept: "Accept",
      decline: "Decline",
    };
    return messages[key] ?? key;
  },
}));

vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a href={String(href)} {...props}>
      {children}
    </a>
  ),
}));

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      callback(0);
      return 0;
    });
  });

  it("removes accepted banner controls from the accessibility tree", async () => {
    const user = userEvent.setup();
    render(<CookieConsent />);

    expect(
      await screen.findByRole("alertdialog", { name: /cookie consent/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /accept/i }));

    expect(localStorage.getItem("cookie-consent")).toBe("accepted");

    await waitFor(() => {
      expect(
        screen.queryByRole("alertdialog", { name: /cookie consent/i }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText(/cookie consent/i, { selector: "div" })).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
