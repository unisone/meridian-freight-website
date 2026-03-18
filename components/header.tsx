"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  Clock,
  Menu,
  FileText,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CONTACT, NAV_ITEMS, SOCIAL } from "@/lib/constants";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    const y = window.scrollY;
    setIsScrolled(y > 50);

    if (y > lastScrollY && y > 100) {
      setIsVisible(false);
      setOpenDropdown(null);
    } else {
      setIsVisible(true);
    }
    setLastScrollY(y);
  }, [lastScrollY]);

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
    <>
      {/* Utility bar */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white py-2.5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <div className="hidden md:flex items-center gap-4 text-blue-100">
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{CONTACT.hours}</span>
              </span>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <a
                href={CONTACT.emailHref}
                className="hidden sm:flex items-center gap-2 hover:text-blue-200 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>{CONTACT.email}</span>
              </a>
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-blue-100 transition-all py-1.5 px-3 rounded-lg hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                <span className="font-medium">{CONTACT.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <nav
        className={`fixed w-full z-50 transition-all duration-500 ease-out ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
            : "bg-black/50 backdrop-blur-md"
        } ${isVisible ? "translate-y-0" : "-translate-y-full"}`}
        aria-label="Main navigation"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-xl py-2 px-2 transition-all hover:bg-white/10"
              aria-label="Meridian Freight Inc. — Go to homepage"
            >
              <Image
                src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
                alt="Meridian Freight Inc."
                width={250}
                height={56}
                className={`h-12 sm:h-14 lg:h-16 w-auto transition-all group-hover:scale-105 ${
                  isScrolled ? "brightness-0" : "brightness-110 drop-shadow-xl"
                }`}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
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
                        className={`flex items-center gap-1 font-medium py-3 px-3 xl:px-4 text-sm xl:text-base transition-all hover:scale-105 ${
                          isScrolled
                            ? "text-gray-700 hover:text-blue-600"
                            : "text-white hover:text-blue-200"
                        }`}
                        aria-expanded={openDropdown === item.label}
                        aria-haspopup="true"
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openDropdown === item.label ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {openDropdown === item.label && (
                        <div
                          className="absolute top-full left-0 mt-2 w-80 rounded-xl border border-gray-100 bg-white py-2 shadow-2xl"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="border-b border-gray-100 px-4 pb-3">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {item.label}
                            </h4>
                            <p className="mt-1 text-xs text-gray-500">
                              Complete machinery export solutions
                            </p>
                          </div>
                          <div className="py-1">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setOpenDropdown(null)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                          <div className="border-t border-gray-100 px-4 pt-3">
                            <Link
                              href="/contact"
                              className="block w-full rounded-lg bg-blue-600 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
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
                      className={`font-medium py-3 px-3 xl:px-4 text-sm xl:text-base transition-all hover:scale-105 ${
                        isScrolled
                          ? "text-gray-700 hover:text-blue-600"
                          : "text-white hover:text-blue-200"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}

              {/* CTA */}
              <Link href="/contact" className="ml-4 xl:ml-6">
                <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold px-6 xl:px-8 py-5 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-blue-800 transition-all hover:scale-105">
                  <FileText className="mr-2 h-4 w-4" />
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger
                className={`lg:hidden p-3 rounded-xl transition-all hover:scale-110 ${
                  isScrolled ? "hover:bg-gray-100" : "hover:bg-white/15"
                }`}
                aria-label="Open menu"
              >
                <Menu
                  className={`h-7 w-7 ${
                    isScrolled ? "text-gray-700" : "text-white drop-shadow-md"
                  }`}
                />
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96 overflow-y-auto">
                <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                <div className="flex flex-col gap-2 pt-8">
                  {NAV_ITEMS.map((item) => (
                    <div key={item.label}>
                      {"children" in item && item.children ? (
                        <div>
                          <Link
                            href={item.href}
                            className="block py-3 px-4 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                            onClick={() => setMobileOpen(false)}
                          >
                            {item.label}
                          </Link>
                          <div className="pl-4">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block py-2.5 px-4 text-sm text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
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
                          className="block py-3 px-4 text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                          onClick={() => setMobileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}

                  <Link
                    href="/contact"
                    className="mt-4 block w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-4 text-center text-lg font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-blue-800"
                    onClick={() => setMobileOpen(false)}
                  >
                    <FileText className="mr-2 inline h-5 w-5" />
                    Get Free Quote
                  </Link>

                  {/* Mobile contact info */}
                  <div className="mt-6 space-y-3 border-t border-gray-200 pt-6">
                    <a
                      href={CONTACT.phoneHref}
                      className="flex items-center gap-3 rounded-xl bg-green-50 p-4 transition-colors hover:bg-green-100"
                    >
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">Call Now</div>
                        <div className="text-sm text-gray-600">{CONTACT.phone}</div>
                      </div>
                    </a>
                    <a
                      href={CONTACT.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-green-50 p-4 transition-colors hover:bg-green-100"
                    >
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium text-gray-900">WhatsApp</div>
                        <div className="text-sm text-gray-600">Quick Response</div>
                      </div>
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
}
