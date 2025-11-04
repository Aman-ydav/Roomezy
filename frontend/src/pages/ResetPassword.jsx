import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "@/features/auth/authSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MotionWrapper from "@/components/motion/MotionWrapper";
import { Lock } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return toast.error("Password cannot be empty");

    dispatch(resetPassword({ token, password }))
      .unwrap()
      .then(() => {
        toast.success("Password reset successfully!");
        navigate("/login");
      })
      .catch((err) => toast.error(err || "Failed to reset password"));
  };

  return (
    <MotionWrapper duration={0.6}>
      <div className="flex items-center justify-center h-screen bg-linear-to-br from-background to-muted dark:from-zinc-950 dark:to-zinc-900 transition-colors duration-300">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="
            w-[90%] sm:w-[400px] mx-auto 
            border border-border rounded-2xl 
            bg-card text-foreground 
            shadow-xl sm:shadow-2xl 
            p-8 space-y-5 
            transition-all duration-300
          "
        >
          <h1
            className="
              text-2xl sm:text-3xl font-extrabold text-center 
              bg-linear-to-r from-primary to-accent 
              bg-clip-text text-transparent
            "
          >
            Reset Your Password
          </h1>

          <p className="text-center text-sm text-muted-foreground">
            Enter your new password below.
          </p>

          <div className="relative mt-4">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                pl-9 border border-input 
                focus:ring-2 focus:ring-primary
                bg-background text-foreground
              "
            />
          </div>

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
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                className="mr-2"
              >
                <Lock className="w-5 h-5 text-primary-foreground" />
              </motion.div>
            ) : (
              "Reset Password"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-primary hover:text-accent font-medium cursor-pointer transition-colors"
            >
              Back to Login
            </span>
          </p>
        </motion.form>
      </div>
    </MotionWrapper>
  );
};

export default ResetPassword;
