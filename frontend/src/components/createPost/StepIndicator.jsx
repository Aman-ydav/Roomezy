import React from "react";

export default function StepIndicator({ step }) {
  const steps = [
    { id: 1, label: "Basic Info" },
    { id: 2, label: "Details" },
    { id: 3, label: "Images" },
  ];

  return (
    <div className="flex justify-center gap-4 mb-4">
      {steps.map((s) => (
        <div key={s.id} className="flex flex-col items-center">
          <div
            className={`h-10 w-10 flex items-center justify-center rounded-full border-2 transition-all ${
              step >= s.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground"
            }`}
          >
            {s.id}
          </div>
          <span
            className={`text-xs mt-2 ${
              step >= s.id ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
