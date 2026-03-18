import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "@/lib/constants";

export function Hero() {
  return (
    <section className="relative bg-white pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-32 lg:pb-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Text content */}
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-sky-500 sm:text-sm">
              Trusted Worldwide
            </p>

            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl xl:text-6xl leading-tight">
              Professional Machinery Export &amp; Logistics
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
              We disassemble, pack, and ship heavy machinery worldwide.
              Combines, tractors, excavators — securely loaded into 40ft
              containers, ready for global export.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:gap-4">
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="h-13 w-full px-7 text-base font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:shadow-lg sm:w-auto"
                >
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Get a Quote on WhatsApp
                </Button>
              </a>
              <Link href="/services">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 w-full px-7 text-base font-semibold rounded-lg border border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50 transition-all sm:w-auto"
                >
                  Our Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/logistics1.jpg"
                alt="Heavy machinery being loaded into shipping containers"
                width={720}
                height={540}
                className="h-auto w-full object-cover"
                priority
                quality={85}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
