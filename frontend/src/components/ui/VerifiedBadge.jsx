import { useState } from "react";
import { BadgeCheck } from "lucide-react";
import VerificationPopup from "./VerificationPopup";

export default function VerifiedBadge({ size = 16, className = "", userId = null }) {
  const [open, setOpen] = useState(false);

  const badge = (
    <BadgeCheck
      size={size}
      className={`text-green-500 shrink-0 ${userId ? "cursor-pointer hover:scale-110 transition-transform" : ""} ${className}`}
      aria-label="Identity Verified"
      onClick={userId ? (e) => { e.stopPropagation(); setOpen(true); } : undefined}
    />
  );

  return (
    <>
      {badge}
      {open && userId && (
        <VerificationPopup userId={userId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
