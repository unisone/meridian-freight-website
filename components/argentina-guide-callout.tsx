import { Link } from "@/i18n/navigation";
import { ArrowRight, MapPin } from "lucide-react";
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
  title = "Comprando desde Argentina?",
  description = "Vea la guia en espanol para compradores argentinos que estan evaluando maquinaria usada en EE.UU., alcance puerta a puerto y costos que quedan del lado local.",
  className,
  showCalculator = false,
}: ArgentinaGuideCalloutProps) {
  if (locale !== "es") return null;

  return (
    <Card className={cn("border-sky-200 bg-sky-50/80 shadow-sm", className)}>
      <CardContent className="p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-3xl">
            <Badge
              variant="secondary"
              className="border border-sky-200 bg-white text-sky-700"
            >
              <MapPin className="mr-1.5 h-3.5 w-3.5" />
              Guia Argentina
            </Badge>
            <h2 className="mt-4 text-2xl font-bold text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:min-w-60">
            <Button render={<Link href="/destinations/argentina" />} className="h-11">
              Ver guia para Argentina <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {showCalculator && (
              <Button
                render={<Link href="/pricing/calculator" />}
                variant="outline"
                className="h-11"
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
