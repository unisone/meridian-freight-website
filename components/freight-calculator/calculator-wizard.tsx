"use client";

import { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Loader2, Package, MapPin, Mail, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";
import { equipmentPricing, deliveryRates, equipmentCategories } from "@/content/pricing";
import { trackGA4Event, trackPixelEvent } from "@/lib/tracking";
import { submitCalculator, type CalculatorResult } from "@/app/actions/calculator";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CalculatorWizard() {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [route, setRoute] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const submittingRef = useRef(false); // double-submit guard

  // "all" category is excluded from the filter buttons — it only exists for the pricing table page
  const filteredEquipment = category
    ? equipmentPricing.filter((e) => e.category === category)
    : equipmentPricing;

  const selectedEquipment = equipmentPricing.find((e) => e.type === equipmentType);

  const isEmailValid = EMAIL_RE.test(email);

  async function handleCalculate() {
    if (!isEmailValid) return;
    // Double-fire guard using ref (synchronous, not batched like useState)
    if (submittingRef.current) return;
    submittingRef.current = true;
    setIsSubmitting(true);
    setError("");

    // Honeypot short-circuit — don't even call the server
    if (website) {
      setIsSubmitting(false);
      submittingRef.current = false;
      setResult({ success: true, estimate: undefined });
      setStep(4);
      return;
    }

    try {
      // Capture UTM attribution from URL params
      const params = new URLSearchParams(window.location.search);

      const res = await submitCalculator({
        email,
        name,
        company,
        equipmentCategory: category,
        equipmentType,
        originRegion: route.includes("→") ? route.split("→")[0].trim() : route.trim(),
        destination: route,
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
        // Fire tracking events
        trackGA4Event("generate_lead", {
          event_category: "calculator",
          lead_source: "freight_calculator",
        });
        if (res.eventId) {
          trackPixelEvent("Lead", { content_name: "freight_calculator" }, res.eventId);
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

  /** Parse a container percentage string like "130%" into a number */
  function parseContainerPercent(s: string): number {
    const match = s.match(/(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  return (
    <Card className="mx-auto max-w-2xl overflow-hidden border-sky-200 shadow-xl">
      {/* Progress indicator — group (not progressbar, since it shows labels not a numeric value) */}
      <div className="flex border-b border-slate-100" role="group" aria-label={`Step ${step} of 4`}>
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
              s <= step
                ? "bg-sky-500 text-white"
                : "bg-slate-50 text-slate-400"
            }`}
          >
            {s === 1 && "Equipment"}
            {s === 2 && "Route"}
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
                {equipmentCategories.filter((c) => c.id !== "all").map((cat) => (
                  <button
                    key={cat.id}
                    role="option"
                    aria-selected={category === cat.id}
                    onClick={() => { setCategory(cat.id); setEquipmentType(""); }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      category === cat.id
                        ? "bg-sky-500 text-white"
                        : "border border-slate-200 text-slate-700 hover:bg-sky-50"
                    }`}
                  >
                    {cat.label}
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
                      key={eq.type}
                      role="option"
                      aria-selected={equipmentType === eq.type}
                      onClick={() => setEquipmentType(eq.type)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        equipmentType === eq.type
                          ? "bg-sky-500 text-white"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="font-medium">{eq.type}</div>
                      <div className={`text-xs ${equipmentType === eq.type ? "text-sky-200" : "text-slate-500"}`}>
                        {eq.model}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedEquipment && (
              <div className="rounded-lg bg-sky-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="text-sm text-slate-600">Estimated packing cost:</div>
                  {parseContainerPercent(selectedEquipment.container) > 100 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-4 w-4 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Over 100% means equipment exceeds a standard container. A flat-rack or open-top container will be used, which may affect pricing.
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
                <div className="font-mono text-xl font-bold text-sky-600">
                  {selectedEquipment.containerized}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Container usage: {selectedEquipment.container}
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep(2)}
              disabled={!equipmentType}
              className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl"
            >
              Next: Select Route <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Route Selection */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-sky-500">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-bold">Select Shipping Route</h3>
            </div>

            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-slate-200 p-2" role="listbox" aria-label="Shipping route">
              {deliveryRates.map((dr) => (
                <button
                  key={dr.route}
                  role="option"
                  aria-selected={route === dr.route}
                  onClick={() => setRoute(dr.route)}
                  className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                    route === dr.route
                      ? "bg-sky-500 text-white"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className="font-medium">{dr.route}</div>
                  <div className={`text-xs ${route === dr.route ? "text-sky-200" : "text-slate-500"}`}>
                    {dr.lines && dr.soc
                      ? "Line\u2019s & SOC available"
                      : dr.lines
                        ? "Line\u2019s only"
                        : "SOC only"}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                className="flex-1 py-5 rounded-xl"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!route}
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
                <Input
                  id="calc-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Optional"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="calc-company">Company</Label>
                <Input
                  id="calc-company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Optional"
                  className="mt-1.5"
                />
              </div>
            </div>

            {/* Honeypot — invisible to humans, filled by bots */}
            <div aria-hidden="true" style={{ opacity: 0, position: "absolute", pointerEvents: "none", height: 0, overflow: "hidden" }}>
              <Label htmlFor="calc-website">Website</Label>
              <Input
                id="calc-website"
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Summary */}
            <div className="rounded-lg bg-slate-50 p-4 text-sm">
              <div className="font-semibold text-slate-900">Your selection:</div>
              <div className="mt-1 text-slate-600">{equipmentType}</div>
              <div className="text-slate-600">{route}</div>
            </div>

            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep(2)}
                className="flex-1 py-5 rounded-xl"
              >
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
              <div className="flex justify-between">
                <span className="text-slate-700">Packing & Loading</span>
                <span className="font-mono font-bold text-slate-900">{result.estimate.packingCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-700">Container Shipping</span>
                <span className="font-mono font-bold text-slate-900">{result.estimate.shippingCost}</span>
              </div>
              <div className="border-t border-sky-200 pt-3 flex justify-between">
                <span className="font-semibold text-slate-900">Estimated Total</span>
                <span className="font-mono text-2xl font-bold text-sky-600">{result.estimate.totalEstimate}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  Container: {result.estimate.containerPercent}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {result.estimate.shippingType === "lines" ? "Line\u2019s Container" : "SOC"}
                </Badge>
                {result.estimate.shippingType === "lines" && !deliveryRates.find((r) => r.route === route)?.soc && (
                  <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
                    Line&apos;s only
                  </Badge>
                )}
              </div>
            </div>

            <p className="text-xs text-slate-500">
              This is an estimate based on reference rates. Actual costs may vary depending on
              equipment condition, accessibility, and current market rates. Contact us for a detailed quote.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button render={<Link href="/contact" />} className="flex-1 bg-sky-500 hover:bg-sky-600 text-white font-semibold py-5 rounded-xl">
                  Get Detailed Quote
              </Button>
              <Button render={<a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp for a detailed quote" />} variant="outline" className="flex-1 py-5 rounded-xl font-semibold border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  WhatsApp Us
              </Button>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setStep(1);
                setResult(null);
                setEquipmentType("");
                setRoute("");
                setEmail("");
                setName("");
                setCompany("");
                setCategory("");
                setError("");
                setWebsite("");
              }}
              className="w-full"
            >
              Calculate Another
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
