import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";

const CATEGORY_OPTIONS = [
  ["all",             "All Posts"],
  ["empty-room",      "Room Available"],
  ["looking-for-room","Looking for Room"],
  ["roommate-share",  "Roommate Wanted"],
];

const STATUS_OPTIONS = [
  ["all",    "All Status"],
  ["active", "Active"],
  ["closed", "Closed"],
];

function FilterSelect({ value, onChange, options, width = "w-44" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedLabel = options.find(([v]) => v === value)?.[1] ?? options[0][1];

  return (
    <div ref={ref} className={`relative ${width}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center justify-between gap-2 w-full px-3 py-2 border border-input rounded-lg bg-background text-sm font-medium hover:bg-muted/40 transition-colors"
      >
        <span className="text-foreground truncate">{selectedLabel}</span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-card border border-border rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          {options.map(([v, label]) => (
            <button
              key={v}
              onClick={() => { onChange(v); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-muted ${
                v === value
                  ? "text-primary font-semibold bg-primary/8"
                  : "text-foreground bg-card"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Filters({ filter, setFilter, status, setStatus, search, setSearch }) {
  return (
    <div className="max-w-6xl mx-auto mb-8 mt-8 px-2">
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex gap-3 w-full sm:w-auto">
          <FilterSelect
            value={filter}
            onChange={setFilter}
            options={CATEGORY_OPTIONS}
            width="w-full sm:w-48"
          />
          <FilterSelect
            value={status}
            onChange={setStatus}
            options={STATUS_OPTIONS}
            width="w-full sm:w-36"
          />
        </div>

      </div>
    </div>
  );
}
