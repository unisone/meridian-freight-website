"use client";

import { useState, useRef, useEffect } from "react";
import { ArrowLeft, ArrowRight, Loader2, Package, Globe, Mail, CheckCircle, Info, Ship, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { trackGA4Event, trackPixelEvent } from "@/lib/tracking";
import { submitCalculator, type CalculatorResult } from "@/app/actions/calculator";
import { getCalculatorData } from "@/app/actions/calculator-data";
import { calculateFreightV2, formatDollar } from "@/lib/freight-engine-v2";
import type { CalculatorData, EquipmentPackingRate, FreightEstimateV2 } from "@/lib/types/calculator";
import { CATEGORY_LABELS, UNIT_LABELS, COUNTRY_NAMES } from "@/lib/types/calculator";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CalculatorWizard() {
  // Data
  const [data, setData] = useState<CalculatorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState(false);

  // Wizard state
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState<EquipmentPackingRate | null>(null);
  const [equipmentSize, setEquipmentSize] = useState<number | null>(null);
  const [destinationCountry, setDestinationCountry] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const submittingRef = useRef(false);

  // Client-side preview estimate
  const [preview, setPreview] = useState<FreightEstimateV2 | null>(null);

  // Fetch rate data on mount
  useEffect(() => {
    getCalculatorData().then((d) => {
      if (d) {
        setData(d);
      } else {
        setDataError(true);
      }
      setLoading(false);
    });
  }, []);

  // Recalculate preview when inputs change
  useEffect(() => {
    if (!selectedEquipment || !destinationCountry || !data) {
      setPreview(null);
      return;
    }
    const est = calculateFreightV2({
      equipment: selectedEquipment,
      equipmentSize,
      destinationCountry,
      zipCode: zipCode || null,
      oceanRates: data.oceanRates,
    });
    setPreview(est);
  }, [selectedEquipment, equipmentSize, destinationCountry, zipCode, data]);

  const filteredEquipment = data
    ? category
      ? data.equipment.filter((e) => e.equipment_category === category)
      : data.equipment
    : [];

  const unitLabel = selectedEquipment ? UNIT_LABELS[selectedEquipment.packing_unit] : null;
  const isEmailValid = EMAIL_RE.test(email);
  const needsSize = selectedEquipment !== null && selectedEquipment.packing_unit !== "flat";
  const containerLabel = selectedEquipment?.container_type === "fortyhc" ? "40' High Cube Container" : "Flat Rack";

  async function handleCalculate() {
    if (!isEmailValid || !selectedEquipment || !destinationCountry) return;
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    if (website) {
      setIsSubmitting(false);
      submittingRef.current = false;
      return;
    }

    try {
      const params = new URLSearchParams(window.location.search);

      const res = await submitCalculator({
        email,
        name,
        company,
        equipmentCategory: selectedEquipment.equipment_category,
        equipmentType: selectedEquipment.equipment_type,
        equipmentDisplayName: selectedEquipment.display_name_en,
        equipmentSize: needsSize ? equipmentSize : null,
        containerType: selectedEquipment.container_type,
        destinationCountry,
        zipCode,
        website,
        source_page: window.location.pathname,
        utm_source: params.get("utm_source") || "",
        utm_medium: params.get("utm_medium") || "",
        utm_campaign: params.get("utm_campaign") || "",
        utm_term: params.get("utm_term") || "",
        utm_content: params.get("utm_content") || "",
      });

      if (res.success && res.estimate) {
        setResult(res);
        setStep(4);
        trackGA4Event("generate_lead", {
          event_category: "calculator",
          lead_source: "freight_calculator_v2",
        });
        if (res.eventId) {
          trackPixelEvent("Lead", { content_name: "freight_calculator_v2" }, res.eventId);
        }
      } else {
        setError(res.error || "Something went wrong");
      }
    } catch {
      setError("Failed to calculate. Please try again.");
    } finally {
      setIsSubmitting(false);
      submittingRef.current = false;
    }
  }

  function resetAll() {
    setStep(1);
    setCategory("");
    setSelectedEquipment(null);
    setEquipmentSize(null);
    setDestinationCountry("");
    setZipCode("");
    setEmail("");
    setName("");
    setCompany("");
    setWebsite("");
    setError("");
    setResult(null);
    setPreview(null);
  }

  // Loading state
  if (loading) {
    return (
      <Card className="mx-auto max-w-2xl border-sky-200 shadow-xl">
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="mr-3 h-6 w-6 animate-spin text-sky-500" />
          <span className="text-slate-500">Loading freight rates...</span>
        </CardContent>
      </Card>
    );
  }

  // Data unavailable
  if (dataError || !data) {
    return (
      <Card className="mx-auto max-w-2xl border-sky-200 shadow-xl">
        <CardContent className="p-8 text-center space-y-4">
          <h3 className="text-lg font-bold text-slate-900">Calculator Temporarily Unavailable</h3>
          <p className="text-sm text-slate-600">
            We&apos;re unable to load current freight rates. Please contact us directly for a quote.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button render={<Link href="/contact" />} className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl">
              Contact Us
            </Button>
            <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" />} variant="outline" className="py-5 rounded-xl font-semibold border-emerald-600 text-emerald-600 hover:bg-emerald-50">
              WhatsApp Us
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-2xl overflow-hidden border-sky-200 shadow-xl">
      {/* Progress indicator */}
      <div className="flex border-b border-slate-100" role="group" aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
              s <= step ? "bg-sky-500 text-white" : "bg-slate-50 text-slate-400"
            }`}
          >
            {s === 1 && "Equipment"}
            {s === 2 && "Destination"}
            {s === 3 && "Details"}
            {s === 4 && "Estimate"}
          </div>
        ))}
      </div>

      <CardContent className="p-6 sm:p-8">
        {/* Step 1: Equipment Selection */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sky-500">
              <Package className="h-5 w-5" />
              <h3 className="text-lg font-bold">Select Equipment</h3>
            </div>

            <div>
              <Label>Category</Label>
              <div className="mt-2 flex flex-wrap gap-2" role="listbox" aria-label="Equipment category">
                {data.categories.map((cat) => (
                  <button
                    key={cat}
                    role="option"
                    aria-selected={category === cat}
                    onClick={() => { setCategory(cat); setSelectedEquipment(null); setEquipmentSize(null); }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      category === cat
                        ? "bg-sky-500 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-sky-50"
                    }`}
                  >
                    {CATEGORY_LABELS[cat] ?? cat}
                  </button>
                ))}
              </div>
            </div>

            {category && (
              <div>
                <Label>Equipment Type</Label>
                <div className="mt-2 max-h-48 space-y-1.5 overflow-y-auto rounded-lg border border-slate-200 p-2" role="listbox" aria-label="Equipment type">
                  {filteredEquipment.map((eq) => (
                    <button
                      key={eq.id}
                      role="option"
                      aria-selected={selectedEquipment?.id === eq.id}
                      onClick={() => { setSelectedEquipment(eq); setEquipmentSize(null); }}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        selectedEquipment?.id === eq.id
                          ? "bg-sky-500 text-white"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-medium">{eq.display_name_en}</div>
                      {eq.models && (
                        <div className={`text-xs ${selectedEquipment?.id === eq.id ? "text-sky-200" : "text-slate-500"}`}>
                          {eq.models}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size input for variable pricing */}
            {needsSize && (
              <div>
                <Label htmlFor="equipment-size">
                  {selectedEquipment.packing_unit === "per_row" && "Number of rows"}
                  {selectedEquipment.packing_unit === "per_foot" && "Width in feet"}
                  {selectedEquipment.packing_unit === "per_shank" && "Number of shanks"}
                  {selectedEquipment.packing_unit === "per_bottom" && "Number of bottoms"}
                </Label>
                <Input
                  id="equipment-size"
                  type="number"
                  min={1}
                  value={equipmentSize ?? ""}
                  onChange={(e) => setEquipmentSize(e.target.value ? parseInt(e.target.value, 10) : null)}
                  placeholder="Enter size"
                  className="mt-1.5 max-w-32"
                />
              </div>
            )}

            {/* Packing cost preview */}
            {selectedEquipment && (
              <div className="rounded-lg bg-sky-50 p-4">
                {selectedEquipment.container_type === "fortyhc" ? (
                  <>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-slate-600">Estimated packing cost:</div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-4 w-4 text-slate-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Cost to pack and load your equipment into a 40&apos; high cube container at our Albion, IA facility.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="font-mono text-xl font-bold text-sky-600">
                      {needsSize && equipmentSize && equipmentSize > 0
                        ? formatDollar(selectedEquipment.packing_cost * equipmentSize)
                        : needsSize
                          ? `${formatDollar(selectedEquipment.packing_cost)}/${unitLabel ? unitLabel.slice(0, -1) : "unit"}`
                          : formatDollar(selectedEquipment.packing_cost)
                      }
                    </div>
                    {needsSize && equipmentSize && equipmentSize > 0 && (
                      <div className="mt-0.5 text-xs text-slate-500">
                        {formatDollar(selectedEquipment.packing_cost)}/{unitLabel ? unitLabel.slice(0, -1) : "unit"} × {equipmentSize} {unitLabel}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-sm text-slate-600">Shipping method:</div>
                    <div className="mt-1 text-sm text-slate-700">
                      Ships whole on a flat rack. Packing & loading included in sea freight.
                    </div>
                  </>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {selectedEquipment.container_type === "fortyhc" ? (
                      <><Ship className="mr-1 h-3 w-3" /> 40&apos; High Cube</>
                    ) : (
                      <><Truck className="mr-1 h-3 w-3" /> Flat Rack</>
                    )}
                  </Badge>
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep(2)}
              disabled={!selectedEquipment || (needsSize && (!equipmentSize || equipmentSize < 1))}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl"
            >
              Next: Select Destination <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Destination */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sky-500">
              <Globe className="h-5 w-5" />
              <h3 className="text-lg font-bold">Select Destination</h3>
            </div>

            <div>
              <Label htmlFor="dest-country">Destination Country *</Label>
              <select
                id="dest-country"
                value={destinationCountry}
                onChange={(e) => setDestinationCountry(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="">Select a country...</option>
                {data.countries.map((code) => (
                  <option key={code} value={code}>
                    {COUNTRY_NAMES[code] ?? code}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <Label htmlFor="zip-code">US Pickup ZIP Code</Label>
                <span className="text-xs text-slate-400">(optional)</span>
              </div>
              <Input
                id="zip-code"
                type="text"
                inputMode="numeric"
                maxLength={5}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                placeholder="e.g. 50005"
                className="mt-1.5 max-w-32"
              />
              <p className="mt-1 text-xs text-slate-500">
                Enter ZIP to include US inland transport in your estimate.
              </p>
            </div>

            {/* Route preview */}
            {destinationCountry && selectedEquipment && (
              <div className="rounded-lg bg-slate-50 p-4 text-sm">
                <div className="font-semibold text-slate-900">Shipping route:</div>
                <div className="mt-1 text-slate-600">
                  {selectedEquipment.container_type === "fortyhc" ? (
                    <>
                      {zipCode ? `ZIP ${zipCode}` : "Pickup location"} → Albion, IA (packing) → Chicago, IL (rail) → {COUNTRY_NAMES[destinationCountry] ?? destinationCountry}
                    </>
                  ) : (
                    <>
                      {zipCode ? `ZIP ${zipCode}` : "Pickup location"} → Nearest US port → {COUNTRY_NAMES[destinationCountry] ?? destinationCountry}
                    </>
                  )}
                </div>
                {preview && (
                  <div className="mt-2 font-mono text-lg font-bold text-sky-600">
                    Est. {formatDollar(preview.estimatedTotal)}
                    {preview.totalExcludesInland && <span className="ml-1 text-xs font-normal text-slate-400">(excl. inland)</span>}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="flex-1 py-5 rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!destinationCountry || !preview}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Email Gate */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sky-500">
              <Mail className="h-5 w-5" />
              <h3 className="text-lg font-bold">Get Your Estimate</h3>
            </div>

            <p className="text-sm text-slate-600">
              Enter your email to receive the freight cost estimate. We&apos;ll also send a copy to your inbox.
            </p>

            <div>
              <Label htmlFor="calc-email">Email *</Label>
              <Input
                id="calc-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="mt-1.5"
              />
              {email && !isEmailValid && (
                <p className="mt-1 text-xs text-red-500">Please enter a valid email address</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="calc-name">Name</Label>
                <Input id="calc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional" className="mt-1.5" />
              </div>
              <div>
                <Label htmlFor="calc-company">Company</Label>
                <Input id="calc-company" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" className="mt-1.5" />
              </div>
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" style={{ opacity: 0, position: "absolute", pointerEvents: "none", height: 0, overflow: "hidden" }}>
              <Label htmlFor="calc-website">Website</Label>
              <Input id="calc-website" type="text" value={website} onChange={(e) => setWebsite(e.target.value)} tabIndex={-1} autoComplete="off" />
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-slate-50 p-4 text-sm space-y-1">
              <div className="font-semibold text-slate-900">Your selection:</div>
              <div className="text-slate-600">{selectedEquipment?.display_name_en}</div>
              <div className="text-slate-600">
                → {COUNTRY_NAMES[destinationCountry] ?? destinationCountry}
                {zipCode && <span> (ZIP: {zipCode})</span>}
              </div>
              <div className="text-slate-500 text-xs">{containerLabel}</div>
              {preview && (
                <div className="font-mono font-bold text-sky-600">Preview: {formatDollar(preview.estimatedTotal)}</div>
              )}
            </div>

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)} className="flex-1 py-5 rounded-xl">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleCalculate}
                disabled={!isEmailValid || isSubmitting}
                className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl"
              >
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Calculating...</>
                ) : (
                  <>Calculate Estimate</>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Results */}
        {step === 4 && result?.estimate && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              <h3 className="text-lg font-bold">Your Freight Estimate</h3>
            </div>

            <div className="space-y-4 rounded-xl border border-sky-200 bg-sky-50 p-6">
              {/* Line items */}
              {result.estimate.usInlandTransport !== null && (
                <div className="flex justify-between">
                  <span className="text-slate-700">
                    US Inland Transport
                    {result.estimate.distanceMiles !== null && (
                      <span className="ml-1 text-xs text-slate-400">({result.estimate.distanceMiles} mi × ${result.estimate.deliveryRatePerMile}/mi{result.estimate.containerType === "fortyhc" ? " + $1,800 drayage" : ""})</span>
                    )}
                  </span>
                  <span className="font-mono font-bold text-slate-900">{formatDollar(result.estimate.usInlandTransport)}</span>
                </div>
              )}
              {result.estimate.usInlandTransport === null && (
                <div className="flex justify-between">
                  <span className="text-slate-400">US Inland Transport</span>
                  <span className="text-xs text-slate-400 italic">Enter ZIP for estimate</span>
                </div>
              )}

              {/* 40HC: separate packing + ocean lines */}
              {result.estimate.containerType === "fortyhc" && (
                <>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-slate-700">Packing & Loading</span>
                      {result.estimate.packingBreakdown && (
                        <div className="text-xs text-slate-400">{result.estimate.packingBreakdown}</div>
                      )}
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatDollar(result.estimate.packingAndLoading)}</span>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-slate-700">Ocean Freight</span>
                      <div className="text-xs text-slate-400">
                        {result.estimate.carrier} • {result.estimate.originPort} → {result.estimate.destinationPort}
                        {result.estimate.transitTimeDays && ` • ${result.estimate.transitTimeDays} days`}
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{formatDollar(result.estimate.oceanFreight)}</span>
                  </div>
                </>
              )}

              {/* Flatrack: combined "Sea Freight & Loading" (packing included in packing_drayage) */}
              {result.estimate.containerType === "flatrack" && (
                <div className="flex justify-between">
                  <div>
                    <span className="text-slate-700">Sea Freight & Loading</span>
                    <div className="text-xs text-slate-400">
                      {result.estimate.carrier} • {result.estimate.originPort} → {result.estimate.destinationPort}
                      {result.estimate.transitTimeDays && ` • ${result.estimate.transitTimeDays} days`}
                    </div>
                    <div className="text-xs text-slate-400">Includes port-side packing & drayage</div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{formatDollar(result.estimate.oceanFreight)}</span>
                </div>
              )}

              <div className="border-t border-sky-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Estimated Total</span>
                <span className="font-mono text-2xl font-bold text-sky-600">
                  {formatDollar(result.estimate.estimatedTotal)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {result.estimate.containerType === "fortyhc" ? (
                    <><Ship className="mr-1 h-3 w-3" /> 40&apos; High Cube</>
                  ) : (
                    <><Truck className="mr-1 h-3 w-3" /> Flat Rack</>
                  )}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {result.estimate.carrier}
                </Badge>
                {result.estimate.totalExcludesInland && (
                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                    Excludes US inland
                  </Badge>
                )}
              </div>
            </div>

            {result.estimate.notes.length > 0 && (
              <div className="space-y-1">
                {result.estimate.notes.map((note, i) => (
                  <p key={i} className="text-xs text-amber-600 flex items-start gap-1.5">
                    <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {note}
                  </p>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-500">
              This estimate covers packing, loading, and ocean freight. Customs duties, import taxes,
              insurance, and destination inland transport are not included. Contact us for a detailed quote.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="/contact" />} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl">
                Get Detailed Quote
              </Button>
              <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp for a detailed quote" />} variant="outline" className="flex-1 py-5 rounded-xl font-semibold border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                WhatsApp Us
              </Button>
            </div>

            <Button variant="ghost" onClick={resetAll} className="w-full">
              Calculate Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
