import { TrendingUp, Clock, Ship, Star, FileText, Package } from "lucide-react";
import { STATS } from "@/lib/constants";

const items = [
  { icon: TrendingUp, label: `${STATS.projectsCompleted}+ Equipment Exports`, isStat: true },
  { icon: Clock, label: `${STATS.yearsExperience}+ Years`, isStat: true },
  { icon: Ship, label: "Worldwide Shipping" },
  { icon: Star, label: "5.0 Google Rating" },
  { icon: FileText, label: "Export Docs" },
  { icon: Package, label: "Packing & Crating" },
];

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6 lg:gap-8">
          {items.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-5 w-5 shrink-0 text-sky-500" />
              <p
                className={`text-sm font-medium text-slate-700 ${
                  item.isStat ? "font-mono" : ""
                }`}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
