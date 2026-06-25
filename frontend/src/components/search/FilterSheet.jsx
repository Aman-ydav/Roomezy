import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const POST_TYPES = [
  { value: "",                label: "All" },
  { value: "room-available",  label: "Room Available" },
  { value: "looking-for-room", label: "Looking for Room" },
];

const SORT_OPTIONS = [
  { value: "newest",   label: "Newest First" },
  { value: "cheapest", label: "Cheapest Rent" },
  { value: "rating",   label: "Highest Rated" },
];

export default function FilterSheet({ open, onClose, onApply, initialFilters = {} }) {
  const [type,    setType]    = useState(initialFilters.type    || "");
  const [rentMin, setRentMin] = useState(initialFilters.rentMin || "");
  const [rentMax, setRentMax] = useState(initialFilters.rentMax || "");
  const [sort,    setSort]    = useState(initialFilters.sort    || "newest");

  function handleApply() {
    const filters = { sort };
    if (type)    filters.type    = type;
    if (rentMin) filters.rentMin = rentMin;
    if (rentMax) filters.rentMax = rentMax;
    onApply?.(filters);
    onClose?.();
  }

  function handleReset() {
    setType(""); setRentMin(""); setRentMax(""); setSort("newest");
    onApply?.({});
    onClose?.();
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="right" className="w-80 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filter Posts</SheetTitle>
        </SheetHeader>

        <div className="space-y-5 mt-4">
          {/* Post Type */}
          <div className="space-y-2">
            <Label>Post Type</Label>
            <div className="flex flex-wrap gap-2">
              {POST_TYPES.map((t) => (
                <button
                  key={t.value}
                  onClick={() => setType(t.value)}
                  className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                    type === t.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rent Range */}
          <div className="space-y-2">
            <Label>Rent Range (₹/month)</Label>
            <div className="flex gap-2 items-center">
              <Input
                type="number"
                placeholder="Min"
                value={rentMin}
                onChange={(e) => setRentMin(e.target.value)}
                className="w-1/2"
              />
              <span className="text-muted-foreground">–</span>
              <Input
                type="number"
                placeholder="Max"
                value={rentMax}
                onChange={(e) => setRentMax(e.target.value)}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <div className="flex flex-col gap-2">
              {SORT_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSort(s.value)}
                  className={`text-left px-3 py-2 text-sm rounded-lg border transition-colors ${
                    sort === s.value
                      ? "bg-primary/10 border-primary text-primary font-medium"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1" onClick={handleReset}>
              Reset
            </Button>
            <Button className="flex-1" onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
