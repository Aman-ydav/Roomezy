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
import { Mail, Lock, ArrowLeft } from "lucide-react";
import MotionWrapper from "@/components/motion/MotionWrapper";
import ForgotPasswordModal from "./ForgotPasswordModal";


const LoginModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [forgotOpen, setForgotOpen] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  // handle input
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
        toast.error("Invalid credentials, please try again!");
      });
  };

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
            sm:max-w-md 
            w-[90%] sm:w-full mx-auto 
            border border-zinc-300 dark:border-zinc-800 
            rounded-2xl 
            bg-white dark:bg-zinc-950 
            text-zinc-900 dark:text-white 
            shadow-xl sm:shadow-2xl 
            transition-all duration-300
          "
        >
          <DialogHeader>
            <DialogTitle
              className="
                text-2xl sm:text-3xl font-extrabold text-center 
                bg-linear-to-r from-purple-600 to-fuchsia-500 
                bg-clip-text text-transparent
              "
            >
              Welcome Back
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              Sign in to continue your Roomezy experience
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            <div>
              <Label htmlFor="email" className="pb-1 text-sm sm:text-base">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  className="
                    pl-9 bg-zinc-100 dark:bg-zinc-900 
                    border border-purple-300 dark:border-purple-400 
                    text-zinc-900 dark:text-white 
                    focus:ring-2 focus:ring-purple-500
                  "
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="pb-1 text-sm sm:text-base">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="
                    pl-9 bg-zinc-100 dark:bg-zinc-900 
                    border border-purple-300 dark:border-purple-400 
                    text-zinc-900 dark:text-white 
                    focus:ring-2 focus:ring-purple-500
                  "
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="
                w-full mt-2 py-2 font-semibold text-white 
                bg-linear-to-r from-purple-600 to-fuchsia-600 
                hover:from-purple-700 hover:to-fuchsia-700 
                transition-all duration-300 rounded-lg
              "
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="text-center text-sm sm:text-base text-zinc-500 dark:text-zinc-400 mt-1 space-y-1">
            <p>
              Don’t have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 hover:text-fuchsia-500 font-medium"
              >
                Create one
              </Link>
            </p>
            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                onClick={() => setForgotOpen(true)}
              >
                Forgot your password?
              </Button>
            </div>

            <ForgotPasswordModal
              isOpen={forgotOpen}
              onClose={() => setForgotOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </MotionWrapper>
  );
};

export default LoginModal;
