import { FileText, Package, Plane, Ship } from "lucide-react";

const capabilities = [
  { icon: FileText, label: "Export Documentation" },
  { icon: Package, label: "Packing & Compliance" },
  { icon: Plane, label: "Air Freight", detail: "7–14 Days" },
  { icon: Ship, label: "Ocean Freight", detail: "Container Loads" },
];

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-8">
          {capabilities.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <item.icon className="h-5 w-5 shrink-0 text-sky-500" />
              <div>
                <p className="text-sm font-medium text-slate-700">
                  {item.label}
                </p>
                {item.detail && (
                  <p className="text-xs text-slate-500">{item.detail}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
