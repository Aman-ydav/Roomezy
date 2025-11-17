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
  MapPin,
  Venus,
} from "lucide-react";
import { motion } from "framer-motion";
import MotionWrapper from "@/components/motion/MotionWrapper";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

const RegisterModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
    age: "",
    phone: "",
    gender: "",
    preferredLocations: [],
    newLocation: "",
    avatar: null,
    accountType: "", // NEW
  });

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    if (formError) setFormError("");
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Avatar preview handler
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  // Form validation
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
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (!formData.accountType)
      newErrors.accountType = "Please select what you are looking for"; // NEW
    if (formData.phone && !/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone number must be 10 digits";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [openGender, setOpenGender] = useState(false);
  const [focusedGenderIndex, setFocusedGenderIndex] = useState(-1);
  const genderBtnRef = useRef(null);
  const genderListRef = useRef(null);

  const [openAccountType, setOpenAccountType] = useState(false);
  const [focusedAccountTypeIndex, setFocusedAccountTypeIndex] = useState(-1);
  const accountTypeBtnRef = useRef(null);
  const accountTypeListRef = useRef(null);
  // Select AccountType
  const selectAccountType = (val) => {
    setFormData((p) => ({ ...p, accountType: val }));
    setOpenAccountType(false);
    setFocusedAccountTypeIndex(-1);
    accountTypeBtnRef.current?.focus();
  };

  // Keyboard when focus is on button
  const handleAccountTypeKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpenAccountType(true);
      setFocusedAccountTypeIndex(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpenAccountType(true);
      setFocusedAccountTypeIndex(2);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenAccountType((s) => !s);
    }
  };

  // Keyboard inside list
  const handleAccountTypeListKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedAccountTypeIndex((i) => Math.min(i + 1, 2));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedAccountTypeIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opts = [
        "lookingForRoom",
        "lookingForRoommate",
        "ownerLookingForRenters",
      ];
      if (focusedAccountTypeIndex >= 0)
        selectAccountType(opts[focusedAccountTypeIndex]);
      selectAccountType(opts[focussedAccountTypeIndex]);
    } else if (e.key === "Escape") {
      setOpenAccountType(false);
      setFocusedAccountTypeIndex(-1);
      accountTypeBtnRef.current?.focus();
    }
  };

  // close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (
        genderListRef.current &&
        !genderListRef.current.contains(e.target) &&
        genderBtnRef.current &&
        !genderBtnRef.current.contains(e.target)
      ) {
        setOpenGender(false);
        setFocusedGenderIndex(-1);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // helper to select
  const selectGender = (val) => {
    setFormData((p) => ({ ...p, gender: val }));
    setOpenGender(false);
    setFocusedGenderIndex(-1);
    genderBtnRef.current?.focus();
  };

  // keyboard when focus is on button
  const handleGenderKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpenGender(true);
      setFocusedGenderIndex(0);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setOpenGender(true);
      setFocusedGenderIndex(2);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpenGender((s) => !s);
    }
  };

  // keyboard inside list
  const handleGenderListKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedGenderIndex((i) => Math.min(i + 1, 2));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedGenderIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const opts = ["Male", "Female", "Other"];
      if (focusedGenderIndex >= 0) selectGender(opts[focusedGenderIndex]);
    } else if (e.key === "Escape") {
      setOpenGender(false);
      setFocusedGenderIndex(-1);
      genderBtnRef.current?.focus();
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validateForm()) return;

    const {
      userName,
      email,
      password,
      age,
      phone,
      gender,
      preferredLocations,
      avatar,
      accountType,
    } = formData;

    const formDataToSend = new FormData();
    formDataToSend.append("userName", userName);
    formDataToSend.append("email", email);
    formDataToSend.append("password", password);
    formDataToSend.append("age", String(age));
    formDataToSend.append("phone", phone || "");
    formDataToSend.append("gender", gender || "");
    formDataToSend.append("accountType", accountType || ""); // NEW

    // Append each location with the correct field name
    (preferredLocations || []).forEach((loc) =>
      formDataToSend.append("preferredLocations", loc)
    );

    if (avatar) {
      formDataToSend.append("avatar", avatar);
    }

    try {
      await dispatch(registerUser(formDataToSend)).unwrap();
      toast.success("Account created successfully!");
      handleClose();
      navigate("/");
    } catch (err) {
      console.log(err);
      setFormError(err || "An unexpected error occurred. Please try again.");
    }
  };

  // Reset and close modal
  const handleClose = () => {
    onClose();
    setFormData({
      userName: "",
      email: "",
      password: "",
      age: "",
      phone: "",
      gender: "",
      preferredLocations: [],
      newLocation: "",
      avatar: null,
      accountType: "", // NEW
    });
    setPreviewAvatar(null);
    setErrors({});
    setFormError("");
    navigate("/");
  };

  useEffect(() => {
    if (user && !loading) navigate("/");
  }, [user, loading, navigate]);

  return (
    <MotionWrapper duration={0.7}>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent
          className="
              sm:max-w-2xl w-[95%] max-h-[90vh] overflow-y-auto 
              scrollbar-hide rounded-2xl border border-border bg-card text-foreground 
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

            {/* Input fields */}
            <div className="space-y-3">
              {/* Full Name */}
              <div>
                <Label htmlFor="userName" className="mb-2">
                  Full Name
                </Label>
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
                <Label htmlFor="email" className="mb-2">
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
                    className="pl-9 border border-input focus:ring-2 focus:ring-primary"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password" className="mb-2">
                  Password
                </Label>
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

              {/* Gender */}
              <div>
                <Label
                  htmlFor="gender"
                  className="text-sm font-normal text-foreground mb-2 block"
                >
                  Gender
                </Label>

                <div className="relative w-full">
                  {/* Venus Icon */}
                  <Venus
                    className="
                        absolute left-3 top-1/2 -translate-y-1/2 
                        text-muted-foreground h-4 w-4 z-10
                        pointer-events-none
                      "
                  />

                  {/* Dropdown Button */}
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={openGender ? "true" : "false"}
                    onClick={() => setOpenGender((s) => !s)}
                    onKeyDown={handleGenderKeyDown}
                    ref={genderBtnRef}
                    className="
                          w-full pl-9 pr-8 h-10 text-sm font-normal text-foreground
                          bg-background border border-input rounded-md
                          flex items-center justify-between gap-2
                          focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
                          transition-all duration-200
                          relative z-0
                           "
                  >
                    <span className="truncate">
                      {formData.gender || "Select gender"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>

                  {/* Options Dropdown */}
                  {openGender && (
                    <ul
                      role="listbox"
                      aria-labelledby="gender"
                      ref={genderListRef}
                      className="
                                absolute z-50 mt-2 w-full bg-card border border-border rounded-md shadow-lg
                                max-h-44 overflow-auto py-1
                              "
                      onKeyDown={handleGenderListKeyDown}
                    >
                      {["Male", "Female", "Other"].map((opt, idx) => {
                        const isSelected = formData.gender === opt;
                        const isFocused = focusedGenderIndex === idx;
                        return (
                          <li
                            key={opt}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={-1}
                            onMouseEnter={() => setFocusedGenderIndex(idx)}
                            onClick={() => selectGender(opt)}
                            className={`
                                    cursor-pointer select-none px-3 py-2 text-sm flex items-center justify-between
                                    transition-colors duration-150
                                    ${
                                      isSelected
                                        ? "bg-primary text-primary-foreground"
                                        : "text-foreground"
                                    }
                                    ${
                                      !isSelected
                                        ? "hover:bg-primary hover:text-primary-foreground"
                                        : ""
                                    }
                                    ${
                                      isFocused && !isSelected
                                        ? "ring-1 ring-primary/30"
                                        : ""
                                    }
                                  `}
                          >
                            <span className="truncate">{opt}</span>
                            {isSelected && (
                              <span className="text-xs opacity-90">✓</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {errors.gender && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.gender}
                  </p>
                )}
              </div>
              {/* Account Type */}
              {/* ACCOUNT TYPE DROPDOWN (Same effects as Gender) */}
              <div>
                <Label
                  htmlFor="accountType"
                  className="text-sm font-normal text-foreground mb-2 block"
                >
                  Select your role
                </Label>

                <div className="relative w-full">
                  {/* Dropdown Button */}
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={openAccountType ? "true" : "false"}
                    onClick={() => setOpenAccountType((s) => !s)}
                    onKeyDown={handleAccountTypeKeyDown}
                    ref={accountTypeBtnRef}
                    className="
        w-full pl-3 pr-8 h-10 text-sm font-normal text-foreground
        bg-background border border-input rounded-md
        flex items-center justify-between gap-2
        focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary
        transition-all duration-200 relative z-0
      "
                  >
                    <span className="truncate">
                      {{
                        lookingForRoom: "Looking for a room",
                        lookingForRoommate: "Looking for a roommate",
                        ownerLookingForRenters: "Owner looking for renters",
                      }[formData.accountType] || "Select an option"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                  </button>

                  {/* Options Dropdown */}
                  {openAccountType && (
                    <ul
                      role="listbox"
                      aria-labelledby="accountType"
                      ref={accountTypeListRef}
                      className="
          absolute z-50 mt-2 w-full bg-card border border-border rounded-md shadow-lg
          max-h-44 overflow-auto py-1
        "
                      onKeyDown={handleAccountTypeListKeyDown}
                    >
                      {[
                        { id: "lookingForRoom", label: "Looking for a room" },
                        {
                          id: "lookingForRoommate",
                          label: "Looking for a roommate",
                        },
                        {
                          id: "ownerLookingForRenters",
                          label: "Owner looking for renters",
                        },
                      ].map((opt, idx) => {
                        const isSelected = formData.accountType === opt.id;
                        const isFocused = focusedAccountTypeIndex === idx;

                        return (
                          <li
                            key={opt.id}
                            role="option"
                            aria-selected={isSelected}
                            tabIndex={-1}
                            onMouseEnter={() => setFocusedAccountTypeIndex(idx)}
                            onClick={() => selectAccountType(opt.id)}
                            className={`
                cursor-pointer select-none px-3 py-2 text-sm flex items-center justify-between
                transition-colors duration-150
                ${
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                }
                ${
                  !isSelected
                    ? "hover:bg-primary hover:text-primary-foreground"
                    : ""
                }
                ${isFocused && !isSelected ? "ring-1 ring-primary/30" : ""}
              `}
                          >
                            <span className="truncate">{opt.label}</span>
                            {isSelected && (
                              <span className="text-xs opacity-90">✓</span>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {errors.accountType && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.accountType}
                  </p>
                )}
              </div>

              {/* Age + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age" className="mb-2">
                    Age
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      placeholder="Enter your age"
                      value={formData.age}
                      onChange={handleChange}
                      className="pl-9 border border-input focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                  {errors.age && (
                    <p className="text-sm text-destructive">{errors.age}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="mb-2">
                    Phone (optional)
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="phone"
                      name="phone"
                      type="number"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      className="pl-9 border border-input focus:ring-2 focus:ring-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Preferred Locations — Only for "Looking for a room" */}
              {formData.accountType === "lookingForRoom" && (
                <div>
                  <Label htmlFor="preferredLocations" className="mb-2">
                    Preferred Locations
                  </Label>

                  <div className="space-y-2">
                    {/* Selected Locations Display */}
                    <div
                      className="
          flex flex-wrap gap-2 border border-input rounded-md p-2 
          focus-within:ring-2 focus-within:ring-primary transition-all duration-300
        "
                    >
                      {formData.preferredLocations.length > 0 &&
                        formData.preferredLocations.map((loc, index) => (
                          <div
                            key={`${loc}-${index}`}
                            className="
                flex items-center gap-2 bg-accent text-accent-foreground
                px-3 py-1 rounded-full text-sm shadow-sm
                hover:bg-accent/90 transition-colors
              "
                          >
                            <span className="truncate max-w-[100px]">
                              {loc}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setFormData((prev) => ({
                                  ...prev,
                                  preferredLocations:
                                    prev.preferredLocations.filter(
                                      (_, i) => i !== index
                                    ),
                                }))
                              }
                              className="hover:text-destructive transition-colors text-xs"
                              aria-label="Remove location"
                            >
                              ✕
                            </button>
                          </div>
                        ))}

                      {/* Input + Add Button */}
                      <div className="flex items-center gap-2 flex-1 min-w-[150px]">
                        <input
                          id="preferredLocations"
                          type="text"
                          placeholder="Add a location..."
                          value={formData.newLocation}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              newLocation: e.target.value,
                            }))
                          }
                          className="
              flex-1 bg-transparent outline-none px-2 py-1 text-sm
              placeholder:text-muted-foreground font-medium
            "
                        />

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="px-4 py-2 text-xs flex items-center gap-1"
                          onClick={() => {
                            const newLoc = formData.newLocation.trim();
                            if (!newLoc) return;

                            if (
                              formData.preferredLocations.some(
                                (loc) =>
                                  loc.toLowerCase() === newLoc.toLowerCase()
                              )
                            ) {
                              toast.error("Location already added!");
                              return;
                            }

                            setFormData((prev) => ({
                              ...prev,
                              preferredLocations: [
                                ...prev.preferredLocations,
                                newLoc,
                              ],
                              newLocation: "",
                            }));
                          }}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    {formData.preferredLocations.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Press ✕ to remove a location.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {formError && (
              <p className="text-sm text-destructive text-center">
                {formError}
              </p>
            )}
            {/* Submit */}
            <Button
              type="submit"
              disabled={loading}
              className="
                    relative flex justify-center items-center w-full 
                    bg-primary hover:bg-accent 
                    text-primary-foreground font-semibold 
                    shadow-lg rounded-md py-2 transition-all duration-300
                    disabled:opacity-80 disabled:cursor-not-allowed
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
                  <span>Creating your account...</span>
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
