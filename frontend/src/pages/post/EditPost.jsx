import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  getPostById,
  updatePostBasic,
  updatePostPreferences,
  updatePostImages,
  deletePost,
} from "@/features/post/postSlice";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Settings,
  Image,
  Trash2,
  ChevronUp,
  ChevronDown,
  Loader2, // 🌀 Added spinner icon
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

const Section = ({ title, icon: Icon, isOpen, toggle, variant, children }) => (
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

export default function EditPost() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedPost, updatingBasic, updatingPreferences, updatingImages, deleting } =
    useSelector((state) => state.post);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    rent: "",
    room_type: "",
    non_smoker: false,
    lgbtq_friendly: false,
    has_cat: false,
    has_dog: false,
    allow_pets: false,
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  const [openSection, setOpenSection] = useState("basic");
  const toggleSection = (section) => setOpenSection(openSection === section ? null : section);

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedPost && selectedPost._id === id) {
      setForm({
        title: selectedPost.title || "",
        description: selectedPost.description || "",
        location: selectedPost.location || "",
        rent: selectedPost.rent || "",
        room_type: selectedPost.room_type || "",
        non_smoker: selectedPost.non_smoker || false,
        lgbtq_friendly: selectedPost.lgbtq_friendly || false,
        has_cat: selectedPost.has_cat || false,
        has_dog: selectedPost.has_dog || false,
        allow_pets: selectedPost.allow_pets || false,
      });

      setMainPreview(selectedPost.main_image || null);
      setMediaPreviews(selectedPost.additional_images || []);
    }
  }, [selectedPost, id]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImage(file);
      setMainPreview(URL.createObjectURL(file));
    }
  };

  const handleMediaFilesChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 3);
    setMediaFiles(files);
    setMediaPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const handleUpdateBasic = async () => {
    const updatedData = {
      title: form.title,
      description: form.description,
      location: form.location,
      rent: form.rent,
      room_type: form.room_type,
    };

    try {
      await dispatch(updatePostBasic({ id, updatedData })).unwrap();
      toast.success("Basic information updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update basic information.");
    }
  };

  const handleUpdatePreferences = async () => {
    const updatedData = {
      non_smoker: form.non_smoker,
      lgbtq_friendly: form.lgbtq_friendly,
      has_cat: form.has_cat,
      has_dog: form.has_dog,
      allow_pets: form.allow_pets,
    };

    try {
      await dispatch(updatePostPreferences({ id, updatedData })).unwrap();
      toast.success("Preferences updated successfully!");
    } catch (err) {
      toast.error(err || "Failed to update preferences.");
    }
  };

  const handleUpdateImages = async () => {
    const updatedData = {};
    if (mainImage) updatedData.main_image = mainImage;
    if (mediaFiles.length > 0) updatedData.media_files = mediaFiles;

    try {
      await dispatch(updatePostImages({ id, updatedData })).unwrap();
      toast.success("Images updated successfully!");
      setMainPreview(mainImage ? URL.createObjectURL(mainImage) : selectedPost.main_image);
      setMediaPreviews(
        mediaFiles.length > 0
          ? mediaFiles.map((f) => URL.createObjectURL(f))
          : selectedPost.additional_images
      );
    } catch (err) {
      toast.error(err || "Failed to update images.");
    }
  };

  const handleDeletePost = async () => {
    try {
      await dispatch(deletePost(id)).unwrap();
      navigate("/my-posts");
    } catch (err) {
      toast.error(err || "Failed to delete post.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background flex items-center justify-center py-10 px-4"
    >
      <div className="w-full max-w-3xl space-y-5">
        {/* Header Card */}
        <Card className="p-6 text-center border border-border bg-card shadow-md">
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-sm text-muted-foreground mt-2">
            Update your post details below
          </p>
        </Card>

        {/* Basic Information */}
        <Section
          title="Basic Information"
          icon={FileText}
          isOpen={openSection === "basic"}
          toggle={() => toggleSection("basic")}
        >
          <div className="space-y-4 mt-4">
            <div>
              <Label>Title</Label>
              <Input type="text" name="title" value={form.title} onChange={handleChange} required />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                name="description"
                rows="4"
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label>Rent (₹)</Label>
              <Input type="number" name="rent" value={form.rent} onChange={handleChange} />
            </div>

            <div>
              <Label>Room Type</Label>
              <Input type="text" name="room_type" value={form.room_type} onChange={handleChange} />
            </div>

            <Button onClick={handleUpdateBasic} disabled={updatingBasic} className="w-full">
              {updatingBasic ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                "Update Basic Information"
              )}
            </Button>
          </div>
        </Section>

        {/* Preferences */}
        <Section
          title="Preferences"
          icon={Settings}
          isOpen={openSection === "preferences"}
          toggle={() => toggleSection("preferences")}
        >
          <div className="grid sm:grid-cols-2 gap-3 mt-4">
            {["non_smoker", "lgbtq_friendly", "has_cat", "has_dog", "allow_pets"].map((pref) => (
              <label key={pref} className="flex items-center gap-2 text-sm capitalize">
                <input
                  type="checkbox"
                  name={pref}
                  checked={form[pref]}
                  onChange={handleChange}
                  className="w-4 h-4"
                />
                {pref.replaceAll("_", " ")}
              </label>
            ))}
          </div>

          <div className="mt-4">
            <Button onClick={handleUpdatePreferences} disabled={updatingPreferences} className="w-full">
              {updatingPreferences ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating...
                </>
              ) : (
                "Update Preferences"
              )}
            </Button>
          </div>
        </Section>

        {/* Images */}
        <Section
          title="Images"
          icon={Image}
          isOpen={openSection === "images"}
          toggle={() => toggleSection("images")}
        >
          <div className="space-y-4 mt-4">
            <div>
              <Label>Main Image</Label>
              {mainPreview && (
                <img
                  src={mainPreview}
                  alt="Main preview"
                  className="w-full max-h-48 object-cover rounded-md mb-2"
                />
              )}
              <Input type="file" accept="image/*" onChange={handleMainImageChange} />
            </div>

            <div>
              <Label>Additional Images (up to 3)</Label>
              {mediaPreviews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {mediaPreviews.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`media-${i}`}
                      className="w-20 h-20 rounded-md object-cover"
                    />
                  ))}
                </div>
              )}
              <Input type="file" multiple accept="image/*" onChange={handleMediaFilesChange} />
            </div>

            <div className="space-y-1">
              <Button onClick={handleUpdateImages} disabled={updatingImages} className="w-full">
                {updatingImages ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Updating Images...
                  </>
                ) : (
                  "Update Images"
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-1">
                Image updates may take a while to reflect.
              </p>
            </div>
          </div>
        </Section>

        {/* Danger Zone */}
        <Section
          title="Danger Zone"
          icon={Trash2}
          variant="danger"
          isOpen={openSection === "delete"}
          toggle={() => toggleSection("delete")}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" disabled={deleting}>
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                  </>
                ) : (
                  "Delete Post Permanently"
                )}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border border-border bg-card text-foreground">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-destructive font-bold">
                  Are you absolutely sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-muted-foreground">
                  This action <strong>cannot be undone.</strong> It will permanently delete your post
                  and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeletePost}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Deleting...
                    </>
                  ) : (
                    "Yes, Delete"
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Section>
      </div>
    </motion.div>
  );
}
