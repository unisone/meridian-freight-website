"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowRight, CheckCircle, Info, Loader2, Lock, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDollar } from "@/lib/freight-engine-v2";
import type { FreightEstimateV2, EquipmentPackingRate } from "@/lib/types/calculator";
import type { CalculatorResult } from "@/app/actions/calculator";

import { CONTACT } from "@/lib/constants";
import { trackContactClick } from "@/lib/tracking";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

interface EstimateCardProps {
  preview: FreightEstimateV2 | null;
  result: CalculatorResult | null;
  selectedEquipment: EquipmentPackingRate | null;
  destinationCountry: string;
  isComplete: boolean;
  // Email gate state (lifted to parent)
  email: string;
  onEmailChange: (val: string) => void;
  name: string;
  onNameChange: (val: string) => void;
  company: string;
  onCompanyChange: (val: string) => void;
  website: string;
  onWebsiteChange: (val: string) => void;
  isSubmitting: boolean;
  error: string;
  onSubmit: () => void;
  onReset: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CalculatorEstimateCard({
  preview,
  result,
  selectedEquipment,
  destinationCountry,
  isComplete,
  email,
  onEmailChange,
  name,
  onNameChange,
  company,
  onCompanyChange,
  website,
  onWebsiteChange,
  isSubmitting,
  error,
  onSubmit,
  onReset,
}: EstimateCardProps) {
  const t = useTranslations("CalculatorEstimate");
  const tc = useTranslations("Common");
  const [emailGateOpen, setEmailGateOpen] = useState(false);
  const isEmailValid = EMAIL_RE.test(email);
  const hasResult = result?.success && result?.estimate;
  const estimate = result?.estimate;

  // ─── Price morph animation ───────────────────────────────────────────
  const [displayTotal, setDisplayTotal] = useState(0);
  const prevTotal = useRef(0);

  useEffect(() => {
    if (!preview) {
      prevTotal.current = 0;
      const id = requestAnimationFrame(() => setDisplayTotal(0));
      return () => cancelAnimationFrame(id);
    }
    const target = preview.estimatedTotal;
    if (target === prevTotal.current) return;
    const from = prevTotal.current;
    prevTotal.current = target;
    const duration = 300;
    const startTime = performance.now();
    let rafId: number;

    function tick(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayTotal(Math.round(from + (target - from) * eased));
      if (t < 1) rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [preview]);

  // ---------------------------------------------------------------------------
  // State: Results (after email submission)
  // ---------------------------------------------------------------------------
  if (hasResult && estimate) {
    return (
      <div className="rounded-2xl bg-slate-900 p-6 text-white" aria-live="polite">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            {t("estimateSentTo", { email })}
          </span>
        </div>

        {/* Line items */}
        <div className="space-y-3">
          {estimate.usInlandTransport !== null && (
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-300">{t("usInlandTransport")}</div>
                {estimate.distanceMiles !== null && (
                  <div className="text-xs text-slate-400">
                    {estimate.distanceMiles} mi × ${estimate.deliveryRatePerMile}/mi
                    {estimate.containerType === "fortyhc" ? " + $1,800 drayage" : ""}
                  </div>
                )}
              </div>
              <span className="font-mono font-bold text-white">
                {formatDollar(estimate.usInlandTransport)}
              </span>
            </div>
          )}
          {estimate.usInlandTransport === null && (
            <div className="flex items-start justify-between">
              <span className="text-sm text-slate-400">{t("usInlandTransport")}</span>
              <span className="text-xs italic text-slate-400">{t("enterZipForEstimate")}</span>
            </div>
          )}

          {estimate.packingAndLoading > 0 && (
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-300">{t("packingAndLoading")}</div>
                {estimate.packingBreakdown && (
                  <div className="text-xs text-slate-400">{estimate.packingBreakdown}</div>
                )}
              </div>
              <span className="font-mono font-bold text-white">
                {formatDollar(estimate.packingAndLoading)}
              </span>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-300">
                {estimate.containerType === "flatrack" ? t("seaFreightAndLoading") : t("oceanFreight")}
              </div>
              <div className="text-xs text-slate-400">
                {estimate.carrier} &bull; {estimate.originPort} → {estimate.destinationPort}
                {estimate.transitTimeDays && ` • ${estimate.transitTimeDays} days`}
              </div>
            </div>
            <span className="font-mono font-bold text-white">
              {formatDollar(estimate.oceanFreight)}
            </span>
          </div>

          <div className="mt-3 rounded-lg bg-white/5 p-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-white">{t("estimatedTotal")}</span>
              <span className="font-mono text-3xl font-bold text-white">
                {formatDollar(estimate.estimatedTotal)}
              </span>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className="border-slate-600 bg-slate-800 text-xs text-slate-300">
            {estimate.containerType === "fortyhc" ? (
              <><Ship className="mr-1 h-3 w-3" /> 40&apos; High Cube</>
            ) : (
              <><Truck className="mr-1 h-3 w-3" /> Flat Rack</>
            )}
          </Badge>
          <Badge className="border-slate-600 bg-slate-800 text-xs text-slate-300">
            {estimate.carrier}
          </Badge>
          {estimate.totalExcludesInland && (
            <Badge className="border-amber-600/30 bg-amber-900/30 text-xs text-amber-500">
              {t("excludesUSInland")}
            </Badge>
          )}
        </div>

        {/* Notes */}
        {estimate.notes.length > 0 && (
          <div className="mt-4 space-y-1">
            {estimate.notes.map((note, i) => (
              <p key={i} className="flex items-start gap-1.5 text-xs text-amber-500">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {note}
              </p>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-slate-400">
          {t("coversNote")}
        </p>

        {/* CTAs */}
        <div className="mt-5 space-y-2">
          <Button
            render={<Link href="/contact" />}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("getDetailedQuote")} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Button>
          <Button
            render={
              <a
                href={`${CONTACT.whatsappUrl}?text=${encodeURIComponent(
                  `Hi! Your calculator estimated $${estimate ? Math.round(estimate.estimatedTotal).toLocaleString("en-US") : "N/A"} for ${selectedEquipment?.display_name_en ?? "equipment"} to ${destinationCountry}. Can I get an exact quote?`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("whatsAppChatAriaLabel")}
                onClick={() => trackContactClick("whatsapp", "calculator_estimate")}
              />
            }
            variant="outline"
            className="w-full border-emerald-600/50 py-5 font-semibold text-emerald-500 hover:bg-emerald-600/10"
          >
            {tc("whatsAppUs")}
          </Button>
          <Button
            variant="ghost"
            onClick={onReset}
            className="w-full text-slate-300 hover:text-white"
          >
            {t("calculateAnother")}
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // State: Empty (nothing selected yet)
  // ---------------------------------------------------------------------------
  if (!selectedEquipment) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-muted p-6 text-center">
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Ship className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            {t("emptyStateText")}
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // State: Preview (equipment selected, possibly with destination)
  // ---------------------------------------------------------------------------
  const containerLabel =
    selectedEquipment.container_type === "fortyhc"
      ? t("fortyHCShort")
      : t("flatRack");

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white" aria-live="polite">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t("estimatedFreight")}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Ship className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mb-4 text-xs text-slate-400">{t("basedOnRates")}</p>

      {/* Price */}
      {preview ? (
        <>
          <div className="mb-1 font-mono tabular-nums text-4xl font-bold tracking-tight text-white">
            {formatDollar(displayTotal)}
          </div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
            {preview.totalExcludesInland ? t("exclInlandTransport") : t("optimizedRouteRate")}
          </p>
        </>
      ) : (
        <>
          <div className="mb-1 font-mono text-4xl font-bold tracking-tight text-slate-600">
            $—,———
          </div>
          <p className="mb-5 text-xs text-slate-600">{t("selectDestination")}</p>
        </>
      )}

      {/* Detail rows */}
      <div className="space-y-3 mt-4 pt-4 bg-white/5 -mx-6 px-6 rounded-lg">
        <DetailRow label={t("transitTime")} value={preview?.transitTimeDays ? `${preview.transitTimeDays} ${tc("days")}` : "—"} mono />
        <DetailRow label={t("container")} value={containerLabel} mono />
        <DetailRow label={t("carrier")} value={preview?.carrier ?? "—"} highlight mono />
        <DetailRow
          label={t("loadingType")}
          value={selectedEquipment.container_type === "fortyhc" ? t("containerLoading") : t("roroLoading")}
        />
        {destinationCountry && (
          <DetailRow
            label={t("route")}
            value={preview ? `${preview.originPort} → ${preview.destinationPort}` : "—"}
          />
        )}
      </div>

      {/* Email gate section */}
      {emailGateOpen && !hasResult ? (
        <div className="mt-5 space-y-3 bg-white/5 -mx-6 px-6 py-5 rounded-lg">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t("getYourDetailedEstimate")}
          </p>

          <div>
            <Label htmlFor="est-email" className="text-xs text-slate-300">
              {t("emailLabel")}
            </Label>
            <Input
              id="est-email"
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              aria-invalid={email ? !isEmailValid : undefined}
              aria-describedby={email && !isEmailValid ? "est-email-error" : undefined}
              className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-primary"
            />
            {email && !isEmailValid && (
              <p id="est-email-error" className="mt-1 text-xs text-red-500">{t("validEmailError")}</p>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="est-name" className="text-xs text-slate-300">
                {t("nameLabel")}
              </Label>
              <Input
                id="est-name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder={t("optionalPlaceholder")}
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <Label htmlFor="est-company" className="text-xs text-slate-300">
                {t("companyLabel")}
              </Label>
              <Input
                id="est-company"
                name="company"
                autoComplete="organization"
                value={company}
                onChange={(e) => onCompanyChange(e.target.value)}
                placeholder={t("optionalPlaceholder")}
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Honeypot */}
          <div
            aria-hidden="true"
            style={{ opacity: 0, position: "absolute", pointerEvents: "none", height: 0, overflow: "hidden" }}
          >
            <Label htmlFor="est-website">Website</Label>
            <Input
              id="est-website"
              type="text"
              value={website}
              onChange={(e) => onWebsiteChange(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {error && <p className="text-center text-xs text-red-500">{error}</p>}

          <Button
            onClick={onSubmit}
            disabled={!isEmailValid || isSubmitting}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t("calculating")}
              </>
            ) : (
              <>
                {t("calculateAndSend")} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Lock className="h-3 w-3" /> {t("emailBreakdownNote")}
          </p>
        </div>
      ) : !hasResult ? (
        /* CTAs before email gate */
        <div className="mt-5 space-y-2">
          <Button
            onClick={() => setEmailGateOpen(true)}
            disabled={!isComplete}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t("bookThisFreight")} <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
          </Button>
          <Button
            variant="ghost"
            className="w-full text-slate-300 hover:text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t("refineQuote")}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper: detail row inside the dark card
// ---------------------------------------------------------------------------
function DetailRow({
  label,
  value,
  highlight,
  mono,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={`${highlight ? "font-semibold text-primary" : "font-medium text-white"}${mono ? " font-mono" : ""}`}>
        {value}
      </span>
    </div>
  );
}
