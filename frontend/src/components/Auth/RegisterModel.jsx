import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "@/features/auth/authSlice";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Camera,
  User,
  Mail,
  Lock,
  Phone,
  Calendar,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import MotionWrapper from "@/components/motion/MotionWrapper";

const RegisterModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    avatar: null,
  });
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [errors, setErrors] = useState({});

  // handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // avatar preview
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  // form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!formData.age) newErrors.age = "Age is required";
    if (formData.phone && !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const { userName, email, password, age, phone, avatar } = formData;
    const data = { userName, email, password, age, phone, avatar };

    dispatch(registerUser(data))
      .unwrap()
      .then(() => {
        toast.success("Account created successfully!");
        handleClose();
        navigate("/");
      })
      .catch((err) => {
        toast.error(err || "Registration failed. Try again!");
      });
  };

  // reset and close
  const handleClose = () => {
    onClose();
    setFormData({
      userName: "",
      email: "",
      password: "",
      age: "",
      phone: "",
      avatar: null,
    });
    setPreviewAvatar(null);
    setErrors({});
    navigate("/");
  };

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  return (
    <MotionWrapper duration={0.7}>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="
            sm:max-w-2xl w-[95%] max-h-[90vh] overflow-y-auto rounded-2xl border 
            border-border bg-card text-foreground 
            shadow-xl sm:shadow-2xl transition-all duration-300
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
              Create Your Account
            </DialogTitle>
            <DialogDescription className="text-center text-muted-foreground">
              Roomezy makes finding your place effortless
            </DialogDescription>
          </DialogHeader>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Avatar */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="h-20 w-20 border-2 border-primary shadow-md">
                  <AvatarImage src={previewAvatar} alt="Profile preview" />
                  <AvatarFallback>
                    {formData.userName ? (
                      formData.userName[0]?.toUpperCase()
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar"
                  className="
                    absolute -bottom-1 -right-1 p-1 bg-primary rounded-full cursor-pointer 
                    hover:opacity-90 transition
                  "
                >
                  <Camera className="h-3 w-3 text-primary-foreground" />
                </label>
                <input
                  id="avatar"
                  name="avatar"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>
            {errors.avatar && (
              <p className="text-sm text-destructive text-center">
                {errors.avatar}
              </p>
            )}

            {/* Inputs */}
            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <Label htmlFor="userName" className="mb-2">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="userName"
                    name="userName"
                    placeholder="Enter your name"
                    value={formData.userName}
                    onChange={handleChange}
                    className="pl-9 border border-input focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.userName && (
                  <p className="text-sm text-destructive">{errors.userName}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email" className="mb-2">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-9 border border-input focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="mb-2">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-9 border border-input focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>

              {/* Age + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="mb-2">Age</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                      className="pl-9 border border-input focus:ring-2 focus:ring-primary
                      [appearance:textfield] 
                                [&::-webkit-inner-spin-button]:appearance-none 
                                [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                  {errors.age && (
                    <p className="text-sm text-destructive">{errors.age}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-2">Phone (optional)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      type="number"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-9 border border-input focus:ring-2 focus:ring-primary
                                [appearance:textfield] 
                                [&::-webkit-inner-spin-button]:appearance-none 
                                [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>
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
                    transition={{ repeat: Infinity, duration: 0.6, ease: 'linear' }}
                    className="mr-2"
                  >
                    <Loader2 className="w-5 h-5 text-primary-foreground" />
                  </motion.div>
                  <span>Creating...</span>
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-center text-sm mt-4 text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary hover:text-accent hover:underline"
            >
              Sign in
            </Link>
          </p>
        </DialogContent>
      </Dialog>
    </MotionWrapper>
  );
};

export default RegisterModal;
