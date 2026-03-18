import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Youtube } from "lucide-react";
import { CONTACT, SOCIAL } from "@/lib/constants";

export function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Contact Information
        </h3>
        <div className="mt-6 space-y-5">
          <a
            href={CONTACT.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-blue-50 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-600 transition-colors">
              <Phone className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">Phone / WhatsApp</div>
              <div className="text-gray-600">{CONTACT.phone}</div>
            </div>
          </a>

          <a
            href={CONTACT.emailHref}
            className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-blue-50 group"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 group-hover:bg-blue-600 transition-colors">
              <Mail className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">Email</div>
              <div className="text-gray-600">{CONTACT.email}</div>
            </div>
          </a>

          <div className="flex items-center gap-4 p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">Address</div>
              <div className="text-gray-600">{CONTACT.address.full}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-lg">Hours</div>
              <div className="text-gray-600">{CONTACT.hours}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Social */}
      <div>
        <h3 className="text-xl font-bold text-gray-900">Follow Us</h3>
        <div className="mt-4 flex gap-3">
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md transition-all hover:bg-blue-700 hover:scale-110"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-pink-500 text-white shadow-md transition-all hover:bg-pink-600 hover:scale-110"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={SOCIAL.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-600 text-white shadow-md transition-all hover:bg-red-700 hover:scale-110"
            aria-label="YouTube"
          >
            <Youtube className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
