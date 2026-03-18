"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Menu,
  ChevronDown,
  MessageCircle,
  ArrowRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { CONTACT, NAV_ITEMS } from "@/lib/constants";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close dropdown on outside click
  useEffect(() => {
    const close = () => setOpenDropdown(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50"
          : "bg-transparent"
      }`}
      aria-label="Main navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center rounded-lg py-1 px-1 transition-all"
            aria-label="Meridian Freight Inc. — Go to homepage"
          >
            <Image
              src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
              alt="Meridian Freight Inc."
              width={250}
              height={56}
              className={`h-10 lg:h-12 w-auto transition-all ${
                isScrolled ? "brightness-0" : "brightness-110 drop-shadow-lg"
              }`}
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative">
                {"children" in item && item.children ? (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown(
                          openDropdown === item.label ? null : item.label
                        );
                      }}
                      onMouseEnter={() => setOpenDropdown(item.label)}
                      className={`flex items-center gap-1 font-medium py-2 px-3 text-sm transition-colors rounded-md ${
                        isScrolled
                          ? "text-slate-600 hover:text-slate-900"
                          : "text-white/90 hover:text-white"
                      }`}
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openDropdown === item.label && (
                      <div
                        className="absolute top-full left-0 mt-1 w-72 rounded-lg border border-slate-100 bg-white py-1.5 shadow-xl"
                        onMouseLeave={() => setOpenDropdown(null)}
                      >
                        <div className="py-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-sky-50 hover:text-sky-600"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                        <div className="border-t border-slate-100 px-3 pt-2 pb-1.5">
                          <Link
                            href="/contact"
                            className="block w-full rounded-md bg-sky-500 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-sky-600"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Get Free Quote
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-medium py-2 px-3 text-sm transition-colors rounded-md ${
                      isScrolled
                        ? "text-slate-600 hover:text-slate-900"
                        : "text-white/90 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}

            {/* CTA */}
            <Link
              href="/contact"
              className="ml-4 inline-flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              Get Quote
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className={`lg:hidden p-2.5 rounded-lg transition-colors ${
                isScrolled ? "hover:bg-slate-100" : "hover:bg-white/15"
              }`}
              aria-label="Open menu"
            >
              <Menu
                className={`h-6 w-6 ${
                  isScrolled ? "text-slate-700" : "text-white drop-shadow-md"
                }`}
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <div className="flex flex-col gap-1 pt-8">
                {NAV_ITEMS.map((item) => (
                  <div key={item.label}>
                    {"children" in item && item.children ? (
                      <div>
                        <Link
                          href={item.href}
                          className="block py-3 px-4 text-lg font-medium text-slate-900 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                        <div className="pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2.5 px-4 text-sm text-slate-600 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50"
                              onClick={() => setMobileOpen(false)}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 px-4 text-lg font-medium text-slate-900 hover:text-sky-600 transition-colors rounded-lg hover:bg-slate-50"
                        onClick={() => setMobileOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}

                {/* WhatsApp CTA */}
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-emerald-700"
                  onClick={() => setMobileOpen(false)}
                >
                  <MessageCircle className="h-5 w-5" />
                  Chat on WhatsApp
                </a>

                {/* Mobile contact cards */}
                <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                  <a
                    href={CONTACT.phoneHref}
                    className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 transition-colors hover:bg-emerald-100"
                  >
                    <Phone className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-slate-900">
                        Call Now
                      </div>
                      <div className="text-sm text-slate-600">
                        {CONTACT.phone}
                      </div>
                    </div>
                  </a>
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 transition-colors hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-slate-900">
                        WhatsApp
                      </div>
                      <div className="text-sm text-slate-600">
                        Quick Response
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
