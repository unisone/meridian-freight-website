"use client";

import { useState, useEffect, useCallback } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { Phone, Menu, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { CONTACT, NAV_ITEMS } from "@/lib/constants";
import { LanguageSwitcher } from "@/components/language-switcher";
import { DURATION, EASE } from "@/lib/motion";
import { trackContactClick } from "@/lib/tracking";
import { useTranslations } from "next-intl";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
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

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-[background-color,box-shadow] duration-300 ${
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
            className="flex items-center rounded-lg py-1 px-1 transition-opacity"
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
            <NavigationMenu
              popupClassName="glass-heavy ghost-border shadow-xl !bg-white/80 !backdrop-blur-xl !ring-0"
            >
              <NavigationMenuList>
                {NAV_ITEMS.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    {"children" in item && item.children ? (
                      <>
                        <NavigationMenuTrigger className="bg-transparent text-muted-foreground hover:text-foreground hover:bg-transparent focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent">
                          {t(`nav.${item.label}`)}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-72 p-0">
                          <div className="py-2.5">
                            {item.children.map((child) => (
                              <NavigationMenuLink
                                key={child.href}
                                render={<Link href={child.href} />}
                                closeOnClick
                                className="block rounded-none px-4 py-2.5 text-sm text-foreground transition-colors hover:bg-primary/5 hover:text-primary/80 focus-visible:bg-primary/5 focus-visible:text-primary/80 focus-visible:outline-none"
                              >
                                {t(`nav.${child.label}`)}
                              </NavigationMenuLink>
                            ))}
                          </div>
                          <div className="bg-muted px-3 pt-2.5 pb-2 rounded-b-lg">
                            <NavigationMenuLink
                              render={<Link href="/contact" />}
                              closeOnClick
                              className="block w-full rounded-md bg-primary py-2 text-center text-sm font-medium text-white transition-colors hover:bg-primary/90 focus-visible:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
                            >
                              {tc("getFreeQuote")}
                            </NavigationMenuLink>
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        render={<Link href={item.href} />}
                        className="font-medium py-2 px-3 text-sm transition-colors rounded-md text-muted-foreground hover:text-foreground link-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                      >
                        {t(`nav.${item.label}`)}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            <LanguageSwitcher />

            {/* CTA — WhatsApp primary */}
            <a
              href={CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactClick("whatsapp", "header_desktop")}
              className="group ml-4 inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <MessageCircle className="h-4 w-4 transition-transform group-hover:scale-110" aria-hidden="true" />
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
                    <MessageCircle className="h-5 w-5" aria-hidden="true" />
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
                    <Phone className="h-5 w-5 text-emerald-600" aria-hidden="true" />
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
                    <MessageCircle className="h-5 w-5 text-emerald-600" aria-hidden="true" />
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
