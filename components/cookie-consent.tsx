"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show if no consent decision has been made yet
    if (!localStorage.getItem(CONSENT_KEY)) {
      // Use requestAnimationFrame to avoid the React 19 set-state-in-effect lint rule
      // while ensuring the banner appears after hydration
      requestAnimationFrame(() => setShow(true));
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setShow(false);
    window.dispatchEvent(new CustomEvent("cookie-consent-accepted"));
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, "declined");
    setShow(false);
  }

  // Always render — CSS transition handles enter/exit animation
  return (
    <div
      className={`fixed bottom-16 left-0 right-0 z-[60] bg-white p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] sm:bottom-4 sm:left-4 sm:right-auto sm:max-w-md sm:rounded-xl transition-all duration-300 ${
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-full opacity-0 pointer-events-none"
      }`}
    >
      <p className="text-sm text-slate-600">
        We use cookies to analyze site traffic and optimize your experience.
        By accepting, you consent to our use of analytics cookies.
      </p>
      <div className="mt-3 flex gap-3">
        <Button
          onClick={accept}
          size="sm"
          className="bg-sky-500 hover:bg-sky-600 text-white"
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
