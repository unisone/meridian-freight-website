import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative flex min-h-screen items-center justify-center">
      {/* Background image */}
      <Image
        src="/images/logistics1.jpg"
        alt="Heavy machinery being loaded into shipping containers"
        fill
        className="object-cover object-center"
        priority
        quality={85}
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="mx-auto max-w-4xl">
          {/* Trust badge */}
          <div className="mb-8 sm:mb-10 inline-flex items-center gap-2 rounded-full bg-blue-600/90 px-5 py-2.5 text-sm font-medium shadow-lg backdrop-blur-sm">
            <Globe className="h-4 w-4" />
            Trusted Worldwide
          </div>

          {/* H1 */}
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight">
            Professional Machinery Export &amp; Logistics
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-3xl text-base font-medium leading-relaxed text-white/90 sm:mt-8 sm:text-lg md:text-xl lg:text-2xl">
            We disassemble, pack, and ship heavy machinery worldwide.
            Combines, tractors, excavators — securely loaded into 40ft
            containers, ready for global export.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:mt-10 sm:flex-row sm:gap-6">
            <Link href="/contact">
              <Button
                size="lg"
                className="h-14 px-8 text-lg font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get a Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/services">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg font-semibold rounded-xl border-2 border-white text-white bg-transparent hover:bg-white hover:text-blue-600 shadow-lg transition-all hover:scale-105"
              >
                Our Services
              </Button>
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 sm:mt-20 animate-bounce">
            <ChevronDown className="mx-auto h-8 w-8 text-white/60" />
          </div>
        </div>
      </div>
    </section>
  );
}
