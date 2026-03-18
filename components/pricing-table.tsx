"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  equipmentPricing,
  miscPricing,
  deliveryRates,
  equipmentCategories,
} from "@/content/pricing";

export function PricingTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filtered = equipmentPricing.filter((item) => {
    const matchesSearch =
      !search ||
      item.type.toLowerCase().includes(search.toLowerCase()) ||
      item.model.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      category === "all" || item.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-12">
      {/* Equipment Pricing */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Equipment Pricing
        </h2>
        <p className="mt-2 text-gray-600">
          Reference pricing for packing and container loading services. Final quotes provided upon request.
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search equipment type or model..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {equipmentCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  category === cat.id
                    ? "bg-sky-500 text-white"
                    : "border border-slate-200 bg-white text-slate-700 hover:bg-sky-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Equipment Type</TableHead>
                <TableHead className="font-semibold">Models</TableHead>
                <TableHead className="font-semibold text-right">Delivery</TableHead>
                <TableHead className="font-semibold text-right">Containerized</TableHead>
                <TableHead className="font-semibold text-right">Container %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.type}>
                  <TableCell className="font-medium">{item.type}</TableCell>
                  <TableCell className="text-sm text-gray-600">{item.model}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{item.delivery}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{item.containerized}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{item.container}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-gray-500">
                    No equipment found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Miscellaneous */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Miscellaneous Items
        </h2>
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold text-right">Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {miscPricing.map((item) => (
                <TableRow key={item.item}>
                  <TableCell className="font-medium">{item.item}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delivery Rates */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Container Delivery Rates
        </h2>
        <p className="mt-2 text-gray-600">
          40ft container rates. Line&apos;s = shipping line container. SOC = shipper-owned container.
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold">Route</TableHead>
                <TableHead className="font-semibold text-right">Line&apos;s Container</TableHead>
                <TableHead className="font-semibold text-right">SOC Container</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliveryRates.map((rate) => (
                <TableRow key={rate.route}>
                  <TableCell className="font-medium">{rate.route}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{rate.lines}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{rate.soc || "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
