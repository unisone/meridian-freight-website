"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(
    () => typeof window !== "undefined" && !localStorage.getItem(CONSENT_KEY)
  );

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShow(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] border-t border-gray-200 bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-xl sm:border">
      <p className="text-sm text-gray-600">
        We use cookies to analyze site traffic and optimize your experience.
        By accepting, you consent to our use of analytics cookies.
      </p>
      <div className="mt-3 flex gap-3">
        <Button
          onClick={accept}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Accept
        </Button>
        <Button
          onClick={decline}
          size="sm"
          variant="outline"
        >
          Decline
        </Button>
      </div>
    </div>
  );
}

/** Check if user has accepted cookies */
export function hasConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}
