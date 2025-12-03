import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser, googleLogin, googleLoginSuccess } from "@/features/auth/authSlice";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import MotionWrapper from "@/components/motion/MotionWrapper";
import ForgotPasswordModal from "./ForgotPasswordModal";

const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // input handling
  const handleChange = (e) => {
    if (formError) setFormError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormError("");

    if (!validateForm()) return;

    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        toast.success("Logged in successfully!");
        handleClose();
        navigate("/");
      })
      .catch((err) => {
        let message = "An unexpected error occurred. Please try again.";

        if (err.toLowerCase().includes("invalid")) {
          message = "Invalid email or password. Please try again!";
        } else if (err.toLowerCase().includes("network")) {
          message = "Network error! Please check your internet connection.";
        } else if (err.toLowerCase().includes("not found")) {
          message = "No user found with this email address.";
        } 

        setFormError(err? err : message);
      });
  };

  // reset + close
  const handleClose = () => {
    onClose();
    setFormData({ email: "", password: "" });
    setErrors({});
    setFormError("");
    navigate("/");
  };

  useEffect(() => {
    if (user && !loading) navigate("/");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      const div = document.getElementById("googleLoginBtn");

      if (window.google && div) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
        });

        window.google.accounts.id.renderButton(div, {
          theme: "outline",
          size: "large",
          width: "100%",
        });

        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isOpen]);

  const handleGoogleResponse = async (response) => {
  try {
    const id_token = response.credential;

    // Call asyncThunk googleLogin
    const result = await dispatch(googleLogin(id_token));

    // If Google login succeeded
    if (googleLogin.fulfilled.match(result)) {
      // Update Redux state using reducer
      dispatch(googleLoginSuccess(result.payload));

      toast.success("Logged in with Google!");
      handleClose();
      navigate("/");
    } else {
      toast.error(result.payload || "Google login failed");
    }
  } catch (err) {
    console.error("Google login error:", err);
    toast.error("Google login failed");
  }
};


  return (
    <MotionWrapper duration={0.6}>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="
            sm:max-w-md w-[90%] mx-auto max-h-[90vh] overflow-y-auto
            border border-border 
            rounded-2xl 
            bg-card text-foreground
            shadow-xl sm:shadow-2xl 
            transition-all duration-300 mt-10
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
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Sign in to continue your Roomezy experience
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div className="mb-5">
              <div id="googleLoginBtn" className="flex justify-center"></div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-muted"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-1 block text-sm font-medium">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="
                    pl-9 border border-input 
                    focus:ring-2 focus:ring-primary
                    bg-background text-foreground
                  "
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label
                htmlFor="password"
                className="mb-1 block text-sm font-medium"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    pl-9 border border-input 
                    focus:ring-2 focus:ring-primary
                    bg-background text-foreground
                  "
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-11/12 text-center text-sm font-medium text-destructive"
              >
                {formError}
              </motion.div>
            )}

            {/* Submit button */}
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
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      ease: "linear",
                    }}
                    className="mr-2"
                  >
                    <Loader2 className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-center space-y-3 mt-4">
            <Button
              type="button"
              variant="link"
              className="text-sm text-muted-foreground hover:text-foreground"
              onClick={() => setForgotOpen(true)}
            >
              Forgot your password?
            </Button>

            <ForgotPasswordModal
              isOpen={forgotOpen}
              onClose={() => setForgotOpen(false)}
            />

            <p className="text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-accent font-medium transition-colors"
              >
                Create one
              </Link>
            </p>

            <p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-accent transition-colors duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </MotionWrapper>
  );
};

export default LoginModal;
