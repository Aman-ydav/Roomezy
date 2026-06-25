import { useEffect, useState } from "react";
import { Check, Minus, Mail, ShieldCheck, ShieldX, X, Loader2 } from "lucide-react";
import axiosInstance from "@/utils/axiosInterceptor";

function getTrustLevel(data) {
  if (!data) return "none";
  if (data.kycVerified)    return "full";
  if (data.emailVerified)  return "email";
  return "none";
}

const TRUST_META = {
  full: {
    color: "#22c55e",
    label: "Fully Verified",
    sub:   "Email & identity confirmed",
  },
  email: {
    color: "#f59e0b",
    label: "Mail Verified · KYC Pending",
    sub:   "Email confirmed — identity not yet verified",
  },
  none: {
    color: "#9ca3af",
    label: "Not Verified",
    sub:   "Email and identity not yet verified",
  },
};

export default function VerificationPopup({ userId, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    axiosInstance
      .get(`/users/${userId}/verification-status`)
      .then(({ data: res }) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [userId]);

  const level = getTrustLevel(data);
  const meta  = TRUST_META[level];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xs bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-5 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={16} />
        </button>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 size={24} className="animate-spin text-muted-foreground" />
          </div>
        ) : !data ? (
          <p className="text-sm text-center text-muted-foreground py-4">Could not load verification info.</p>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3">
              <img
                src={data.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.userName || "User")}&background=6A1F2C&color=fff`}
                alt={data.userName}
                className="w-11 h-11 rounded-full object-cover border"
              />
              <div>
                <p className="font-semibold text-sm">{data.userName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className="inline-flex items-center justify-center rounded-full shrink-0"
                    style={{
                      width:           14,
                      height:          14,
                      backgroundColor: level !== "none" ? meta.color : "transparent",
                      border:          level === "none" ? `1.5px solid ${meta.color}` : "none",
                    }}
                  >
                    {level !== "none"
                      ? <Check size={8} color="white" strokeWidth={3.5} />
                      : <Minus size={8} color={meta.color} strokeWidth={3} />
                    }
                  </span>
                  <span className="text-xs font-medium" style={{ color: meta.color }}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{meta.sub}</p>
              </div>
            </div>

            <hr className="border-border" />

            {/* Checks */}
            <div className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3">
                {data.emailVerified ? (
                  <ShieldCheck size={18} className="text-green-500 shrink-0" />
                ) : (
                  <ShieldX size={18} className="text-red-400 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">Email Address</p>
                  <p className={`text-xs ${data.emailVerified ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {data.emailVerified ? "Verified" : "Not verified"}
                  </p>
                </div>
                <Mail size={14} className="ml-auto text-muted-foreground/50" />
              </div>

              {/* KYC */}
              <div className="flex items-center gap-3">
                {data.kycVerified ? (
                  <ShieldCheck size={18} className="text-green-500 shrink-0" />
                ) : (
                  <ShieldX size={18} className="text-red-400 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-medium">Government ID</p>
                  <p className={`text-xs ${data.kycVerified ? "text-green-600 dark:text-green-400" : "text-red-500"}`}>
                    {data.kycVerified ? "Identity confirmed" : "Not confirmed"}
                  </p>
                </div>
                <ShieldCheck size={14} className="ml-auto text-muted-foreground/40" />
              </div>
            </div>

            <p className="text-[11px] text-muted-foreground text-center pt-1">
              Roomezy independently verifies user identity.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
