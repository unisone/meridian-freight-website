"use client";

import { useState } from "react";
import {
  ArrowRight,
  CheckCircle,
  Info,
  Loader2,
  Lock,
  MessageCircle,
  Ship,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "@/i18n/navigation";
import { CONTACT } from "@/lib/constants";
import { formatDollar } from "@/lib/calculator-v3/format";
import { getLocalizedText } from "@/lib/calculator-v3/policy";
import { trackContactClick } from "@/lib/tracking";

import {
  COPY,
  EMAIL_RE,
  countryLabel,
  formatTransit,
  importAmountLabel,
  lineItemLabel,
  shortContainerLabel,
} from "./copy";
import { DetailRow, ImportCostNote } from "./estimate-card-helpers";
import type { EstimateCardProps } from "./types";

export function EstimateCard({
  locale,
  preview,
  result,
  profile,
  mode,
  destinationCountry,
  selectedRoute,
  isComplete,
  email,
  onEmailChange,
  name,
  onNameChange,
  company,
  onCompanyChange,
  phone,
  onPhoneChange,
  preferredContact,
  onPreferredContactChange,
  website,
  onWebsiteChange,
  isSubmitting,
  error,
  onSubmit,
  onReset,
}: EstimateCardProps) {
  const t = COPY[locale];
  const [emailGateOpen, setEmailGateOpen] = useState(false);
  const isEmailValid = EMAIL_RE.test(email);
  const hasResult = result?.success && result.estimate;
  const estimate = result?.estimate ?? preview;

  if (!profile) {
    return (
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl bg-muted p-6 text-center">
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Ship className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{t.emptyStateText}</p>
        </div>
      </div>
    );
  }

  const estimateMode = estimate?.mode ?? mode;
  const estimateRoute = estimate?.route ?? selectedRoute;
  const whatsappText = encodeURIComponent(
    `Hi! Your calculator estimated ${
      estimate ? formatDollar(estimate.freightTotal) : "N/A"
    } for ${profile ? getLocalizedText(profile.label, locale) : "equipment"} to ${
      destinationCountry ? countryLabel(destinationCountry) : "destination"
    }. Can I get a confirmed quote?`,
  );

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white" aria-live="polite">
      {hasResult && (
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-500">
            {t.estimateSentTo.replace("{email}", email)}
          </span>
        </div>
      )}

      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary">
          {t.estimatedFreight}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Ship className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mb-4 text-xs text-slate-400">{t.basedOnRates}</p>

      {estimate ? (
        <>
          <div className="mb-1 font-mono tabular-nums text-4xl font-bold tracking-tight text-white">
            {formatDollar(estimate.freightTotal)}
          </div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
            {estimate.totalExcludesInland
              ? t.exclInlandTransport
              : t.optimizedRouteRate}
          </p>
        </>
      ) : (
        <>
          <div className="mb-1 font-mono text-4xl font-bold tracking-tight text-slate-600">
            $—,———
          </div>
          <p className="mb-5 text-xs text-slate-600">
            {destinationCountry ? t.routeUnavailableEstimate : t.selectDestination}
          </p>
        </>
      )}

      <div className="-mx-6 mt-4 space-y-3 rounded-lg bg-white/5 px-6 pt-4 pb-4">
        <DetailRow
          label={t.transit}
          value={estimateRoute ? formatTransit(estimateRoute, locale) : "—"}
          mono
        />
        <DetailRow
          label={t.container}
          value={estimateMode ? shortContainerLabel(estimateMode.containerType) : "—"}
          mono
        />
        <DetailRow
          label={t.carrier}
          value={estimateRoute?.carrier ?? "—"}
          highlight
          mono
        />
        {estimateRoute && (
          <DetailRow
            label={t.route}
            value={`${estimateRoute.origin.label} → ${estimateRoute.destination.label}`}
          />
        )}
      </div>

      {estimate && (
        <div className="mt-5 space-y-5">
          <div>
            <h3 className="mb-2 text-sm font-semibold">{t.lineItems}</h3>
            <div className="space-y-3">
              {estimate.lineItems
                .filter((line) => line.amountUsd !== 0 || line.id !== "packing_loading")
                .map((line) => (
                  <div key={line.id} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-slate-300">
                        {lineItemLabel(line, locale)}
                      </div>
                      {line.note && (
                        <div className="text-xs text-slate-400">{line.note}</div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-white">
                      {line.amountUsd == null
                        ? line.includedInTotal
                          ? t.quoteConfirmed
                          : t.notAvailable
                        : formatDollar(line.amountUsd)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          <div className="rounded-lg bg-white/5 p-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-white">{t.freightTotal}</span>
              <span className="font-mono text-3xl font-bold text-white">
                {formatDollar(estimate.freightTotal)}
              </span>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-700 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium text-slate-200">
                  {t.compliancePrep}
                </div>
                {estimate.compliancePrep.note && (
                  <div className="mt-1 text-xs text-slate-400">
                    {getLocalizedText(estimate.compliancePrep.note, locale)}
                  </div>
                )}
              </div>
              <span className="text-right font-mono text-sm font-bold text-white">
                {estimate.compliancePrep.amountStatus === "priced" &&
                estimate.compliancePrep.amountUsd != null
                  ? formatDollar(estimate.compliancePrep.amountUsd)
                  : estimate.compliancePrep.amountStatus === "not_applicable"
                    ? t.noAutomaticCharge
                    : t.brokerConfirmed}
              </span>
            </div>

            {estimate.dedicatedContainerFreightTotal != null && (
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm text-slate-300">
                  {t.dedicatedComparison}
                </div>
                <span className="font-mono text-sm font-bold text-white">
                  {formatDollar(estimate.dedicatedContainerFreightTotal)}
                </span>
              </div>
            )}

            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-medium text-slate-200">
                    {t.importEstimate}
                  </div>
                  <div className="mt-1 text-xs text-slate-400">
                    {t.importNotIncluded}
                    {estimate.importCost.hsCode
                      ? ` · HS ${estimate.importCost.hsCode}`
                      : ""}
                  </div>
                </div>
                <span className="text-right font-mono text-sm font-bold text-white">
                  {importAmountLabel(estimate.importCost, locale)}
                </span>
              </div>
              <ImportCostNote importCost={estimate.importCost} locale={locale} />
            </div>
          </div>

          {(estimate.warnings.length > 0 || estimate.notes.length > 0) && (
            <div className="space-y-2">
              {estimate.warnings.slice(0, 2).map((warning, index) => (
                <p
                  key={`${warning.en}-${index}`}
                  className="flex items-start gap-1.5 text-xs text-amber-500"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {getLocalizedText(warning, locale)}
                </p>
              ))}
              {estimate.notes.slice(0, 2).map((note, index) => (
                <p
                  key={`${note.en}-${index}`}
                  className="flex items-start gap-1.5 text-xs text-slate-400"
                >
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {getLocalizedText(note, locale)}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {emailGateOpen && !hasResult ? (
        <div className="-mx-6 mt-5 space-y-3 rounded-lg bg-white/5 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            {t.getYourDetailedEstimate}
          </p>

          <div>
            <Label htmlFor="v3-est-email" className="text-xs text-slate-300">
              {t.emailLabel}
            </Label>
            <Input
              id="v3-est-email"
              aria-label={t.emailLabel}
              name="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder={t.emailPlaceholder}
              required
              aria-invalid={email ? !isEmailValid : undefined}
              aria-describedby={
                email && !isEmailValid ? "v3-est-email-error" : undefined
              }
              className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 focus:border-primary"
            />
            {email && !isEmailValid && (
              <p id="v3-est-email-error" className="mt-1 text-xs text-red-500">
                {t.validEmailError}
              </p>
            )}
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div>
              <Label htmlFor="v3-est-name" className="text-xs text-slate-300">
                {t.nameLabel}
              </Label>
              <Input
                id="v3-est-name"
                aria-label={t.nameLabel}
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder={t.optionalPlaceholder}
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
            <div>
              <Label htmlFor="v3-est-company" className="text-xs text-slate-300">
                {t.companyLabel}
              </Label>
              <Input
                id="v3-est-company"
                aria-label={t.companyLabel}
                name="company"
                autoComplete="organization"
                value={company}
                onChange={(event) => onCompanyChange(event.target.value)}
                placeholder={t.optionalPlaceholder}
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="v3-est-phone" className="text-xs text-slate-300">
              {t.phoneLabel}
            </Label>
            <Input
              id="v3-est-phone"
              aria-label={t.phoneLabel}
              name="phone"
              autoComplete="tel"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              placeholder={t.optionalPlaceholder}
              className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
            />
          </div>

          <div>
            <Label className="text-xs text-slate-300">{t.preferredContact}</Label>
            <div
              className="mt-1 grid grid-cols-2 overflow-hidden rounded-lg border border-slate-700"
              role="group"
              aria-label={t.preferredContact}
            >
              {(["email", "whatsapp"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => onPreferredContactChange(option)}
                  className={`h-10 text-sm font-medium transition-colors ${
                    preferredContact === option
                      ? "bg-primary text-primary-foreground"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {option === "email" ? t.emailOption : t.whatsappOption}
                </button>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            style={{
              opacity: 0,
              position: "absolute",
              pointerEvents: "none",
              height: 0,
              overflow: "hidden",
            }}
          >
            <Label htmlFor="v3-est-website">Website</Label>
            <Input
              id="v3-est-website"
              aria-label="Website"
              type="text"
              value={website}
              onChange={(event) => onWebsiteChange(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {error && <p className="text-center text-xs text-red-500">{error}</p>}

          <Button
            type="button"
            onClick={onSubmit}
            disabled={!isEmailValid || isSubmitting}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.calculating}
              </>
            ) : (
              <>
                {t.calculateAndSend}
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Lock className="h-3 w-3" />
            {t.emailBreakdownNote}
          </p>
        </div>
      ) : !hasResult ? (
        <div className="mt-5 space-y-2">
          <Button
            type="button"
            onClick={() => setEmailGateOpen(true)}
            disabled={!isComplete}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.bookThisFreight}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full text-slate-300 hover:text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            {t.refineQuote}
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-2">
          <Button
            render={<Link href="/contact" />}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.getDetailedQuote}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            render={
              <a
                href={`${CONTACT.whatsappUrl}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactClick("whatsapp", "calculator_v3_estimate")}
              />
            }
            variant="outline"
            className="w-full border-emerald-600/50 py-5 font-semibold text-emerald-500 hover:bg-emerald-600/10"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            {t.whatsAppUs}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onReset}
            className="w-full text-slate-300 hover:text-white"
          >
            {t.calculateAnother}
          </Button>
        </div>
      )}
    </div>
  );
}

