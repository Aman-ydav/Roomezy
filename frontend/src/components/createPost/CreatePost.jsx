import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createPost } from "@/features/post/postSlice";
import Step1Basic from "./Step1Basic";
import Step2Details from "./Step2Details";
import Step3Images from "./Step3Images";
import StepIndicator from "./StepIndicator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BuyCreditsModal from "@/components/ui/BuyCreditsModal";


function ProfileIncompleteModal({ open, onClose, onGoDashboard }) {
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card border border-border rounded-xl p-6 w-full max-w-md text-center shadow-lg"
          >
            <h2 className="text-xl font-semibold text-foreground mb-2">
              Complete Your Profile
            </h2>

            <p className="text-sm text-muted-foreground mb-6">
              Your profile setup is incomplete.  
              Please finish setting up your account before creating a post.
            </p>

            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>

              <Button
                className="bg-primary text-primary-foreground"
                onClick={onGoDashboard}
              >
                Go to Dashboard
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


export default function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creating } = useSelector((s) => s.post);
  const { user } = useSelector((s) => s.auth);

  const isProfileIncomplete = !user || !user.accountType;

  /*  Handle browser back when modal is open */
  useEffect(() => {
    if (!isProfileIncomplete) return;

    window.history.pushState(null, "", window.location.href);
    const handlePop = () => navigate("/", { replace: true });
    window.addEventListener("popstate", handlePop);

    return () => window.removeEventListener("popstate", handlePop);
  }, [isProfileIncomplete, navigate]);


  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [showBuyCredits, setShowBuyCredits] = useState(false);

  const [formData, setFormData] = useState({
    post_type: "room-available",
    post_role: "owner",
    title: "",
    description: "",
    location: "",
    accountType: "",
    rent: "",
    room_type: "",
    badge_type: "empty-room",
    non_smoker: false,
    lgbtq_friendly: false,
    has_cat: false,
    has_dog: false,
    allow_pets: false,
  });

  const [files, setFiles] = useState({
    main_image: null,
    media_files: [],
  });


  useEffect(() => {
    if (!user?.accountType) return;

    if (user.accountType === "lookingForRoom") {
      setFormData((p) => ({
        ...p,
        post_type: "looking-for-room",
        post_role: "room-seeker",
      }));
    }

    if (user.accountType === "lookingForRoommate") {
      setFormData((p) => ({
        ...p,
        post_type: "room-available",
        post_role: "roommate-share",
      }));
    }

    if (user.accountType === "ownerLookingForRenters") {
      setFormData((p) => ({
        ...p,
        post_type: "room-available",
        post_role: "owner",
      }));
    }
  }, [user?.accountType]);

  const nextStep = () => setStep((p) => Math.min(p + 1, 3));
  const prevStep = () => setStep((p) => Math.max(p - 1, 1));

  const validateCurrentStep = () => {
    setError("");

    if (
      step === 1 &&
      (!formData.title.trim() ||
        !formData.description.trim() ||
        !formData.location.trim())
    ) {
      setError("Please fill all required fields before proceeding.");
      return false;
    }

    if (step === 3 && !files.main_image) {
      setError("Main image is required to publish your post.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    try {
      await dispatch(
        createPost({
          ...formData,
          main_image: files.main_image,
          media_files: files.media_files,
        })
      ).unwrap();

      navigate("/dashboard");
    } catch (err) {
      if (err.status === 402 || err.statusCode === 402) {
        setShowBuyCredits(true);
      } else {
        setError(err.message || "Error while creating the post.");
      }
    }
  };


  return (
    <>
      <BuyCreditsModal
        open={showBuyCredits}
        onClose={() => setShowBuyCredits(false)}
        onSuccess={() => {
          setShowBuyCredits(false);
          handleSubmit();
        }}
      />

      <ProfileIncompleteModal
        open={isProfileIncomplete}
        onClose={() => navigate("/", { replace: true })}
        onGoDashboard={() => navigate("/dashboard")}
      />

      <div className="min-h-screen bg-background pt-10 px-0 flex flex-col items-center">
        <div className="max-w-3xl w-full px-7">
          <h1 className="text-3xl font-bold text-center text-foreground mb-6">
            Create Your <span className="text-primary">Roomezy</span> Post
          </h1>

          <StepIndicator step={step} />

          <div className="relative min-h-[420px] mt-6 overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                >
                  <Step1Basic data={formData} setData={setFormData} user={user} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                >
                  <Step2Details data={formData} setData={setFormData} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="s3"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                >
                  <Step3Images
                    files={files}
                    setFiles={setFiles}
                    postType={formData.post_type}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {error && (
            <p className="text-center text-destructive text-sm mt-4">{error}</p>
          )}

          <div className="flex justify-between mt-10">
            <Button variant="outline" onClick={prevStep} disabled={step === 1}>
              Back
            </Button>

            {step < 3 ? (
              <Button onClick={() => validateCurrentStep() && nextStep()}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  "Publish Post"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
