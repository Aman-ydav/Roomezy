import React from "react";

export default function Filters({ filter, setFilter, search, setSearch }) {
  const filterOptions = [
    { key: "all", label: "All" },
    { key: "empty-room", label: "Room Available" },
    { key: "looking-for-room", label: "Looking for Room" },
    { key: "roommate-share", label: "Roommate Wanted" },
  ];

  return (
    <div className="max-w-6xl mx-auto mb-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      
      <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
        {filterOptions.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
              filter === f.key
                ? "bg-primary text-primary-foreground shadow-md scale-105"
                : "border border-border hover:bg-accent/10 hover:shadow-sm"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="w-full sm:w-auto flex justify-center sm:justify-end">
        <input
          type="text"
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-input rounded-md px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all bg-background placeholder:text-muted-foreground/70"
        />
      </div>
    </div>
  );
}
