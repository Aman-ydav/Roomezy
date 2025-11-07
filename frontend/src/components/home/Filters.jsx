import React from "react";

export default function Filters({ filter, setFilter, search, setSearch }) {
  return (
    <div className="max-w-6xl mx-auto mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <div className="flex gap-2 flex-wrap">
        {["all", "room_available", "looking_for_room"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              filter === f
                ? "bg-primary text-primary-foreground"
                : "border border-border hover:bg-accent/10"
            }`}
          >
            {f === "all"
              ? "All"
              : f === "room-available"
              ? "Room Available"
              : "Looking for Room"}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="Search by title or location..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-input rounded-md px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}
