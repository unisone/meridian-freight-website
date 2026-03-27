"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import {
  Phone,
  Menu,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { CONTACT, NAV_ITEMS } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DURATION, EASE } from "@/lib/motion";
import { trackContactClick } from "@/lib/tracking";
import { useTranslations } from "next-intl";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useTranslations("Header");
  const tc = useTranslations("Common");

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
          ? "glass-heavy shadow-sm ghost-border"
          : "bg-white"
      }`}
      aria-label={t("mainNavLabel")}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center rounded-lg py-1 px-1 transition-all"
            aria-label={t("logoAlt")}
          >
            <Image
              src="/logos/MF Logos White/meridianFreight-logo-W-250.png"
              alt="Meridian Freight Inc."
              width={250}
              height={56}
              className="h-10 lg:h-12 w-auto brightness-0"
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
                      onKeyDown={(e) => {
                        if (e.key === "Escape") setOpenDropdown(null);
                      }}
                      className="flex items-center gap-1 font-medium py-2 px-3 text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground link-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      aria-expanded={openDropdown === item.label}
                      aria-haspopup="true"
                    >
                      <span>{t(`nav.${item.label}`)}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-300 ${
                          openDropdown === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {openDropdown === item.label && (
                        <motion.div
                          initial={{ opacity: 0, scaleY: 0.97, y: -4 }}
                          animate={{ opacity: 1, scaleY: 1, y: 0 }}
                          exit={{ opacity: 0, scaleY: 0.97, y: -4 }}
                          transition={{
                            duration: DURATION.normal,
                            ease: EASE.decelerate,
                          }}
                          style={{ transformOrigin: "top" }}
                          className="absolute top-full left-0 mt-1 w-72 rounded-lg glass-heavy ghost-border py-1.5 shadow-xl"
                          onMouseLeave={() => setOpenDropdown(null)}
                        >
                          <div className="py-1">
                            {item.children.map((child, childIdx) => (
                              <motion.div
                                key={child.href}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: DURATION.fast,
                                  delay: childIdx * 0.04,
                                  ease: EASE.decelerate,
                                }}
                              >
                                <Link
                                  href={child.href}
                                  className="block px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/5 hover:text-primary/80"
                                  onClick={() => setOpenDropdown(null)}
                                >
                                  {t(`nav.${child.label}`)}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-1 bg-muted px-3 pt-2.5 pb-2 rounded-b-lg">
                            <Link
                              href="/contact"
                              className="block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90"
                              onClick={() => setOpenDropdown(null)}
                            >
                              {tc("getFreeQuote")}
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="font-medium py-2 px-3 text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground link-underline"
                  >
                    {t(`nav.${item.label}`)}
                  </Link>
                )}
              </div>
            ))}

            <LanguageSwitcher />

            {/* CTA — WhatsApp primary */}
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick("whatsapp", "header_desktop")}
              className="ml-4 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              {tc("chatOnWhatsApp")}
            </a>
          </div>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              className="lg:hidden p-2.5 rounded-lg transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              aria-label={t("openMenu")}
            >
              <Menu
                className="h-6 w-6 text-foreground"
              />
            </SheetTrigger>
            <SheetContent side="right" className="w-80 overflow-y-auto">
              <SheetTitle className="sr-only">{t("mobileMenuTitle")}</SheetTitle>
              <div className="flex flex-col gap-1 pt-8">
                <div className="mb-2 px-4">
                  <LanguageSwitcher />
                </div>
                {NAV_ITEMS.map((item, idx) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: DURATION.normal,
                      delay: idx * 0.04,
                      ease: EASE.decelerate,
                    }}
                  >
                    {"children" in item && item.children ? (
                      <div>
                        <Link
                          href={item.href}
                          className="block py-3 px-4 text-lg font-medium text-foreground hover:text-primary/80 transition-colors rounded-lg hover:bg-muted"
                          onClick={() => setMobileOpen(false)}
                        >
                          {t(`nav.${item.label}`)}
                        </Link>
                        <div className="pl-4">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block py-2.5 px-4 text-sm text-muted-foreground hover:text-primary/80 transition-colors rounded-lg hover:bg-muted"
                              onClick={() => setMobileOpen(false)}
                            >
                              {t(`nav.${child.label}`)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-3 px-4 text-lg font-medium text-foreground hover:text-primary/80 transition-colors rounded-lg hover:bg-muted"
                        onClick={() => setMobileOpen(false)}
                      >
                        {t(`nav.${item.label}`)}
                      </Link>
                    )}
                  </motion.div>
                ))}

                {/* WhatsApp CTA — delayed entrance */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: DURATION.normal,
                    delay: 0.2,
                    ease: EASE.decelerate,
                  }}
                >
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3.5 text-center text-base font-semibold text-white transition-colors hover:bg-emerald-700"
                    onClick={() => { setMobileOpen(false); trackContactClick("whatsapp", "header_mobile_menu"); }}
                  >
                    <MessageCircle className="h-5 w-5" />
                    {tc("chatOnWhatsApp")}
                  </a>
                </motion.div>

                {/* Mobile contact cards */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: DURATION.normal,
                    delay: 0.25,
                    ease: EASE.decelerate,
                  }}
                  className="mt-6 space-y-3 bg-muted -mx-4 px-4 pt-6 pb-2 rounded-lg"
                >
                  <a
                    href={CONTACT.phoneHref}
                    onClick={() => trackContactClick("phone", "header_mobile")}
                    className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 transition-colors hover:bg-emerald-100"
                  >
                    <Phone className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-foreground">
                        {tc("callNow")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {CONTACT.phone}
                      </div>
                    </div>
                  </a>
                  <a
                    href={CONTACT.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactClick("whatsapp", "header_mobile_card")}
                    className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4 transition-colors hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-600" />
                    <div>
                      <div className="font-medium text-foreground">
                        WhatsApp
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {tc("quickResponse")}
                      </div>
                    </div>
                  </a>
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
