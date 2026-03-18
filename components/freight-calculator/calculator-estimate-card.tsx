"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle, Info, Loader2, Lock, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatDollar } from "@/lib/freight-engine-v2";
import type { FreightEstimateV2, EquipmentPackingRate } from "@/lib/types/calculator";
import type { CalculatorResult } from "@/app/actions/calculator";

import { CONTACT } from "@/lib/constants";
import Link from "next/link";

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
  const [emailGateOpen, setEmailGateOpen] = useState(false);
  const isEmailValid = EMAIL_RE.test(email);
  const hasResult = result?.success && result?.estimate;
  const estimate = result?.estimate;

  // ---------------------------------------------------------------------------
  // State: Results (after email submission)
  // ---------------------------------------------------------------------------
  if (hasResult && estimate) {
    return (
      <div className="rounded-2xl bg-slate-900 p-6 text-white" aria-live="polite">
        <div className="mb-4 flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-400">
            Estimate sent to {email}
          </span>
        </div>

        {/* Line items */}
        <div className="space-y-3">
          {estimate.usInlandTransport !== null && (
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-slate-300">US Inland Transport</div>
                {estimate.distanceMiles !== null && (
                  <div className="text-xs text-slate-500">
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
              <span className="text-sm text-slate-500">US Inland Transport</span>
              <span className="text-xs italic text-slate-500">Enter ZIP for estimate</span>
            </div>
          )}

          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-300">Packing & Loading</div>
              {estimate.packingBreakdown && (
                <div className="text-xs text-slate-500">{estimate.packingBreakdown}</div>
              )}
            </div>
            <span className="font-mono font-bold text-white">
              {formatDollar(estimate.packingAndLoading)}
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-slate-300">Ocean Freight</div>
              <div className="text-xs text-slate-500">
                {estimate.carrier} &bull; {estimate.originPort} → {estimate.destinationPort}
                {estimate.transitTimeDays && ` • ${estimate.transitTimeDays} days`}
              </div>
            </div>
            <span className="font-mono font-bold text-white">
              {formatDollar(estimate.oceanFreight)}
            </span>
          </div>

          <div className="border-t border-slate-700 pt-3">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold text-white">Estimated Total</span>
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
            <Badge className="border-amber-600/30 bg-amber-900/30 text-xs text-amber-400">
              Excludes US inland
            </Badge>
          )}
        </div>

        {/* Notes */}
        {estimate.notes.length > 0 && (
          <div className="mt-4 space-y-1">
            {estimate.notes.map((note, i) => (
              <p key={i} className="flex items-start gap-1.5 text-xs text-amber-400/80">
                <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" /> {note}
              </p>
            ))}
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500">
          Covers packing, loading, and ocean freight. Customs duties, import taxes,
          insurance, and destination transport not included.
        </p>

        {/* CTAs */}
        <div className="mt-5 space-y-2">
          <Button
            render={<Link href="/contact" />}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Get Detailed Quote <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            render={
              <a
                href={CONTACT.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp for a detailed quote"
              />
            }
            variant="outline"
            className="w-full border-emerald-500/50 py-5 font-semibold text-emerald-400 hover:bg-emerald-500/10"
          >
            WhatsApp Us
          </Button>
          <Button
            variant="ghost"
            onClick={onReset}
            className="w-full text-slate-400 hover:text-white"
          >
            Calculate Another
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
      <div className="flex min-h-[280px] items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center">
        <div>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <Ship className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">
            Select your equipment and destination to see a live freight estimate
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
      ? "40' High Cube"
      : "Flat Rack";

  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white" aria-live="polite">
      {/* Header */}
      <div className="mb-1 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-primary">
          Estimated Freight
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20">
          <Ship className="h-4 w-4 text-primary" />
        </div>
      </div>
      <p className="mb-4 text-xs text-slate-500">Based on industrial rates</p>

      {/* Price */}
      {preview ? (
        <>
          <div className="mb-1 font-mono text-4xl font-bold tracking-tight text-white">
            {formatDollar(preview.estimatedTotal)}
          </div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-wider text-primary">
            {preview.totalExcludesInland ? "Excl. inland transport" : "Optimized route rate"}
          </p>
        </>
      ) : (
        <>
          <div className="mb-1 font-mono text-4xl font-bold tracking-tight text-slate-600">
            $—,———
          </div>
          <p className="mb-5 text-xs text-slate-600">Select destination for estimate</p>
        </>
      )}

      {/* Detail rows */}
      <div className="space-y-3 border-t border-slate-800 pt-4">
        <DetailRow label="Transit Time" value={preview?.transitTimeDays ? `${preview.transitTimeDays} Days` : "—"} />
        <DetailRow label="Container" value={containerLabel} />
        <DetailRow label="Carrier" value={preview?.carrier ?? "—"} highlight />
        <DetailRow
          label="Loading Type"
          value={selectedEquipment.container_type === "fortyhc" ? "Container" : "RoRo (Roll-on/Roll-off)"}
        />
        {destinationCountry && (
          <DetailRow
            label="Route"
            value={preview ? `${preview.originPort} → ${preview.destinationPort}` : "—"}
          />
        )}
      </div>

      {/* Email gate section */}
      {emailGateOpen && !hasResult ? (
        <div className="mt-5 space-y-3 border-t border-slate-800 pt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Get Your Detailed Estimate
          </p>

          <div>
            <Label htmlFor="est-email" className="text-xs text-slate-400">
              Email *
            </Label>
            <Input
              id="est-email"
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="your@email.com"
              required
              className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-600 focus:border-primary"
            />
            {email && !isEmailValid && (
              <p className="mt-1 text-xs text-red-400">Please enter a valid email</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="est-name" className="text-xs text-slate-400">
                Name
              </Label>
              <Input
                id="est-name"
                value={name}
                onChange={(e) => onNameChange(e.target.value)}
                placeholder="Optional"
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-600"
              />
            </div>
            <div>
              <Label htmlFor="est-company" className="text-xs text-slate-400">
                Company
              </Label>
              <Input
                id="est-company"
                value={company}
                onChange={(e) => onCompanyChange(e.target.value)}
                placeholder="Optional"
                className="mt-1 border-slate-700 bg-slate-800 text-white placeholder:text-slate-600"
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

          {error && <p className="text-center text-xs text-red-400">{error}</p>}

          <Button
            onClick={onSubmit}
            disabled={!isEmailValid || isSubmitting}
            className="w-full bg-primary py-5 font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...
              </>
            ) : (
              <>
                Calculate & Send Estimate <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3 w-3" /> We&apos;ll email you a detailed breakdown
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
            Book This Freight <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="w-full text-slate-400 hover:text-white"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Refine Quote Parameters
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
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-400">{label}</span>
      <span className={highlight ? "font-semibold text-primary" : "font-medium text-white"}>
        {value}
      </span>
    </div>
  );
}
