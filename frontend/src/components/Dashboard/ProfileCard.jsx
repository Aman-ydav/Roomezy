import { motion } from "framer-motion";
import { User, Users, Home } from "lucide-react";

const ProfileCard = ({ user }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.2, duration: 0.4 } },
  };

  const getIcon = () => {
    switch (user?.accountType) {
      case "lookingForRoom":
        return <User className="w-9 h-9 text-primary" />;
      case "lookingForRoommate":
        return <Users className="w-9 h-9 text-primary" />;
      case "ownerLookingForRenters":
        return <Home className="w-9 h-9 text-primary" />;
      default:
        return <User className="w-9 h-9 text-primary" />;
    }
  };

  const getContent = () => {
    switch (user?.accountType) {
      case "lookingForRoom":
        return {
          title: "Room Seeker",
          description: "Your account is set to help you find the right room quickly.",
          tag: "Room Request Posts",
        };

      case "lookingForRoommate":
        return {
          title: "Roommate Seeker",
          description: "You're looking for someone to share your place with.",
          tag: "Roommate Needed Posts",
        };

      case "ownerLookingForRenters":
        return {
          title: "Owner - Property Listing",
          description: "You can list your property and connect with verified renters.",
          tag: "Room Listing Posts",
        };

      default:
        return {
          title: "Profile",
          description: "Manage your account and preferences.",
          tag: "General Access",
        };
    }
  };

  const { title, description, tag } = getContent();

  return (
    <div className="max-w-6xl mx-auto mb-10">
      <motion.div
        className="
          p-4 md:p-5 rounded-xl border border-border bg-card
          flex flex-col sm:flex-row items-center sm:justify-between gap-4
          shadow-sm transition-all
          hover:border-primary/30 hover:bg-accent/5
        "
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left: Icon + Details */}
        <div className="flex items-center gap-4 flex-1">
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center justify-center p-3 rounded-lg shrink-0"
          >
            {getIcon()}
          </motion.div>

          <div className="text-center sm:text-left">
            <h3 className="text-lg md:text-xl font-semibold text-foreground">
              {title}
            </h3>

            <p className="text-sm md:text-base text-muted-foreground mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Right: Tag */}
        <motion.div
          className="
            px-3 py-2 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium
            bg-primary/10 text-primary border border-primary/20
            whitespace-nowrap
          "
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.25 } }}
        >
          {tag}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;