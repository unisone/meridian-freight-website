import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Globe2,
  MessageCircle,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrackedCtaLink } from "@/components/tracked-cta-link";
import { TrackedContactLink } from "@/components/tracked-contact-link";

interface ArgentinaCombinePaidLandingProps {
  whatsappHref: string;
}

export function ArgentinaCombineHeroBridge() {
  return (
    <div className="mt-4 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-2xl text-sm leading-relaxed text-sky-100">
          <span className="font-semibold uppercase tracking-[0.2em] text-sky-300">
            Compradores argentinos
          </span>{" "}
          Separe compra, tramo puerta a puerto y costo local antes de cerrar la
          cosechadora con el dealer.
        </p>
        <TrackedCtaLink
          href="/destinations/argentina"
          location="combines_hero_argentina_guide"
          text="Guía para Argentina"
          className="inline-flex items-center justify-center rounded-xl bg-white px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-slate-100"
        >
          Guía para Argentina
          <ArrowRight className="ml-2 h-4 w-4" />
        </TrackedCtaLink>
      </div>
    </div>
  );
}

export function ArgentinaCombineDecisionBlock({
  whatsappHref,
}: ArgentinaCombinePaidLandingProps) {
  return (
    <section className="bg-[linear-gradient(180deg,rgba(248,250,252,1)_0%,rgba(255,255,255,1)_100%)] py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <Badge className="border border-primary/15 bg-primary/10 text-primary hover:bg-primary/10">
            <Globe2 className="mr-1.5 h-3.5 w-3.5" />
            Compradores argentinos
          </Badge>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Antes de cerrar la cosechadora, separe estas tres decisiones
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            No siempre conviene importar. Conviene cuando la máquina, la
            condición y la estructura puerta a puerto cierran bien antes de
            sumar el tramo local argentino.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card className="border-emerald-200 bg-emerald-50/80 shadow-sm ring-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
                    Meridian cubre
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {[
                  "Coordinación con dealer, subasta o vendedor en EE.UU.",
                  "Retiro en origen, desarme y embalaje de exportación.",
                  "Documentación de exportación y reserva marítima.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-emerald-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50/80 shadow-sm ring-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  <Scale className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-amber-700">
                    Argentina queda aparte
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {[
                  "Despachante, oficialización y nacionalización local.",
                  "Tributos, tasas y flete interior hasta su campo o planta.",
                  "AFIDI / SENASA cuando corresponda por tipo de equipo y condición.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-sky-200 bg-sky-50/80 shadow-sm ring-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-100 text-sky-700">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wider text-sky-700">
                    Antes de comprar
                  </p>
                </div>
              </div>
              <ul className="mt-5 space-y-3">
                {[
                  "Valide horas, estado, número de serie y documentación de propiedad.",
                  "Defina estrategia de cabezal, limpieza fitosanitaria y contenedor antes de señar.",
                  "Revise si el costo puesto realmente cierra antes de comprometerse con el vendedor.",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm leading-relaxed text-foreground"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-none text-sky-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <TrackedCtaLink
            href="/destinations/argentina"
            location="combines_argentina_scope_guide"
            text="Ver guía completa para Argentina"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-sm transition-colors hover:bg-primary/90"
          >
            Ver guía completa para Argentina
            <ArrowRight className="ml-2 h-4 w-4" />
          </TrackedCtaLink>
          <TrackedContactLink
            href={whatsappHref}
            type="whatsapp"
            location="combines_argentina_scope_whatsapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-white px-6 py-3 font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Chatear por WhatsApp
          </TrackedContactLink>
        </div>
      </div>
    </section>
  );
}
