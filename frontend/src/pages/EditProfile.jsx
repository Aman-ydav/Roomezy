import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateAccountDetails,
  updateUserAvatar,
  changePassword,
  deleteAccount,
} from "@/features/profile/profileSlice";
import { updateUser } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  User,
  Lock,
  Image,
  Calendar,
  Mail,
  Hash,
} from "lucide-react";

const Section = ({ title, icon: Icon, isOpen, toggle, children, variant }) => (
  <Card
    className={`overflow-hidden transition-all duration-300 border ${
      variant === "danger"
        ? "border-destructive/50 bg-destructive/10"
        : "border-border bg-card"
    }`}
  >
    <button
      onClick={toggle}
      className={`flex w-full items-center justify-between p-4 font-semibold text-lg transition-colors duration-200 ${
        variant === "danger"
          ? "text-destructive hover:bg-destructive/10"
          : "text-foreground hover:bg-muted/30"
      }`}
    >
      <span className="flex items-center gap-2">
        <Icon className="w-5 h-5" />
        {title}
      </span>
      {isOpen ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      )}
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`px-4 pb-6 ${
            variant === "danger" ? "bg-destructive/5" : ""
          }`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </Card>
);

export default function EditProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [preview, setPreview] = useState(user?.avatar || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    age: user?.age || "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      setSelectedFile(file);
    }
  };

  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!selectedFile) {
      setFormError("Please select an image before updating.");
      return;
    }

    try {
      const updatedUser = await dispatch(
        updateUserAvatar(selectedFile)
      ).unwrap();
      dispatch(updateUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Avatar updated successfully.");
      setSelectedFile(null);
    } catch (err) {
      setFormError("Failed to update avatar. Please try again.");
    }
  };

  const validateDetails = () => {
    const newErrors = {};
    if (!formData.userName.trim())
      newErrors.userName = "Full name is required.";
    if (!formData.age) newErrors.age = "Age is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validateDetails()) return;

    try {
      const updatedUser = await dispatch(
        updateAccountDetails(formData)
      ).unwrap();
      dispatch(updateUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Personal details updated successfully.");
    } catch {
      setFormError("Failed to update personal details. Please try again.");
    }
  };

  const validatePassword = () => {
    const newErrors = {};
    if (!passwords.oldPassword.trim())
      newErrors.oldPassword = "Old password is required.";
    if (!passwords.newPassword.trim())
      newErrors.newPassword = "New password is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validatePassword()) return;

    try {
      await dispatch(changePassword(passwords)).unwrap();
      toast.success("Password changed successfully.");
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (e) {
      setFormError(e || "Failed to change password. Please try again.");
    }
  };

  const handleDelete = async () => {
    setFormError("");
    if (confirm("Are you sure you want to permanently delete your account?")) {
      try {
        await dispatch(deleteAccount()).unwrap();
        toast.success("Account deleted permanently.");
      } catch {
        setFormError("Failed to delete account. Please try again.");
      }
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return "Unknown";
    const d = new Date(isoDate);
    return d.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background flex items-center justify-center py-10 px-4"
    >
      <div className="w-full max-w-3xl space-y-5">
        <Card className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6 border border-border bg-card shadow-md">
          <motion.img
            src={preview}
            alt="Profile Avatar"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-28 h-28 rounded-full object-cover border-4 border-accent shadow-md"
          />
          <div className="flex-1 space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              {user?.userName}
            </h2>
            <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-1">
              <Mail className="w-4 h-4 text-accent" /> {user?.email}
            </p>
            <div className="flex flex-wrap gap-4 mt-2 justify-center md:justify-start">
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Hash className="w-4 h-4 text-accent" /> ID:{" "}
                {user?._id?.slice(-6)}
              </span>
              {user?.age && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <User className="w-4 h-4 text-accent" /> Age: {user.age}
                </span>
              )}
              {user?.createdAt && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 text-accent" /> Joined:{" "}
                  {formatDate(user.createdAt)}
                </span>
              )}
            </div>
          </div>
        </Card>

        <h1 className="text-3xl font-bold text-center text-foreground mt-10 mb-4">
          Profile Settings
        </h1>

        <Section
          title="Update Avatar"
          icon={Image}
          isOpen={openSection === "avatar"}
          toggle={() => toggleSection("avatar")}
        >
          <form
            onSubmit={handleAvatarSubmit}
            className="flex flex-col items-center py-4 space-y-4"
          >
            <img
              src={preview}
              alt="Avatar Preview"
              className="w-28 h-28 rounded-full object-cover border-4 border-accent"
            />
            <div className="flex flex-col items-center">
              <label
                htmlFor="avatar"
                className="cursor-pointer text-sm font-medium text-primary hover:underline"
              >
                Choose New Avatar
              </label>
              <input
                id="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarSelect}
              />
            </div>
            {selectedFile && (
              <Button type="submit" className="w-full max-w-xs">
                Update Avatar
              </Button>
            )}
            {formError && (
              <p className="text-destructive text-sm font-medium text-center">
                {formError}
              </p>
            )}
          </form>
        </Section>

        <Section
          title="Personal Details"
          icon={User}
          isOpen={openSection === "details"}
          toggle={() => toggleSection("details")}
        >
          <form onSubmit={handleDetailsSubmit} className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <Input
                type="text"
                value={formData.userName}
                onChange={(e) =>
                  setFormData({ ...formData, userName: e.target.value })
                }
                placeholder="Enter your name"
              />
              {errors.userName && (
                <p className="text-sm text-destructive mt-1">
                  {errors.userName}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
                placeholder="Enter your age"
              />
              {errors.age && (
                <p className="text-sm text-destructive mt-1">{errors.age}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div className="relative group">
              <label className="text-sm font-medium">Email</label>
              <div
                className="
      relative
      cursor-not-allowed
      opacity-80
      rounded-md
      border border-input
      bg-muted/40
      transition-all duration-300
      hover:border-destructive
      hover:bg-destructive/5
      hover:shadow-sm
    "
                style={{ pointerEvents: "auto" }} // ensures hover works on disabled input
              >
                <input
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  disabled
                  className="
                            w-full
                            bg-transparent
                            text-muted-foreground
                            px-3 py-2
                            rounded-md
                            cursor-not-allowed
                            focus:outline-none
                        "
                  onMouseEnter={(e) => (e.target.style.cursor = "not-allowed")}
                />
              </div>
              <p
                className="
                        text-xs text-muted-foreground mt-1
                        transition-colors duration-300
                        group-hover:text-destructive
                        "
              >
                Email cannot be updated.
              </p>
            </div>

            {formError && (
              <p className="text-sm text-destructive text-center">
                {formError}
              </p>
            )}
            <Button type="submit" className="w-full">
              Save Changes
            </Button>
          </form>
        </Section>

        <Section
          title="Change Password"
          icon={Lock}
          isOpen={openSection === "password"}
          toggle={() => toggleSection("password")}
        >
          <form onSubmit={handlePasswordChange} className="space-y-4 mt-4">
            <Input
              type="password"
              placeholder="Old Password"
              value={passwords.oldPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, oldPassword: e.target.value })
              }
            />
            {errors.oldPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.oldPassword}
              </p>
            )}
            <Input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) =>
                setPasswords({ ...passwords, newPassword: e.target.value })
              }
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.newPassword}
              </p>
            )}
            {formError && (
              <p className="text-sm text-destructive text-center">
                {formError}
              </p>
            )}
            <Button type="submit" className="w-full">
              Update Password
            </Button>
          </form>
        </Section>

        <Section
          title="Danger Zone"
          icon={Trash2}
          variant="danger"
          isOpen={openSection === "delete"}
          toggle={() => toggleSection("delete")}
        >
          <div className="space-y-3 mt-3">
            <p className="text-sm text-destructive font-medium">
              Deleting your account is irreversible. All your data will be
              permanently removed.
            </p>
            {formError && (
              <p className="text-sm text-destructive text-center">
                {formError}
              </p>
            )}
            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
            >
              Delete Account Permanently
            </Button>
          </div>
        </Section>
      </div>
    </motion.div>
  );
}
