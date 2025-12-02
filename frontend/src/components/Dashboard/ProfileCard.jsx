import { motion } from "framer-motion";
import { User, Users, Home, BadgeCheck, Star, Target } from "lucide-react";

const ProfileCard = ({ user }) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1, transition: { delay: 0.2 } },
  };

  const COLORS = {
    sky: {
      bgGlow: "bg-sky-500/5",
      border: "border-sky-300",
      ring: "ring-sky-200",
      text: "text-sky-600",
      chipBg: "bg-sky-500/10",
      chipText: "text-sky-700",
      chipBorder: "border-sky-500/30",
    },
    violet: {
      bgGlow: "bg-violet-500/5",
      border: "border-violet-300",
      ring: "ring-violet-200",
      text: "text-violet-600",
      chipBg: "bg-violet-500/10",
      chipText: "text-violet-700",
      chipBorder: "border-violet-500/30",
    },
    emerald: {
      bgGlow: "bg-emerald-500/5",
      border: "border-emerald-300",
      ring: "ring-emerald-200",
      text: "text-emerald-600",
      chipBg: "bg-emerald-500/10",
      chipText: "text-emerald-700",
      chipBorder: "border-emerald-500/30",
    },
    rose: {
      bgGlow: "bg-rose-500/5",
      border: "border-rose-300",
      ring: "ring-rose-200",
      text: "text-rose-600",
      chipBg: "bg-rose-500/10",
      chipText: "text-rose-700",
      chipBorder: "border-rose-500/30",
    },
  };

  const getConfig = () => {
    switch (user?.accountType) {
      case "lookingForRoom":
        return {
          icon: <User className="w-7 h-7" />,
          title: "Room Seeker",
          desc: "You're actively looking for a room. Your recommendations will be personalized for space discovery.",
          tag: "Looking for Room",
          palette: COLORS.sky,
        };

      case "lookingForRoommate":
        return {
          icon: <Users className="w-7 h-7" />,
          title: "Roommate Finder",
          desc: "You're searching for someone compatible to share your space.",
          tag: "Looking for Roommate",
          palette: COLORS.violet,
        };

      case "ownerLookingForRenters":
        return {
          icon: <Home className="w-7 h-7" />,
          title: "Property Owner",
          desc: "You're renting out spaces. Manage listings and engage with tenants.",
          tag: "Owner Account",
          palette: COLORS.emerald,
        };

      default:
        return {
          icon: <User className="w-7 h-7" />,
          title: "General User",
          desc: "Complete your profile setup to unlock full features.",
          tag: "Setup Required",
          palette: COLORS.rose,
        };
    }
  };

  const { icon, title, desc, tag, palette } = getConfig();

  return (
    <div className="max-w-6xl mx-auto mb-8">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className={`relative p-8 rounded-2xl border shadow-md bg-card border-border`}
      >
        {/* Glow background */}
        <div className={`absolute inset-0 rounded-2xl pointer-events-none ${palette.bgGlow}`} />

        <div className="relative flex flex-col lg:flex-row items-start gap-8">
          
          {/* ICON BOX */}
          <motion.div
            variants={iconVariants}
            className={`p-5 rounded-2xl border shadow-sm bg-white dark:bg-card flex items-center justify-center ${palette.border} ring-1 ${palette.ring}`}
          >
            <div className={palette.text}>{icon}</div>
          </motion.div>

          {/* RIGHT SECTION */}
          <div className="flex-1 min-w-0">
            
            {/* HEADER */}
            <div className="flex flex-col lg:flex-row justify-between mb-5 gap-4">
              <div className="flex items-center gap-3">
                <h3 className={`text-2xl font-bold ${palette.text}`}>{title}</h3>
                <BadgeCheck className={`w-6 h-6 ${palette.text}`} />
              </div>

              <div
                className={`px-4 py-2 rounded-full text-sm font-semibold border whitespace-nowrap ${palette.chipBg} ${palette.chipText} ${palette.chipBorder}`}
              >
                {tag}
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">{desc}</p>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-6">
              {[
                { icon: <Target className="w-4 h-4" />, text: "Personalized Matches" },
                { icon: <Star className="w-4 h-4" />, text: "Priority Visibility" },
                { icon: <User className="w-4 h-4" />, text: "Verified Profile" },
              ].map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-muted-foreground">
                  <div className={`p-2 rounded-lg ${palette.chipBg}`}>{f.icon}</div>
                  {f.text}
                </div>
              ))}
            </div>

          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileCard;
