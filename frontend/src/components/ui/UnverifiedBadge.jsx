import { ShieldQuestion } from "lucide-react";

/**
 * Shown when a user's identity has NOT been confirmed via KYC.
 * Neutral grey — not a warning, just informational.
 * Use alongside VerifiedBadge so verified users stand out.
 */
export default function UnverifiedBadge({ size = 14, showLabel = false, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      title="This user's identity has not been confirmed"
    >
      <ShieldQuestion size={size} className="text-muted-foreground/60 shrink-0" />
      {showLabel && (
        <span className="text-[11px] text-muted-foreground/70 font-medium">
          Unconfirmed
        </span>
      )}
    </span>
  );
}
