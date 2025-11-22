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
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  User,
  Lock,
  Image,
  Calendar,
  Mail,
  Phone,
  Venus,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Loader from "@/components/ui/Loader";

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
      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
    </button>

    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className={`px-4 pb-6 ${variant === "danger" ? "bg-destructive/5" : ""}`}
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
  const navigate = useNavigate();

  const [preview, setPreview] = useState(user?.avatar || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState({});

  // ✅ Loader states
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [formData, setFormData] = useState({
    userName: user?.userName || "",
    age: user?.age || "",
    gender: user?.gender || "",
    preferredLocations: user?.preferredLocations || [],
    newLocation: "",
  });

  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [openSection, setOpenSection] = useState(null);
  const toggleSection = (section) =>
    setOpenSection(openSection === section ? null : section);

  // Avatar Selection
  const handleAvatarSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setPreview(previewURL);
      setSelectedFile(file);
    }
  };

  // ✅ Update Avatar
  const handleAvatarSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!selectedFile) {
      setFormError("Please select an image before updating.");
      return;
    }

    setLoadingAvatar(true);
    try {
      const updatedUser = await dispatch(updateUserAvatar(selectedFile)).unwrap();
      dispatch(updateUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setSelectedFile(null);
    } catch {
      setFormError("Failed to update avatar. Please try again.");
    } finally {
      setLoadingAvatar(false);
    }
  };

  // Validate Personal Info
  const validateDetails = () => {
    const newErrors = {};
    if (!formData.userName.trim()) newErrors.userName = "Full name is required.";
    if (!formData.age) newErrors.age = "Age is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Update Account Details
  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!validateDetails()) return;

    setLoadingDetails(true);
    try {
      const updatedUser = await dispatch(updateAccountDetails(formData)).unwrap();
      dispatch(updateUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch {
      setFormError("Failed to update details. Please try again.");
    } finally {
      setLoadingDetails(false);
    }
  };

  // ✅ Change Password
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

    setLoadingPassword(true);
    try {
      await dispatch(changePassword(passwords)).unwrap();
      setPasswords({ oldPassword: "", newPassword: "" });
    } catch (e) {
      setFormError(e || "Failed to change password. Please try again.");
    } finally {
      setLoadingPassword(false);
    }
  };

  // Format Date
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
      className="min-h-screen bg-background flex items-center justify-center py-10 px-4 "
    >
      <div className="w-full max-w-3xl space-y-5">
        {/* Header Card */}
        <Card className="p-6 flex flex-col md:flex-row items-center gap-6 border border-border bg-card shadow-md">
          {preview ? (
            <motion.img
              src={preview}
              alt="Profile Avatar"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="w-28 h-28 rounded-full object-cover border-4 border-accent shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-full border-4 border-accent bg-accent/10 flex items-center justify-center text-3xl font-bold text-accent shadow-md">
              {user?.userName?.[0]?.toUpperCase() || "U"}
            </div>
          )}

          <div className="flex-1 space-y-3 text-center md:text-left">
            <h2 className="text-2xl font-bold text-foreground">{user?.userName}</h2>
            <p className="text-sm text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-accent" /> {user?.email}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {user?.age && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-md px-3 py-2">
                  <User className="w-4 h-4 text-accent" />
                  <span>Age: {user.age}</span>
                </div>
              )}
              {user?.gender && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-md px-3 py-2">
                  <Venus className="w-4 h-4 text-accent" />
                  <span>Gender: {user.gender}</span>
                </div>
              )}
              {user?.createdAt && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border rounded-md px-3 py-2">
                  <Calendar className="w-4 h-4 text-accent" />
                  <span>Joined: {formatDate(user.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        <h1 className="text-3xl font-bold text-center text-foreground mt-10 mb-4">
          Profile Settings
        </h1>

        {/* Avatar Update */}
        <Section
          title="Update Avatar"
          icon={Image}
          isOpen={openSection === "avatar"}
          toggle={() => toggleSection("avatar")}
        >
          <form onSubmit={handleAvatarSubmit} className="flex flex-col items-center py-4 space-y-4">
            {preview && (
              <img src={preview} alt="Avatar" className="w-28 h-28 rounded-full object-cover border-4 border-accent" />
            )}
            <label htmlFor="avatar" className="cursor-pointer text-sm font-medium text-primary hover:underline">
              Choose New Avatar
            </label>
            <input id="avatar" type="file" accept="image/*" className="hidden" onChange={handleAvatarSelect} />

            {selectedFile && (
              <Button type="submit" className="w-full max-w-xs" disabled={loadingAvatar}>
                {loadingAvatar ? <Loader text="Updating avatar..." /> : "Update Avatar"}
              </Button>
            )}
            {formError && <p className="text-destructive text-sm font-medium text-center">{formError}</p>}
          </form>
        </Section>

        {/* Personal Details */}
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
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Age</label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full border border-input rounded-md px-3 py-2 bg-background text-foreground text-sm focus:ring-1 focus:ring-primary"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <Button type="submit" className="w-full" disabled={loadingDetails}>
              {loadingDetails ? <Loader text="Saving changes..." /> : "Save Changes"}
            </Button>
          </form>
        </Section>

        {/* Password Change */}
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
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            />
            <Input
              type="password"
              placeholder="New Password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
            <Button type="submit" className="w-full" disabled={loadingPassword}>
              {loadingPassword ? <Loader text="Updating password..." /> : "Update Password"}
            </Button>
          </form>
        </Section>

        {/* Delete Account */}
        <Section
          title="Danger Zone"
          icon={Trash2}
          variant="danger"
          isOpen={openSection === "delete"}
          toggle={() => toggleSection("delete")}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={loadingDelete}>
                {loadingDelete ? <Loader text="Deleting..." /> : "Delete Account Permanently"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-border bg-card text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive font-bold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action <strong>cannot be undone.</strong> It will permanently delete your account and all your data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setFormError("");
                    setLoadingDelete(true);
                    try {
                      await dispatch(deleteAccount()).unwrap();
                      localStorage.removeItem("user");
                      dispatch(updateUser(null));
                      navigate("/login");
                    } catch {
                      setFormError("Failed to delete account. Please try again.");
                    } finally {
                      setLoadingDelete(false);
                    }
                  }}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  {loadingDelete ? <Loader text="Deleting..." /> : "Yes, Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>
      </div>
    </motion.div>
  );
}
