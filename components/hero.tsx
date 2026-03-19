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
            <p
              style={{ animationDelay: "0s" }}
              className="animate-slide-up text-xs font-medium uppercase tracking-wider text-primary sm:text-sm"
            >
              All-In-One Machinery Export
            </p>

            <h1
              style={{ animationDelay: "0.15s" }}
              className="animate-slide-up mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl leading-tight"
            >
              From Seller to Port — We Handle Everything
            </h1>

            <p
              style={{ animationDelay: "0.3s" }}
              className="animate-fade-in mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground"
            >
              One company for the entire chain: equipment pickup, professional
              dismantling, secure packing, export documentation, and worldwide
              shipping. No coordination headaches.
            </p>
            <p
              style={{ animationDelay: "0.35s" }}
              className="animate-fade-in mt-2 text-sm text-slate-500"
            >
              Serving buyers in Latin America, Africa, the Middle East &amp; Central Asia
            </p>

            {/* CTAs — shadow-breathe on WhatsApp (not pulse rings) */}
            <div
              style={{ animationDelay: "0.5s" }}
              className="animate-slide-up mt-8 flex flex-col gap-4 sm:flex-row sm:gap-4"
            >
              <Button
                size="lg"
                className="h-13 w-full px-7 text-base font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all hover:shadow-lg animate-shadow-breathe sm:w-auto"
                render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Get a quote on WhatsApp" />}
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Get a Quote on WhatsApp
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 w-full px-7 text-base font-semibold rounded-lg border border-slate-300 text-slate-700 bg-transparent hover:bg-muted transition-all sm:w-auto"
                render={<Link href="/pricing/calculator" />}
              >
                Get Instant Estimate
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Image — fade in only, no slide (images shouldn't fly in) */}
          <div
            style={{ animationDelay: "0.6s" }}
            className="animate-fade-in relative"
          >
            <div className="overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/hero-jd-s670-crew.jpg"
                alt="John Deere S670 combine being secured on a Hapag-Lloyd flat rack by crew in hi-vis vests"
                width={720}
                height={540}
                className="h-auto w-full object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
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
