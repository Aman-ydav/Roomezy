import { BadgeCheck } from "lucide-react";

export default function VerifiedBadge({ size = 16, className = "" }) {
  return (
    <BadgeCheck
      size={size}
      className={`text-indigo-500 shrink-0 ${className}`}
      aria-label="Identity Verified"
    />
  );
}
