"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
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
  translateType,
} from "@/content/pricing";
import { useLocale } from "next-intl";

const categoryKeyMap: Record<string, string> = {
  all: "allEquipment",
  harvesting: "harvesting",
  tillage: "tillage",
  spraying: "spraying",
  planting: "planting",
  large: "largeEquipment",
  misc: "miscellaneous",
};

export function PricingTable() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const t = useTranslations("PricingTable");
  const locale = useLocale();

  const filtered = equipmentPricing.filter((item) => {
    const translatedType = translateType(item.type, locale);
    const matchesSearch =
      !search ||
      translatedType.toLowerCase().includes(search.toLowerCase()) ||
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
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("equipmentPricing")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t("equipmentPricingDescription")}
        </p>

        {/* Filters */}
        <div className="mt-6 flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
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
                    ? "bg-primary text-white"
                    : "bg-muted text-foreground hover:bg-primary/10"
                }`}
              >
                {t(categoryKeyMap[cat.id] ?? cat.id)}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto rounded-xl shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">{t("equipmentType")}</TableHead>
                <TableHead className="font-semibold">{t("models")}</TableHead>
                <TableHead className="font-semibold text-right">{t("delivery")}</TableHead>
                <TableHead className="font-semibold text-right">{t("containerized")}</TableHead>
                <TableHead className="font-semibold text-right">{t("containerPercent")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((item) => (
                <TableRow key={item.type}>
                  <TableCell className="font-medium">{translateType(item.type, locale)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{item.model}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{item.delivery}</TableCell>
                  <TableCell className="text-right font-mono text-sm font-semibold">{item.containerized}</TableCell>
                  <TableCell className="text-right font-mono text-sm">{item.container}</TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                    {t("noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Miscellaneous */}
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("miscItems")}
        </h2>
        <div className="mt-6 overflow-x-auto rounded-xl shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">{t("item")}</TableHead>
                <TableHead className="font-semibold text-right">{t("price")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {miscPricing.map((item) => (
                <TableRow key={item.item}>
                  <TableCell className="font-medium">{translateType(item.item, locale)}</TableCell>
                  <TableCell className="text-right font-mono font-semibold">{item.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Delivery Rates */}
      <div>
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {t("containerDeliveryRates")}
        </h2>
        <p className="mt-2 text-muted-foreground">
          {t("containerDeliveryDescription")}
        </p>
        <div className="mt-6 overflow-x-auto rounded-xl shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">{t("route")}</TableHead>
                <TableHead className="font-semibold text-right">{t("linesContainer")}</TableHead>
                <TableHead className="font-semibold text-right">{t("socContainer")}</TableHead>
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
