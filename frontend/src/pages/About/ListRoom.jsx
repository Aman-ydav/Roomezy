import React, { useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ChevronDown,
  Home,
  User,
  Image,
  CheckCircle,
  ArrowRight,
  Star,
  MapPin,
  DollarSign,
  Info,
  HelpCircle,
} from "lucide-react";
import StepIndicator from "@/components/createPost/StepIndicator";
import Step1Basic from "@/components/createPost/Step1Basic";
import Step3Images from "@/components/createPost/Step3Images";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import { Link } from "react-router-dom";

const mockData = {
  post_type: "room-available",
  post_role: "owner",
  title: "Spacious 2BHK near city center",
  description:
    "Fully furnished, air conditioned, high-speed Wi-Fi, power backup, RO water.",
  location: "Delhi",
  rent: 15000,
};

const mockFiles = {
  main_image: null,
  media_files: [],
};

export default function ListRoom() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHeader = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);
  const scaleHeader = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  const [expandedTip, setExpandedTip] = useState(null);

  const toggleTip = (id) => {
    setExpandedTip(expandedTip === id ? null : id);
  };

  const steps = [
    {
      id: 1,
      title: "Basic Information",
      description:
        "Start by providing essential details about your room or your search. This includes the type of post, your role, a catchy title, and a detailed description to attract potential roommates or tenants.",
      icon: Home,
      diagram: (
        <motion.svg
          width="200"
          height="150"
          viewBox="0 0 200 150"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto"
        >
          <rect
            x="50"
            y="50"
            width="100"
            height="60"
            fill="var(--primary)"
            rx="10"
          />
          <polygon points="50,50 100,20 150,50" fill="var(--accent)" />
          <circle cx="80" cy="80" r="5" fill="var(--foreground)" />
          <circle cx="120" cy="80" r="5" fill="var(--foreground)" />
          <text
            x="100"
            y="130"
            textAnchor="middle"
            fill="var(--foreground)"
            fontSize="12"
          >
            Your Room
          </text>
        </motion.svg>
      ),
      example: <Step1Basic data={mockData} setData={() => {}} />,
      tips: [
        {
          id: "tip1",
          title: "Choose the right post type",
          content:
            "Select 'I have a room to offer' if you're listing a room, or 'I'm looking for a room' if you're searching.",
        },
        {
          id: "tip2",
          title: "Craft a compelling title",
          content:
            "Make it descriptive and include key features like size, location, or amenities to stand out.",
        },
        {
          id: "tip3",
          title: "Be detailed in description",
          content:
            "Mention everything from furniture to rules to help users decide quickly.",
        },
      ],
    },
    {
      id: 2,
      title: "Details & Preferences",
      description:
        "Add more specifics like amenities, rules, and what you're looking for. This step helps filter matches and provides clarity on expectations, reducing misunderstandings.",
      icon: User,
      diagram: (
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex justify-center items-center space-x-4"
        >
          <div className="flex flex-col items-center">
            <Star className="w-8 h-8 text-primary" />
            <span className="text-xs mt-1">Amenities</span>
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
          <div className="flex flex-col items-center">
            <MapPin className="w-8 h-8 text-accent" />
            <span className="text-xs mt-1">Location</span>
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
          <div className="flex flex-col items-center">
            <DollarSign className="w-8 h-8 text-success" />
            <span className="text-xs mt-1">Rent</span>
          </div>
        </motion.div>
      ),
      example: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Example: Fully furnished room with Wi-Fi and parking.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card p-4 rounded-lg border"
          >
            <h4 className="font-semibold">Sample Details</h4>
            <ul className="list-disc list-inside text-sm mt-2">
              <li>Air-conditioned</li>
              <li>Power backup</li>
              <li>RO water</li>
              <li>Near metro station</li>
            </ul>
          </motion.div>
        </div>
      ),
      tips: [
        {
          id: "tip4",
          title: "Highlight key amenities",
          content:
            "List things like Wi-Fi, parking, or appliances to appeal to more users.",
        },
        {
          id: "tip5",
          title: "Set clear rules",
          content:
            "Mention pet policies, smoking rules, or guest allowances upfront.",
        },
        {
          id: "tip6",
          title: "Specify preferences",
          content:
            "If looking for a roommate, note gender, occupation, or lifestyle preferences.",
        },
      ],
    },
    {
      id: 3,
      title: "Images & Verification",
      description:
        "Upload photos to showcase your room and build trust. High-quality images increase engagement and help users visualize the space, while verification adds credibility.",
      icon: Image,
      diagram: (
        <motion.div
          initial={{ opacity: 0, rotateY: 90 }}
          whileInView={{ opacity: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-2 gap-2 mx-auto w-32"
        >
          <div className="w-12 h-12 bg-primary rounded-md"></div>
          <div className="w-12 h-12 bg-accent rounded-md"></div>
          <div className="w-12 h-12 bg-secondary rounded-md"></div>
          <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-success" />
          </div>
        </motion.div>
      ),
      example: (
        <Step3Images
          files={mockFiles}
          setFiles={() => {}}
          postType="room-available"
        />
      ),
      tips: [
        {
          id: "tip7",
          title: "Use clear, well-lit photos",
          content: "Avoid blurry images; show the room from multiple angles.",
        },
        {
          id: "tip8",
          title: "Include facility shots",
          content:
            "Add photos of kitchen, bathroom, or common areas for room owners.",
        },
        {
          id: "tip9",
          title: "Verify your identity",
          content:
            "Upload a photo of yourself if seeking a room to build trust.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <motion.div
        style={{ y: smoothY }}
        className="fixed inset-0 bg-linear-to-br from-primary/10 via-accent/5 to-secondary/10 -z-10"
      />

      <motion.header
        style={{ opacity: opacityHeader, scale: scaleHeader }}
        className="text-center py-16 px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
          How to List Your Room
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Follow these simple steps to create an attractive listing that gets
          responses. We'll guide you with examples, visuals, and helpful tips.
        </p>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="mt-8"
        >
          <ChevronDown className="w-8 h-8 text-primary mx-auto" />
        </motion.div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <StepIndicator step={1} /> {/* Assuming current step is 1 for demo */}
        {steps.map((step, index) => (
          <motion.section
            key={step.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            className="mb-5"
          >
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <motion.div
                style={{
                  x: useTransform(
                    scrollYProgress,
                    [0.1 + index * 0.1, 0.2 + index * 0.1],
                    [-20, 0]
                  ),
                }}
              >
                <div className="flex items-center mb-4">
                  <step.icon className="w-8 h-8 text-primary mr-3" />
                  <h2 className="text-2xl font-semibold">{step.title}</h2>
                </div>
                <p className="text-muted-foreground mb-6">{step.description}</p>
                <div className="mb-6">{step.diagram}</div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center">
                    <HelpCircle className="w-5 h-5 mr-2 text-accent" />
                    Helpful Tips
                  </h3>
                  {step.tips.map((tip, tipIndex) => (
                    <motion.div
                      key={tip.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: tipIndex * 0.1 }}
                      viewport={{ once: true }}
                      className="border border-border rounded-lg p-3"
                    >
                      <button
                        onClick={() => toggleTip(tip.id)}
                        className="flex items-center justify-between w-full text-left"
                      >
                        <span className="font-medium text-sm">{tip.title}</span>
                        <Info className="w-4 h-4 text-muted-foreground" />
                      </button>
                      {expandedTip === tip.id && (
                        <motion.p
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="text-xs text-muted-foreground mt-2 overflow-hidden"
                        >
                          {tip.content}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                style={{
                  y: useTransform(
                    scrollYProgress,
                    [0.2 + index * 0.1, 0.3 + index * 0.1],
                    [20, 0]
                  ),
                }}
                className="bg-card p-6 rounded-lg border shadow-lg"
              >
                <h3 className="text-lg font-medium mb-4">Example</h3>
                {step.example}
              </motion.div>
            </div>
          </motion.section>
        ))}
      </div>

      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center pb-10 bg-background text-primary"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to List Your Room?</h2>
        <p className="mb-8">
          Start creating your listing now and find the perfect match.
        </p>
        <Link to="/create-post">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 1.01 }}
          className="bg-primary text-accent-foreground px-8 py-3 rounded-lg font-semibold cursor-pointer"
        >
           Get Started
        </motion.button>
        </Link>     
         </motion.footer>

      <Footer />

      <motion.div
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
        }}
        style={{
          x: useTransform(scrollYProgress, [0, 1], [0, 50]),
          y: useTransform(scrollYProgress, [0, 1], [0, -25]),
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed top-20 left-10 w-16 h-16 bg-accent/20 rounded-full blur-xl -z-10"
      />
      <motion.div
        animate={{
          x: [0, -15, 0],
          y: [0, 15, 0],
        }}
        style={{
          x: useTransform(scrollYProgress, [0, 1], [0, -50]),
          y: useTransform(scrollYProgress, [0, 1], [0, 25]),
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed bottom-20 right-10 w-20 h-20 bg-primary/20 rounded-full blur-xl -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        style={{
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1]),
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed top-1/2 left-1/4 w-12 h-12 bg-secondary/30 rounded-full blur-lg -z-10"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.8, 0.3],
        }}
        style={{
          scale: useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.4, 1]),
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="fixed bottom-1/3 right-1/4 w-14 h-14 bg-trust/20 rounded-full blur-lg -z-10"
      />
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            x: useTransform(
              scrollYProgress,
              [0, 1],
              [Math.random() * 200 - 100, Math.random() * 200 - 100]
            ),
            y: useTransform(
              scrollYProgress,
              [0, 1],
              [Math.random() * 200 - 100, Math.random() * 200 - 100]
            ),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0]),
          }}
          className={`fixed w-1 h-1 bg-primary/30 rounded-full blur-sm -z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
      <div>
        <ScrollToTop />
      </div>
    </div>
  );
}
