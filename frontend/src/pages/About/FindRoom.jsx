import React from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { ChevronDown, Home, User, Users, MessageCircle, Search, CheckCircle } from "lucide-react";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Link } from "react-router-dom";

export default function FindRoom() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });


  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const badgeData = [
    {
      type: "empty-room",
      label: "Room Available",
      color: "bg-emerald-500/90 hover:bg-emerald-600/90",
      icon: Home,
      desc: "Posted by owners who have a room to rent. These posts help you find actual rooms.",
      howTo: "These are direct room listings by owners. They include rent, location, photos, and amenities. This is your primary source for finding available rooms.",
    },
    {
      type: "roommate-share",
      label: "Looking for Roommate",
      color: "bg-violet-500/90 hover:bg-violet-600/90",
      icon: Users,
      desc: "Posted by people who already have a room and want someone to share rent with.",
      howTo: "These posts help you join a shared room setup with someone already living there. Perfect for budget-friendly options and building instant connections.",
    },
    {
      type: "looking-for-room",
      label: "Looking for Room",
      color: "bg-sky-500/90 hover:bg-sky-600/90",
      icon: User,
      desc: "Posted by room seekers who need a room. Owners and roommate-seekers can contact them.",
      howTo: "These are posted by other people who are also searching. They do NOT list rooms — they're meant for owners & roommates to contact them if they have availability.",
    },
  ];

  return (
    <>
      <motion.div
        className="min-h-screen bg-background text-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          style={{ y: smoothY, opacity }}
          className="fixed inset-0 bg-linear-to-br from-primary/15 via-accent/10 to-secondary/15 -z-10"
        />

        <motion.header
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center py-16 px-4 relative"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-4"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4 leading-tight">
              How to Find a Room on Roomezy
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Roomezy uses three simple post types. Understanding them helps you quickly find 
              a room, a roommate, or connect with someone who wants your room.
            </p>
          </motion.div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="mt-8"
          >
            <ChevronDown className="w-8 h-8 text-primary mx-auto" />
          </motion.div>

          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-10 right-10 w-20 h-20 bg-accent/20 rounded-full blur-xl -z-10 hidden md:block"
          />
        </motion.header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pb-20 space-y-24">
          
          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.div custom={0}>
              <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-3 mb-4">
                <Home className="w-8 h-8 text-primary" /> Understand Post Types
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Roomezy has <strong className="text-primary">three badges</strong>. Each badge tells you exactly what the post is about 
                and who created it. This helps you know whether the post is relevant to you.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {badgeData.map((badge, index) => (
                <motion.div
                  key={badge.type}
                  custom={index + 1}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="p-6 border rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300 text-center group relative overflow-hidden"
                >
                  <div className="absolute top-4 left-4 z-10">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm shadow-md ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  <motion.div
                    className="w-14 h-14 bg-primary rounded-full mx-auto flex items-center justify-center mb-4 group-hover:scale-110 transition-transform relative z-0"
                    whileHover={{ rotate: index % 2 === 0 ? 10 : -10 }}
                  >
                    <badge.icon className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold mb-3">{badge.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {badge.desc}
                  </p>
                  <motion.div
                    className="mt-4 flex justify-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.div  custom={4}>
              <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-3 mb-4">
                <Search className="w-8 h-8 text-primary" /> How You Can Find a Room
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Follow these steps to efficiently find the right room for you.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="space-y-6"
            >
              {badgeData.map((badge, index) => (
                <motion.div
                  key={badge.type}
                  custom={index + 5}
                  className="flex items-start gap-4 p-4 border rounded-lg bg-card shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mt-1 shrink-0 ${badge.color.replace('/90', '').replace('hover:', '')}`}>
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                      {index + 1}. Look for "{badge.label}" Posts
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold text-white ${badge.color}`}>
                        {badge.label}
                      </span>
                    </h4>
                    <p className="text-muted-foreground leading-relaxed">
                      {badge.howTo}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          <motion.section
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-8"
          >
            <motion.div custom={8}>
              <h2 className="text-3xl md:text-4xl font-semibold flex items-center gap-3 mb-4">
                <MessageCircle className="w-8 h-8 text-primary" /> Contact & Connect
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Once you find a suitable room or roommate, reach out politely.  
                Ask important details and schedule a viewing to ensure it's the right fit.
              </p>
            </motion.div>

            <motion.div
              custom={9}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="p-6 border rounded-xl bg-linear-to-r from-card to-muted/20 shadow-lg"
            >
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                Example Message
              </h4>
              <p className="text-muted-foreground italic leading-relaxed">
                "Hi! I’m interested in your room listing. Is it still available? Can we talk about the details and schedule a viewing?"
              </p>
            </motion.div>

            <motion.div
              custom={10}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="p-4 border rounded-lg bg-card shadow-sm">
                <h4 className="font-semibold mb-2">💡 Tip: Be Specific</h4>
                <p className="text-sm text-muted-foreground">
                  Mention your move-in date, budget, and any preferences in your message.
                </p>
              </div>
              <div className="p-4 border rounded-lg bg-card shadow-sm">
                <h4 className="font-semibold mb-2">⚡ Tip: Act Fast</h4>
                <p className="text-sm text-muted-foreground">
                  Popular rooms get taken quickly. Respond promptly to secure your spot.
                </p>
              </div>
            </motion.div>
          </motion.section>
        </div>

        <motion.footer
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center py-20 bg-background text-primary relative overflow-hidden"
        >
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 opacity-10 "
          />

          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Room?</h2>
            <p className="mb-8 text-lg opacity-90 max-w-2xl mx-auto">
              Go back to the homepage and browse real room listings. Start your search today!
            </p>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 1.01 }}
            >
              <Link
                to="/"
                className="bg-primary text-background px-8 py-4 rounded-xl font-semibold text-lg inline-flex items-center gap-2 hover:bg-accent/90 transition-colors shadow-lg"
              >
                Go to Home 
              </Link>
            </motion.div>
          </div>
        </motion.footer>

        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="fixed top-1/4 left-10 w-16 h-16 bg-accent/20 rounded-full blur-2xl -z-10"
        />
        <motion.div
          animate={{
            x: [0, -15, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="fixed bottom-1/4 right-10 w-20 h-20 bg-primary/20 rounded-full blur-2xl -z-10"
        />
      </motion.div>

      <ScrollToTop />
      <Footer />
    </>
  );
}
