"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Package, MapPin, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { equipmentPricing, deliveryRates, equipmentCategories } from "@/content/pricing";
import { submitCalculator, type CalculatorResult } from "@/app/actions/calculator";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4;

export function CalculatorWizard() {
  const [step, setStep] = useState<Step>(1);
  const [category, setCategory] = useState("");
  const [equipmentType, setEquipmentType] = useState("");
  const [route, setRoute] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CalculatorResult | null>(null);

  const filteredEquipment = category
    ? equipmentPricing.filter((e) => e.category === category)
    : equipmentPricing;

  const selectedEquipment = equipmentPricing.find((e) => e.type === equipmentType);

  async function handleCalculate() {
    if (!email) return;
    setIsSubmitting(true);
    setError("");

    try {
      const res = await submitCalculator({
        email,
        name,
        company,
        equipmentCategory: category,
        equipmentType,
        originRegion: route.split("→")[0]?.trim() || "",
        destination: route,
      });

      if (res.success && res.estimate) {
        setResult(res);
        setStep(4);
      } else {
        setError(res.error || "Something went wrong");
      }
    } catch {
      setError("Failed to calculate. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="mx-auto max-w-2xl overflow-hidden border-blue-200 shadow-xl">
      {/* Progress bar */}
      <div className="flex border-b border-gray-100">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`flex-1 py-2.5 text-center text-xs font-medium transition-colors ${
              s <= step
                ? "bg-blue-600 text-white"
                : "bg-gray-50 text-gray-400"
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
            <div className="flex items-center gap-2 text-blue-600">
              <Package className="h-5 w-5" />
              <h3 className="text-lg font-bold">Select Equipment</h3>
            </div>

            <div>
              <Label>Category</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {equipmentCategories.filter((c) => c.id !== "all").map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { setCategory(cat.id); setEquipmentType(""); }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      category === cat.id
                        ? "bg-blue-600 text-white"
                        : "border border-gray-200 text-gray-700 hover:bg-blue-50"
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
                <div className="mt-2 max-h-48 space-y-1.5 overflow-y-auto rounded-lg border border-gray-200 p-2">
                  {filteredEquipment.map((eq) => (
                    <button
                      key={eq.type}
                      onClick={() => setEquipmentType(eq.type)}
                      className={`w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        equipmentType === eq.type
                          ? "bg-blue-600 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="font-medium">{eq.type}</div>
                      <div className={`text-xs ${equipmentType === eq.type ? "text-blue-100" : "text-gray-500"}`}>
                        {eq.model}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedEquipment && (
              <div className="rounded-lg bg-blue-50 p-4">
                <div className="text-sm text-gray-600">Estimated packing cost:</div>
                <div className="font-mono text-xl font-bold text-blue-700">
                  {selectedEquipment.containerized}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Container usage: {selectedEquipment.container}
                </div>
              </div>
            )}

            <Button
              onClick={() => setStep(2)}
              disabled={!equipmentType}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl"
            >
              Next: Select Route <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Step 2: Route Selection */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-blue-600">
              <MapPin className="h-5 w-5" />
              <h3 className="text-lg font-bold">Select Shipping Route</h3>
            </div>

            <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-lg border border-gray-200 p-2">
              {deliveryRates.map((dr) => (
                <button
                  key={dr.route}
                  onClick={() => setRoute(dr.route)}
                  className={`w-full rounded-lg px-3 py-3 text-left text-sm transition-colors ${
                    route === dr.route
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="font-medium">{dr.route}</div>
                  <div className={`text-xs ${route === dr.route ? "text-blue-100" : "text-gray-500"}`}>
                    Line&apos;s: {dr.lines || "—"} | SOC: {dr.soc || "—"}
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Email Gate */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-blue-600">
              <Mail className="h-5 w-5" />
              <h3 className="text-lg font-bold">Get Your Estimate</h3>
            </div>

            <p className="text-sm text-gray-600">
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

            {/* Summary */}
            <div className="rounded-lg bg-gray-50 p-4 text-sm">
              <div className="font-semibold text-gray-900">Your selection:</div>
              <div className="mt-1 text-gray-600">{equipmentType}</div>
              <div className="text-gray-600">{route}</div>
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
                disabled={!email || isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl"
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
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <h3 className="text-lg font-bold">Your Freight Estimate</h3>
            </div>

            <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50 p-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Packing & Loading</span>
                <span className="font-mono font-bold text-gray-900">{result.estimate.packingCost}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Container Shipping</span>
                <span className="font-mono font-bold text-gray-900">{result.estimate.shippingCost}</span>
              </div>
              <div className="border-t border-blue-200 pt-3 flex justify-between">
                <span className="font-semibold text-gray-900">Estimated Total</span>
                <span className="font-mono text-2xl font-bold text-blue-700">{result.estimate.totalEstimate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="font-mono text-xs">
                  Container: {result.estimate.containerPercent}
                </Badge>
                <Badge variant="secondary" className="text-xs capitalize">
                  {result.estimate.shippingType === "lines" ? "Line's Container" : "SOC"}
                </Badge>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              This is an estimate based on reference rates. Actual costs may vary depending on
              equipment condition, accessibility, and current market rates. Contact us for a detailed quote.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-5 rounded-xl">
                  Get Detailed Quote
                </Button>
              </Link>
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
                <Button variant="outline" className="w-full py-5 rounded-xl font-semibold border-green-500 text-green-600 hover:bg-green-50">
                  WhatsApp Us
                </Button>
              </a>
            </div>

            <Button
              variant="ghost"
              onClick={() => { setStep(1); setResult(null); setEquipmentType(""); setRoute(""); setEmail(""); }}
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
