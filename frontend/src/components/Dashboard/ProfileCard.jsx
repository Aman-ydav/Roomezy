import { motion } from "framer-motion";
import { User, Users, Home, BadgeCheck, Star, Target } from "lucide-react";

const ProfileCard = ({ user }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.8, rotate: -10 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  const getAccountTypeConfig = () => {
    switch (user?.accountType) {
      case "lookingForRoom":
        return {
          icon: <User className="w-7 h-7" />,
          title: "Room Seeker",
          description: "You're actively looking for a room. Your profile is optimized to help you find perfect living spaces.",
          tag: "Room Search Mode",
          bgColor: "bg-primary/5",
          borderColor: "border-primary/30",
          accentColor: "text-primary",
          badgeColor: "bg-primary/10 text-primary border-primary/20",
          iconBg: "bg-primary/10 border-primary/20",
        };

      case "lookingForRoommate":
        return {
          icon: <Users className="w-7 h-7" />,
          title: "Roommate Finder",
          description: "You're looking for someone to share your space. Connect with compatible roommates.",
          tag: "Roommate Search",
          bgColor: "bg-secondary/5",
          borderColor: "border-secondary/30",
          accentColor: "text-secondary-foreground",
          badgeColor: "bg-secondary/10 text-secondary-foreground border-secondary/20",
          iconBg: "bg-secondary/10 border-secondary/20",
        };

      case "ownerLookingForRenters":
        return {
          icon: <Home className="w-7 h-7" />,
          title: "Property Owner",
          description: "You're listing properties for rent. Manage your listings and connect with potential tenants.",
          tag: "Property Management",
          bgColor: "bg-accent/5",
          borderColor: "border-accent/30",
          accentColor: "text-accent-foreground",
          badgeColor: "bg-accent/10 text-accent-foreground border-accent/20",
          iconBg: "bg-accent/10 border-accent/20",
        };

      default:
        return {
          icon: <User className="w-7 h-7" />,
          title: "General User",
          description: "Complete your profile setup to unlock all features and personalized recommendations.",
          tag: "Setup Required",
          bgColor: "bg-muted/50",
          borderColor: "border-border",
          accentColor: "text-muted-foreground",
          badgeColor: "bg-muted text-muted-foreground border-border",
          iconBg: "bg-muted border-border",
        };
    }
  };

  const {
    icon,
    title,
    description,
    tag,
    bgColor,
    borderColor,
    accentColor,
    badgeColor,
    iconBg
  } = getAccountTypeConfig();

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <motion.div
        className={`
          relative p-8 rounded-2xl border-2 ${borderColor} 
          ${bgColor}
          shadow-lg transition-all duration-300
          overflow-hidden group
        `}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -2 }}
      >
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -translate-y-12 translate-x-12" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white opacity-5 rounded-full translate-y-10 -translate-x-10" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-8">
          {/* Icon Section */}
          <motion.div
            variants={iconVariants}
            initial="hidden"
            animate="visible"
            className={`
              flex items-center justify-center p-5 rounded-2xl
              bg-white shadow-lg border-2 ${borderColor}
              group-hover:scale-105 transition-transform duration-300
              ${iconBg}
            `}
          >
            <div className={`${accentColor}`}>
              {icon}
            </div>
          </motion.div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <h3 className={`text-2xl font-bold ${accentColor}`}>
                  {title}
                </h3>
                <BadgeCheck className={`w-6 h-6 ${accentColor} opacity-80`} />
              </div>
              
              <motion.div
                className={`
                  px-5 py-2.5 rounded-full text-sm font-semibold
                  ${badgeColor} border-2
                  whitespace-nowrap
                `}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1, transition: { delay: 0.3 } }}
                whileHover={{ scale: 1.05 }}
              >
                {tag}
              </motion.div>
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {description}
            </p>

            {/* Features List */}
            <div className="flex flex-wrap gap-6 text-base">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Target className="w-4 h-4" />
                </div>
                <span>Personalized Matches</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <Star className="w-4 h-4" />
                </div>
                <span>Priority Visibility</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className={`p-2 rounded-lg ${iconBg}`}>
                  <User className="w-4 h-4" />
                </div>
                <span>Verified Profile</span>
              </div>
            </div>
          </div>
        </div>

        
      </motion.div>
    </div>
  );
};

export default ProfileCard;