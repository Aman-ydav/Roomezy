import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import { verifyEmailCode, sendVerificationCode } from "@/features/auth/authSlice";

import { Mail, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function EmailVerificationModal({ open, setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const email = user?.email;
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60); // 1 minute lock for resend
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [loadingResend, setLoadingResend] = useState(false);
  const [shake, setShake] = useState(false);

  const inputs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  // ---- Handle modal open ----
  useEffect(() => {
    if (open) {
      handleSendCode(); // auto-send once modal opens
      setTimer(60);
      setCode(["", "", "", "", "", ""]);
      setTimeout(() => inputs[0].current?.focus(), 150);
    }
  }, [open]);

  // ---- Countdown timer ----
  useEffect(() => {
    if (!open || timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [open, timer]);

  // ---- Auto format OTP + jump to next input ----
  const handleChange = (i, v) => {
    if (!/^\d*$/.test(v)) return;
    const arr = [...code];
    arr[i] = v.slice(-1);
    setCode(arr);

    if (v && i < 5) inputs[i + 1].current?.focus();
  };

  // ---- Send Verification Code ----
  const handleSendCode = async () => {
    setLoadingResend(true);
    try {
      await dispatch(sendVerificationCode(email)).unwrap();
      toast.success("Verification code sent successfully!");
      setTimer(60); // lock resend again
    } catch (err) {
      toast.error(err || "Failed to send verification code");
    }
    setLoadingResend(false);
  };

  // ---- Verify OTP ----
  const handleSubmit = async () => {
    const otp = code.join("");
    if (otp.length !== 6) return toast.error("Please enter all 6 digits");

    setLoadingVerify(true);
    try {
      const res = await dispatch(verifyEmailCode({ email, code: otp })).unwrap();
      toast.success("Email verified successfully!");
      setOpen(false);
    } catch (err) {
      toast.error("Invalid or expired code");
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setCode(["", "", "", "", "", ""]);
      inputs[0].current?.focus();
    }
    setLoadingVerify(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Mail className="w-5 h-5 text-primary" />
            Verify Your Email
          </DialogTitle>
        </DialogHeader>

        <p className="text-muted-foreground text-sm">
          We sent a 6-digit code to <span className="font-semibold">{email}</span>
        </p>

        {/* OTP BOXES */}
        <div className={clsx("flex justify-center gap-2 mt-5", shake && "animate-shake")}>
          {code.map((d, i) => (
            <Input
              key={i}
              ref={inputs[i]}
              maxLength={1}
              value={d}
              inputMode="numeric"
              onChange={(e) => handleChange(i, e.target.value)}
              className="w-12 h-12 rounded-md border text-center text-xl font-bold tracking-widest"
            />
          ))}
        </div>

        {/* TIMER */}
        <div className="text-center text-sm mt-3 text-muted-foreground">
          Code expires in:
          <span className={clsx("ml-1 font-semibold", timer < 10 ? "text-destructive" : "text-primary")}>
            {String(timer).padStart(2, "0")}s
          </span>
        </div>

        {/* VERIFY BUTTON */}
        <Button
          onClick={handleSubmit}
          className="w-full mt-4 bg-primary text-primary-foreground"
          disabled={loadingVerify}
        >
          {loadingVerify ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Verify Email
            </>
          )}
        </Button>

        {/* RESEND BUTTON */}
        <Button
          variant="outline"
          onClick={handleSendCode}
          className="w-full mt-3"
          disabled={timer > 0 || loadingResend}
        >
          {loadingResend ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
            </>
          ) : timer > 0 ? (
            `Resend Code in ${timer}s`
          ) : (
            "Resend Code"
          )}
        </Button>

        <p className="text-center mt-4 text-xs text-muted-foreground">
          Didn’t receive the code? Check spam folder.
        </p>
      </DialogContent>
    </Dialog>
  );
}
