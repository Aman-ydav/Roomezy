import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

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
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              align="start"
              sideOffset={6}
              avoidCollisions={false}
              className="w-(--radix-select-trigger-width)"
            >
              <SelectItem value="all">All Posts</SelectItem>
              <SelectItem value="empty-room">Room Available</SelectItem>
              <SelectItem value="looking-for-room">
                Looking for Room
              </SelectItem>
              <SelectItem value="roommate-share">
                Roommate Wanted
              </SelectItem>
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
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
