import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/features/auth/authSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
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
        toast.success("Reset link has been sent!");
        onClose();
      })
      .catch((err) => {
        if (err === "User not found") {
          toast.success("If this email is registered, a reset link has been sent!");
        } else {
          toast.error(err || "Something went wrong. Please try again.");
        }
      });
  };

  return (
    <MotionWrapper duration={0.6}>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="
            sm:max-w-md w-[90%] mx-auto max-h-[90vh] overflow-y-auto
            border border-border 
            rounded-2xl 
            bg-card text-foreground
            shadow-xl sm:shadow-2xl 
            transition-all duration-300
          "
        >
          <DialogHeader>
            <DialogTitle
              className="
                text-2xl sm:text-3xl font-extrabold text-center 
                bg-linear-to-r from-primary to-accent 
                bg-clip-text text-transparent
              "
            >
              Forgot Password
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Enter your registered email to receive a password reset link
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="
                  pl-9 border border-input 
                  focus:ring-2 focus:ring-primary
                  bg-background text-foreground
                "
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="
                relative flex justify-center items-center w-full 
                bg-primary hover:bg-accent 
                text-primary-foreground font-semibold 
                shadow-lg rounded-md py-2 transition-all duration-300
              "
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                    className="mr-2"
                  >
                    <Loader2 className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                  <span>Sending...</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </MotionWrapper>
  );
};

export default ForgotPasswordModal;
