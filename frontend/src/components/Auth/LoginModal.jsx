import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "@/features/auth/authSlice";
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

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  // input handling
  const handleChange = (e) => {
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
    if (!validateForm()) return;

    dispatch(loginUser(formData))
      .unwrap()
      .then(() => {
        toast.success("Logged in successfully!");
        handleClose();
        navigate("/");
      })
      .catch((err) => {
        if (err.toLowerCase().includes("invalid")) {
          toast.error("Invalid email or password. Please try again!");
        } else if (err.toLowerCase().includes("network")) {
          toast.error("Network error! Please check your connection.");
        } else if (err.toLowerCase().includes("not found")) {
          toast.error("No user found with this email address.");
        } else {
          toast.error(err);
        }
      });
  };

  // reset + close
  const handleClose = () => {
    onClose();
    setFormData({ email: "", password: "" });
    setErrors({});
    navigate("/");
  };

  useEffect(() => {
    if (user && !loading) navigate("/");
  }, [user, loading, navigate]);

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
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Sign in to continue your Roomezy experience
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
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
                    transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
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
