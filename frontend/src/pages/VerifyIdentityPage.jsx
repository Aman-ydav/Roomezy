import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utils/axiosInterceptor";
import { payForKyc } from "@/utils/razorpay";
import { Button } from "@/components/ui/button";
import { BadgeCheck, UploadCloud, Loader2, AlertCircle } from "lucide-react";

const DOC_TYPES = [
  { value: "aadhaar",  label: "Aadhaar Card" },
  { value: "pan",      label: "PAN Card" },
  { value: "passport", label: "Passport" },
];

export default function VerifyIdentityPage() {
  const navigate    = useNavigate();
  const selfieRef   = useRef(null);
  const documentRef = useRef(null);

  const [selfie,     setSelfie]     = useState(null);
  const [document,   setDocument]   = useState(null);
  const [docType,    setDocType]    = useState("aadhaar");
  const [loading,    setLoading]    = useState(false);
  const [step,       setStep]       = useState("upload"); // upload | matched | done | error | no_match
  const [result,     setResult]     = useState(null);
  const [error,      setError]      = useState(null);
  const [payLoading, setPayLoading] = useState(false);

  // On mount — if user already has a pending face match, skip to payment step
  useEffect(() => {
    axiosInstance.get("/kyc/status")
      .then(({ data }) => {
        const s = data.data;
        if (
          s.kycStatus === "awaiting_payment" &&
          new Date() <= new Date(s.kycPaymentDeadline)
        ) {
          setResult({ paymentDeadline: s.kycPaymentDeadline });
          setStep("matched");
        }
        if (s.kycStatus === "verified") {
          setStep("done");
        }
      })
      .catch(() => {});
  }, []);

  function previewUrl(file) {
    return file ? URL.createObjectURL(file) : null;
  }

  async function handleSubmit() {
    if (!selfie || !document) {
      setError("Please select both your selfie and document photo.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append("selfie",       selfie);
      form.append("document",     document);
      form.append("documentType", docType);

      const { data } = await axiosInstance.post("/kyc/submit", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Backend says face already matched — go straight to payment
      if (data.data?.redirectToPayment) {
        setResult({ paymentDeadline: data.data.paymentDeadline });
        setStep("matched");
        return;
      }

      setResult(data.data);
      setStep(data.data.matched ? "matched" : "no_match");
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      setError(msg);
      setStep("error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePay() {
    setError(null);
    setPayLoading(true);
    try {
      await payForKyc();
      setStep("done");
    } catch (err) {
      setError(err.message || "Payment failed");
    } finally {
      setPayLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-md p-6 space-y-6">

        {/* Header */}
        <div className="text-center space-y-1">
          <BadgeCheck size={40} className="mx-auto text-indigo-500" />
          <h1 className="text-xl font-bold">Verify Your Identity</h1>
          <p className="text-sm text-muted-foreground">
            Get a verified badge on your profile and posts for ₹99 (one-time).
          </p>
        </div>

        {/* Step: upload */}
        {step === "upload" && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Document Type</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-transparent"
              >
                {DOC_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>

            {/* Selfie */}
            <div
              onClick={() => selfieRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-indigo-400 transition-colors"
            >
              {selfie ? (
                <img
                  src={previewUrl(selfie)}
                  alt="Selfie preview"
                  className="h-32 w-32 rounded-full object-cover"
                />
              ) : (
                <>
                  <UploadCloud size={32} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-1">Upload Selfie</p>
                </>
              )}
              <input
                ref={selfieRef}
                type="file"
                accept="image/*"
                capture="user"
                className="hidden"
                onChange={(e) => setSelfie(e.target.files?.[0] || null)}
              />
            </div>

            {/* Document */}
            <div
              onClick={() => documentRef.current?.click()}
              className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center cursor-pointer hover:border-indigo-400 transition-colors"
            >
              {document ? (
                <img
                  src={previewUrl(document)}
                  alt="Document preview"
                  className="h-32 rounded-lg object-contain"
                />
              ) : (
                <>
                  <UploadCloud size={32} className="text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload {DOC_TYPES.find(d => d.value === docType)?.label}
                  </p>
                </>
              )}
              <input
                ref={documentRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setDocument(e.target.files?.[0] || null)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <Button onClick={handleSubmit} disabled={loading} className="w-full">
              {loading && <Loader2 size={16} className="animate-spin mr-2" />}
              {loading ? "Verifying..." : "Verify Identity"}
            </Button>
          </div>
        )}

        {/* Step: matched — face ok, pending payment */}
        {step === "matched" && (
          <div className="space-y-4 text-center">
            <BadgeCheck size={48} className="mx-auto text-green-500" />
            <p className="font-semibold text-green-600">
              {result?.confidence
                ? `Identity verified! (${result.confidence}% confidence)`
                : "Identity verification completed — proceed with payment to activate."}
            </p>
            <p className="text-sm text-muted-foreground">
              Pay ₹99 once to activate your verified badge. Valid for life.
              {result?.paymentDeadline && (
                <> Payment deadline: <strong>{new Date(result.paymentDeadline).toLocaleDateString("en-IN")}</strong>.</>
              )}
            </p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={handlePay} disabled={payLoading} className="w-full">
              {payLoading && <Loader2 size={16} className="animate-spin mr-2" />}
              {payLoading ? "Processing..." : "Pay ₹99 & Get Verified"}
            </Button>
          </div>
        )}

        {/* Step: no_match */}
        {step === "no_match" && (
          <div className="space-y-4 text-center">
            <AlertCircle size={40} className="mx-auto text-yellow-500" />
            <p className="font-semibold">Face did not match</p>
            <p className="text-sm text-muted-foreground">
              {result?.attemptsRemaining > 0
                ? `${result.attemptsRemaining} attempt(s) remaining. Make sure your face is clearly visible in both photos.`
                : "All attempts used. Please contact support."}
            </p>
            {result?.attemptsRemaining > 0 && (
              <Button
                onClick={() => { setStep("upload"); setResult(null); setError(null); }}
                className="w-full"
              >
                Try Again
              </Button>
            )}
          </div>
        )}

        {/* Step: done */}
        {step === "done" && (
          <div className="space-y-4 text-center">
            <BadgeCheck size={48} className="mx-auto text-indigo-500" />
            <p className="text-xl font-bold text-indigo-600">You're Verified!</p>
            <p className="text-sm text-muted-foreground">
              Your identity has been confirmed. The verified badge now appears on your profile and posts.
            </p>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}

        {/* Step: error */}
        {step === "error" && (
          <div className="space-y-4 text-center">
            <AlertCircle size={40} className="mx-auto text-red-500" />
            <p className="font-semibold text-red-500">{error}</p>
            <Button
              variant="outline"
              onClick={() => { setStep("upload"); setError(null); }}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="w-full text-muted-foreground">
          Back
        </Button>
      </div>
    </div>
  );
}
