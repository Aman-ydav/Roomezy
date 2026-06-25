import { useState } from "react";
import { BadgeCheck, Check, Minus } from "lucide-react";
import VerificationPopup from "./VerificationPopup";

function getState(kycStatus, isEmailVerified) {
  if (kycStatus === "verified") return "full";
  if (isEmailVerified)          return "email";
  return "none";
}

const STYLES = {
  full:  { color: "#22c55e", tooltip: "Email & identity verified" },
  email: { color: "#f59e0b", tooltip: "Email verified — identity pending" },
  none:  { color: "#9ca3af", tooltip: "Not yet verified — click to see details" },
};

export default function TrustBadge({
  kycStatus       = "none",
  isEmailVerified = false,
  userId          = null,
  size            = 16,
  showLabel       = false,
  className       = "",
}) {
  const [open, setOpen] = useState(false);
  const state = getState(kycStatus, isEmailVerified);
  const s     = STYLES[state];
  const isVerified = state !== "none";

  function handleClick(e) {
    if (!userId) return;
    e.stopPropagation();
    setOpen(true);
  }

  return (
    <>
      <span
        className={`inline-flex items-center gap-1 ${userId ? "cursor-pointer" : ""} ${className}`}
        title={s.tooltip}
        onClick={handleClick}
      >
        {/* Wavy badge shape (BadgeCheck) filled, white check overlaid on top */}
        <span
          className="relative shrink-0 inline-flex items-center justify-center transition-transform hover:scale-110"
          style={{ width: size, height: size }}
        >
          {isVerified ? (
            <>
              {/* Filled wavy badge in brand color */}
              <BadgeCheck
                size={size}
                style={{ color: s.color, fill: s.color }}
                strokeWidth={0}
              />
              {/* White checkmark on top */}
              <Check
                className="absolute"
                size={Math.round(size * 0.52)}
                color="white"
                strokeWidth={3}
              />
            </>
          ) : (
            /* Outline-only wavy badge for unverified */
            <BadgeCheck
              size={size}
              style={{ color: s.color }}
              fill="none"
              strokeWidth={1.5}
            />
          )}
        </span>

        {showLabel && (
          <span
            className="text-[11px] font-medium whitespace-nowrap"
            style={{ color: s.color }}
          >
            {state === "full"  ? "Verified"
             : state === "email" ? "Mail Verified · KYC Pending"
             : "Not Verified"}
          </span>
        )}
      </span>

      {open && userId && (
        <VerificationPopup userId={userId} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
