import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/features/auth/authSlice";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import MotionWrapper from "@/components/motion/MotionWrapper";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");

    dispatch(forgotPassword(email))
      .unwrap()
      .then(() => {
        toast.success("Reset link sent to your email!");
        onClose();
      })
      .catch((err) => {
          if (err === "User not found") {
            // Still show a neutral success-like message
            toast.success("If this email is registered, a reset link has been sent.");
            } else {
            toast.error(err || "Something went wrong. Please try again.");
            }
        });
  };

  return (
    <MotionWrapper duration={0.6}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md w-[90%] mx-auto bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-300 dark:border-zinc-800 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold text-center bg-linear-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent">
              Forgot Password
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="pl-9 bg-zinc-100 dark:bg-zinc-900 border border-purple-300 dark:border-purple-400 text-zinc-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 font-semibold text-white bg-linear-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 transition-all duration-300 rounded-lg"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </MotionWrapper>
  );
};

export default ForgotPasswordModal;
