import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { CONTACT, SOCIAL } from "@/lib/constants";
import { TrackedContactLink } from "@/components/tracked-contact-link";
import { useTranslations } from "next-intl";

export function ContactInfo() {
  const t = useTranslations("ContactInfo");

  return (
    <div className="rounded-xl bg-white p-6 shadow-md sm:p-8 space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-foreground">
          {t("title")}
        </h3>
        <div className="mt-6 space-y-4">
          <TrackedContactLink
            href={CONTACT.whatsappUrl}
            type="whatsapp"
            location="contact_info"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-primary/5 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary transition-colors">
              <Phone className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{t("phoneWhatsApp")}</div>
              <div className="text-sm text-muted-foreground">{CONTACT.phone}</div>
            </div>
          </TrackedContactLink>

          <TrackedContactLink
            href={CONTACT.emailHref}
            type="email"
            location="contact_info"
            className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-primary/5 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary transition-colors">
              <Mail className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{t("email")}</div>
              <div className="text-sm text-muted-foreground">{CONTACT.email}</div>
            </div>
          </TrackedContactLink>

          <div className="flex items-center gap-4 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{t("address")}</div>
              <div className="text-sm text-muted-foreground">{CONTACT.address.full}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{t("hours")}</div>
              <div className="text-sm text-muted-foreground">{CONTACT.hours}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Social */}
      <div>
        <h3 className="text-lg font-bold text-foreground">{t("followUs")}</h3>
        <div className="mt-3 flex gap-3">
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110"
            aria-label={t("facebook")}
          >
            <Facebook className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110"
            aria-label={t("instagram")}
          >
            <Instagram className="h-4 w-4" />
          </a>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all hover:bg-primary hover:text-white hover:scale-110"
            aria-label={t("youtube")}
          >
            <Youtube className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
