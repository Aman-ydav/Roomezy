import { BadgeCheck, Check, Scan, Mail, X, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    icon:  Mail,
    color: "#6366f1",
    bg:    "#6366f112",
    title: "Real Accounts Only",
    desc:  "Every Roomezy user is tied to a confirmed email. No anonymous profiles, no ghost listings — every account is real.",
  },
  {
    icon:  Scan,
    color: "#f59e0b",
    bg:    "#f59e0b12",
    title: "Government ID Matched",
    desc:  "Our AI independently confirms each person's face matches their official ID. Zero human access — complete privacy.",
  },
  {
    icon:  ShieldCheck,
    color: "#22c55e",
    bg:    "#22c55e12",
    title: "Independently Verified",
    desc:  "When you see the green badge, Roomezy has already done the work. That person is who they say they are — guaranteed.",
  },
];

const BADGES = [
  { bg: "#22c55e", label: "Fully Verified",              sub: "Identity independently confirmed by Roomezy" },
  { bg: "#f59e0b", label: "Mail Verified · KYC Pending", sub: "Email confirmed — identity check in progress" },
  { bg: null,      label: "Not Yet Verified",             sub: "Verification not yet completed" },
];

function FilledBadge({ bg, size = 24 }) {
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      {bg ? (
        <>
          <BadgeCheck size={size} style={{ color: bg, fill: bg }} strokeWidth={0} />
          <Check className="absolute" size={Math.round(size * 0.5)} color="white" strokeWidth={3.5} />
        </>
      ) : (
        <BadgeCheck size={size} style={{ color: "#9ca3af" }} fill="none" strokeWidth={1.5} />
      )}
    </span>
  );
}

export default function TrustModal({ onClose }) {
  return (
    <div
      className="fixed top-16 inset-x-0 bottom-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl flex flex-col max-h-[calc(100vh-5rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header — pinned */}
        <div className="flex items-start justify-between px-7 pt-6 pb-5 border-b border-border shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Roomezy Trust System
              </span>
            </div>
            <h2 className="text-2xl font-bold text-foreground">Know who you're living with</h2>
            <p className="text-sm text-muted-foreground max-w-lg">
              We verify identity before anyone can connect. Your safety isn't optional here — it's built in.
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-6 space-y-7 overflow-y-auto">

          {/* 3 Steps — horizontal grid on desktop */}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              How we protect you
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {STEPS.map((s) => (
                <div key={s.title} className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-muted/20">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: s.bg }}
                  >
                    <s.icon size={19} style={{ color: s.color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{s.title}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badge legend */}
          <div className="border-t border-border pt-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-5">
              What each badge tells you
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {BADGES.map((b) => (
                <div key={b.label} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-muted/10">
                  <FilledBadge bg={b.bg} size={26} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">{b.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground text-center border-t border-border pt-4">
            Tap any badge on a post or in chat to instantly see what's been verified for that user.
          </p>
        </div>
      </div>
    </div>
  );
}
