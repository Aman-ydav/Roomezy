import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function Filters({
  filter,
  setFilter,
  status,
  setStatus,
  search,
  setSearch,
}) {
  return (
    <div className="max-w-6xl mx-auto mb-8 mt-8 px-2">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        {/* Search */}
        <Input
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-72"
        />

        {/* Filters */}
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Category Filter */}
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-48 backdrop-blur-2xl">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              align="start"
              sideOffset={6}
              avoidCollisions={false}
              className="w-(--radix-select-trigger-width) backdrop-blur-md"
            >
              {[
                ["all", "All Posts"],
                ["empty-room", "Room Available"],
                ["looking-for-room", "Looking for Room"],
                ["roommate-share", "Roommate Wanted"],
              ].map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className={cn(
                    //  remove heavy selected background
                    "data-[state=checked]:bg-transparent",
                    // subtle text emphasis only
                    "data-[state=checked]:font-medium",
                    "data-[state=checked]:text-primary"
                  )}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              align="start"
              sideOffset={6}
              avoidCollisions={false}
              className="w-(--radix-select-trigger-width)"
            >
              {[
                ["all", "All Status"],
                ["active", "Active"],
                ["closed", "Closed"],
              ].map(([value, label]) => (
                <SelectItem
                  key={value}
                  value={value}
                  className={cn(
                    "data-[state=checked]:bg-transparent",
                    "data-[state=checked]:font-medium",
                    "data-[state=checked]:text-primary"
                  )}
                >
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
