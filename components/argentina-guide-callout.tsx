import { Link } from "@/i18n/navigation";
import { ArrowRight, Globe2, Scale, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ArgentinaGuideCalloutProps {
  locale: string;
  title?: string;
  description?: string;
  className?: string;
  showCalculator?: boolean;
}

export function ArgentinaGuideCallout({
  locale,
  title = "¿Comprando desde Argentina?",
  description = "Vea la guía en español para compradores argentinos que están evaluando maquinaria usada en EE.UU., alcance puerta a puerto y costos que quedan del lado local.",
  className,
  showCalculator = false,
}: ArgentinaGuideCalloutProps) {
  if (locale !== "es") return null;

  return (
    <Card
      className={cn(
        "overflow-hidden border-slate-900 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_38%),linear-gradient(135deg,#0f172a_0%,#111827_55%,#172554_100%)] text-white shadow-xl",
        className,
      )}
    >
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <Badge className="border border-white/15 bg-white/10 text-sky-100 hover:bg-white/10">
              <Globe2 className="mr-1.5 h-3.5 w-3.5" />
              Guía Argentina
            </Badge>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-sky-100">
              {description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky-100">
                <Search className="h-3.5 w-3.5 text-sky-300" />
                Compra en EE.UU.
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky-100">
                <Scale className="h-3.5 w-3.5 text-sky-300" />
                Alcance puerta a puerto
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-sky-100">
                AFIDI / SENASA
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 lg:w-auto lg:min-w-64">
            <Button
              render={<Link href="/destinations/argentina" />}
              className="h-11 rounded-xl bg-white text-foreground hover:bg-slate-100"
            >
              Ver guía para Argentina
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {showCalculator && (
              <Button
                render={<Link href="/pricing/calculator" />}
                variant="outline"
                className="h-11 rounded-xl border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Calcular flete estimado
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
