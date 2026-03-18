"use client";

import Link from "next/link";
import { MessageCircle, Phone, FileText } from "lucide-react";
import { CONTACT } from "@/lib/constants";

export function MobileBottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white/95 backdrop-blur-sm shadow-[0_-2px_10px_rgba(0,0,0,0.1)] lg:hidden">
      <div className="grid grid-cols-3">
        <a
          href={CONTACT.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-green-600 transition-colors hover:bg-green-50"
        >
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs font-medium">WhatsApp</span>
        </a>
        <a
          href={CONTACT.phoneHref}
          className="flex flex-col items-center gap-1 py-3 text-blue-600 transition-colors hover:bg-blue-50"
        >
          <Phone className="h-5 w-5" />
          <span className="text-xs font-medium">Call</span>
        </a>
        <Link
          href="/contact"
          className="flex flex-col items-center gap-1 py-3 text-blue-600 transition-colors hover:bg-blue-50"
        >
          <FileText className="h-5 w-5" />
          <span className="text-xs font-medium">Get Quote</span>
        </Link>
      </div>
    </div>
  );
}
