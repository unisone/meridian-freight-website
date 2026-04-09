import { Clock, FileText, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerItem } from "@/components/scroll-reveal";
import { useTranslations } from "next-intl";

export function Guarantees() {
  const t = useTranslations("Guarantees");

  const items = [
    {
      icon: Clock,
      titleKey: "quoteTitle" as const,
      descriptionKey: "quoteDescription" as const,
    },
    {
      icon: FileText,
      titleKey: "feesTitle" as const,
      descriptionKey: "feesDescription" as const,
    },
    {
      icon: Shield,
      titleKey: "insuredTitle" as const,
      descriptionKey: "insuredDescription" as const,
    },
    {
      icon: CheckCircle,
      titleKey: "clearanceTitle" as const,
      descriptionKey: "clearanceDescription" as const,
    },
  ];

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("heading")}
        </h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          {t("description")}
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, idx) => (
            <StaggerItem key={item.titleKey} index={idx}>
              <Card className="h-full border-primary/10">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {t(item.titleKey)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(item.descriptionKey)}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </div>
      </div>
    </section>
  );
}
