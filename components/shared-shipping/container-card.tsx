"use client";

import { ArrowRight, MessageCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerItem } from "@/components/scroll-reveal";
import { CONTACT } from "@/lib/constants";
import {
  computeDisplayState,
  countryFlag,
  transitDays,
} from "@/lib/container-display";
import { cn } from "@/lib/utils";
import type { ContainerWithPendingCount } from "@/lib/types/shared-shipping";

interface ContainerCardProps {
  container: ContainerWithPendingCount;
  index: number;
  onRequestSpace: (container: ContainerWithPendingCount) => void;
}

/** Format an ISO date string as "Apr 15" */
function formatShortDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Build the progress indicator color class based on fill color */
function progressIndicatorClass(fillColor: "blue" | "amber" | "zinc"): string {
  switch (fillColor) {
    case "amber":
      return "bg-amber-500";
    case "zinc":
      return "bg-zinc-400";
    case "blue":
    default:
      return "bg-primary";
  }
}

export function ContainerCard({
  container,
  index,
  onRequestSpace,
}: ContainerCardProps) {
  const state = computeDisplayState(container);
  const flag = countryFlag(container.destination_country);
  const transit = transitDays(container.departure_date, container.eta_date);
  const availableCbm = container.available_cbm ?? 0;

  // TODO: t("card.requestSpace")
  const requestSpaceText = "Request Space";
  // TODO: t("card.contactUs")
  const contactUsText = "Contact Us";
  // TODO: t("card.departs")
  const departsText = "Departs";
  // TODO: t("card.arrives")
  const arrivesText = "Arrives";
  // TODO: t("card.spaceAvailable")
  const spaceAvailableText = "Space Available";
  // TODO: t("card.booked")
  const bookedText = "booked";
  // TODO: t("card.cbmAvailable")
  const cbmAvailableText = "CBM available";
  // TODO: t("card.transitDays", { count: transit })
  const transitDaysText = transit !== null ? `~${transit} days` : null;
  // TODO: t("card.limitedSpace")
  const limitedSpaceText = "Limited Space";
  // TODO: t("card.departingSoon")
  const departingSoonText = "Departing Soon";
  // TODO: t("card.popular")
  const popularText = "Popular";
  // TODO: t("card.full")
  const fullText = "Full";
  // TODO: t("card.requestsPending", { count: state.pendingCount })
  const requestsPendingText =
    state.pendingCount === 1
      ? `${state.pendingCount} request pending`
      : `${state.pendingCount} requests pending`;

  return (
    <StaggerItem index={index}>
      <Card
        className={cn(
          "transition-all duration-200 hover:shadow-md hover:scale-[1.02]",
          state.isFull && "opacity-75"
        )}
      >
        <CardContent className="p-5 space-y-4">
          {/* --- Route header --- */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 space-y-1">
              <p className="text-sm font-semibold leading-snug truncate">
                <span className="mr-1.5" aria-hidden="true">
                  {flag}
                </span>
                {container.origin}
                <span className="mx-1.5 text-muted-foreground">&rarr;</span>
                {container.destination}
              </p>
              <p className="text-xs text-muted-foreground">
                {container.container_type}
              </p>
            </div>

            {/* --- Badges --- */}
            <div className="flex flex-col items-end gap-1 shrink-0">
              {state.isFull && (
                <Badge className="bg-zinc-100 text-zinc-500 border-zinc-200">
                  {fullText}
                </Badge>
              )}
              {state.isDepartingSoon && !state.isFull && (
                <Badge className="bg-red-100 text-red-700 border-red-200">
                  {departingSoonText}
                </Badge>
              )}
              {state.isLimited && !state.isFull && (
                <Badge className="bg-amber-100 text-amber-700 border-amber-200">
                  {limitedSpaceText}
                </Badge>
              )}
              {state.demandLevel === "popular" && !state.isFull && (
                <Badge className="bg-orange-100 text-orange-700 border-orange-200">
                  {popularText}
                </Badge>
              )}
            </div>
          </div>

          {/* --- Date row --- */}
          <div className="flex items-center gap-3">
            {/* Departure */}
            <div className="rounded-md bg-muted/60 px-3 py-2 text-center">
              <p className="text-sm font-semibold leading-tight">
                {formatShortDate(container.departure_date)}
              </p>
              <p className="text-[11px] text-muted-foreground">{departsText}</p>
            </div>

            {/* Transit indicator */}
            <div className="flex flex-1 items-center gap-1.5 min-w-0">
              <div className="h-px flex-1 bg-border" />
              {transitDaysText && (
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {transitDaysText}
                </span>
              )}
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* Arrival */}
            <div className="rounded-md bg-muted/60 px-3 py-2 text-center">
              <p className="text-sm font-semibold leading-tight">
                {container.eta_date
                  ? formatShortDate(container.eta_date)
                  : "TBD"}
              </p>
              <p className="text-[11px] text-muted-foreground">{arrivesText}</p>
            </div>
          </div>

          {/* --- Space / Progress --- */}
          <div className="space-y-2">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium text-foreground">
                {spaceAvailableText}
              </span>
              <span className="text-muted-foreground tabular-nums">
                {state.fillPercent}% {bookedText}
              </span>
            </div>

            {/* Custom progress bar to control indicator color */}
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-out",
                  progressIndicatorClass(state.fillColor)
                )}
                style={{ width: `${state.fillPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground tabular-nums">
                {availableCbm} {cbmAvailableText}
              </span>

              {/* Demand indicator */}
              {state.demandLevel === "pending" && (
                <span className="text-muted-foreground">
                  <span className="text-blue-500 mr-1" aria-hidden="true">
                    ●
                  </span>
                  {requestsPendingText}
                </span>
              )}
              {state.demandLevel === "popular" && (
                <span className="text-orange-600 font-medium">
                  {popularText}
                </span>
              )}
            </div>
          </div>

          {/* --- CTA --- */}
          {state.isFull ? (
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              render={
                <a
                  href={CONTACT.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <MessageCircle className="size-4 mr-1.5" />
              {contactUsText}
            </Button>
          ) : (
            <Button
              size="lg"
              className="w-full"
              onClick={() => onRequestSpace(container)}
            >
              {requestSpaceText}
              <ArrowRight className="size-4 ml-1.5" />
            </Button>
          )}
        </CardContent>
      </Card>
    </StaggerItem>
  );
}
