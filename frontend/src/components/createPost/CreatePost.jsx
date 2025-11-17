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

export default function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { creating } = useSelector((s) => s.post);
  const { user } = useSelector((s) => s.auth); // ⭐ GET LOGGED-IN USER

  const [step, setStep] = useState(1);
  const [error, setError] = useState("");

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
      setFormData((prev) => ({
        ...prev,
        post_type: "looking-for-room",
        post_role: "room-seeker",
      }));
    }

    if (user.accountType === "lookingForRoommate") {
      setFormData((prev) => ({
        ...prev,
        post_type: "room-available",
        post_role: "roommate-share",
      }));
    }

    if (user.accountType === "ownerLookingForRenters") {
      setFormData((prev) => ({
        ...prev,
        post_type: "room-available",
        post_role: "owner",
      }));
    }
  }, [user?.accountType]);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const validateCurrentStep = () => {
    setError("");

    if (step === 1) {
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        !formData.location.trim()
      ) {
        setError("Please fill all required fields before proceeding.");
        return false;
      }
    }

    if (step === 3 && !files.main_image) {
      setError("Main image is required to publish your post.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

  
    if (user.accountType === "lookingForRoom") {
      formData.post_type = "looking-for-room";
      formData.post_role = "room-seeker";
    }

    if (user.accountType === "lookingForRoommate") {
      formData.post_type = "room-available";
      formData.post_role = "roommate-share";
    }

    if (user.accountType === "ownerLookingForRenters") {
      formData.post_type = "room-available";
      formData.post_role = "owner";
    }

    try {
      const payload = {
        ...formData,
        main_image: files.main_image,
        media_files: files.media_files,
      };

      await dispatch(createPost(payload)).unwrap();
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Error while creating the post.");
    }
  };

  return (
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
                key="step1"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.3 }}
              >
                <Step1Basic data={formData} setData={setFormData} user={user} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <Step2Details data={formData} setData={setFormData} />
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.3 }}
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
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center text-destructive font-medium text-sm mt-4"
          >
            {error}
          </motion.p>
        )}

        <div className="flex justify-between mt-10 mb-25">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="px-6"
          >
            Back
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => validateCurrentStep() && nextStep()}
              className="px-6 bg-primary text-primary-foreground"
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={creating}
              className="px-6 bg-primary text-primary-foreground flex items-center gap-2"
            >
              {creating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6,
                      ease: "linear",
                    }}
                  >
                    <Loader2 className="w-4 h-4 text-primary-foreground" />
                  </motion.div>
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
  );
}
