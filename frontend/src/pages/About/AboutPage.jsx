import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  Home,
  Users,
  Shield,
  Lightbulb,
  Target,
  Rocket,
  Code,
  Linkedin,
  Globe,
  Smile,
  Mail,
  Zap,
  MessageCircle,
} from "lucide-react";

import ScrollToTop from "@/components/layout/ScrollToTop";

const AboutPage = () => {
  const navigate = useNavigate();

  const developerInfo = {
    name: "Aman Yadav",
    role: "Full Stack Developer & Creator of Roomezy",
    avatarUrl:
      "https://res.cloudinary.com/djsytmwcw/image/upload/v1762451646/roomezy/fbhptaw89uhnvbatqipf.jpg",
    github: "https://github.com/Aman-ydav/",
    linkedin: "https://www.linkedin.com/in/aman--yadv/",
    portfolio: "https://portfolioamanydav.vercel.app/",
    email: "mailto:amanyadav923949@gmail.com",
  };

  const journey = [
    {
      phase: "The Spark",
      icon: MessageCircle,
      description:
        "It all started in college WhatsApp groups — endless messages like 'Need a room near campus' or 'Looking for a roommate who doesn’t smoke.' The chaos, the confusion, the uncertainty… something had to change.",
      highlight: "Inspired by real struggles",
      color: "from-red-600 to-pink-500",
    },
    {
      phase: "The Vision",
      icon: Target,
      description:
        "I wanted Roomezy to be more than a listing app — a trusted space where people could match based on habits, lifestyle, and comfort. A platform that values people, not just properties.",
      highlight: "Building trust in shared living",
      color: "from-purple-500 to-indigo-600",
    },
    {
      phase: "The Creation",
      icon: Code,
      description:
        "Every feature — from filters to chat to verification — was built based on real user problems. Roomezy was shaped by community stories and powered by modern web technologies.",
      highlight: "Code meets real problems",
      color: "from-green-500 to-emerald-700",
    },
    {
      phase: "The Launch & Growth",
      icon: Rocket,
      description:
        "From beta feedback to real users finding their roommates — Roomezy grew into a community. A place where safety, clarity, and comfort lead the experience.",
      highlight: "From idea to reality",
      color: "from-orange-500 to-red-600",
    },
  ];

  const techStack = [
    "React",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Tailwind CSS",
    "Framer Motion",
    "Redux Toolkit",
   
  ];

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      {/* HERO */}
      <section className="py-16 px-4 bg-linear-to-br from-primary/10 to-accent/10">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary mb-4">
            About Roomezy
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Roomezy makes finding roommates simple, safe, and transparent.
            Built to connect people, not just listings.
          </p>
        </div>
      </section>

      {/* CREATOR */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-3">
            Meet the Creator
          </h2>
          <p className="text-muted-foreground mb-8">The mind behind Roomezy</p>

          {/* Avatar — Mobile optimized */}
          <div className="relative flex justify-center mb-8">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>

            <Avatar className="w-40 h-40 md:w-48 md:h-48 border-8 border-primary/30 shadow-2xl relative z-10 rounded-full">
              <AvatarImage
                src={developerInfo.avatarUrl}
                alt={developerInfo.name}
                className="object-cover"
              />
              <AvatarFallback className="text-4xl md:text-5xl bg-muted text-muted-foreground font-bold">
                AY
              </AvatarFallback>
            </Avatar>

            <div className="absolute -bottom-3 -right-3 bg-accent text-accent-foreground rounded-full p-3 shadow-xl scale-90 md:scale-100">
              <Smile className="h-6 w-6 md:h-8 md:w-8" />
            </div>
          </div>

          <h3 className="text-3xl font-bold">{developerInfo.name}</h3>
          <p className="text-muted-foreground text-lg mt-1">
            {developerInfo.role}
          </p>

          <Card className="mt-8 bg-card/80 backdrop-blur border shadow-xl">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                I created Roomezy to fix the chaos of finding roommates. Every
                feature is crafted to make shared living safer, simpler, and
                more comfortable.
              </p>
            </CardContent>
          </Card>

          {/* SOCIAL BUTTONS */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(developerInfo.github, "_blank")}
              className="rounded-full px-6"
            >
              <Code className="h-5 w-5 mr-2" /> GitHub
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(developerInfo.linkedin, "_blank")}
              className="rounded-full px-6"
            >
              <Linkedin className="h-5 w-5 mr-2" /> LinkedIn
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(developerInfo.portfolio, "_blank")}
              className="rounded-full px-6"
            >
              <Globe className="h-5 w-5 mr-2" /> Portfolio
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(developerInfo.email, "_blank")}
              className="rounded-full px-6"
            >
              <Mail className="h-5 w-5 mr-2" /> Email
            </Button>
          </div>
        </div>
      </section>

      {/* JOURNEY — NEW MOBILE + DESKTOP BALANCE */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-primary text-center mb-10">
            The Roomezy Journey
          </h2>

          <div className="relative">
            {/* CENTRAL LINE FOR DESKTOP */}
            <div className="hidden md:block absolute left-1/2 w-1 bg-linear-to-b from-primary via-accent to-primary h-full -translate-x-1/2"></div>

            {journey.map((item, i) => {
              const Icon = item.icon;
              const left = i % 2 === 0;

              return (
                <div
                  key={i}
                  className={`flex flex-col md:flex-row items-center gap-8 mb-14 ${
                    left ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* TIMELINE DOT (Desktop) */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background shadow-xl"></div>

                  {/* CARD */}
                  <Card
                    className={`w-full md:w-5/12 shadow-xl border backdrop-blur hover:scale-[1.02] transition-all duration-300 ${
                      left ? "md:mr-auto" : "md:ml-auto"
                    }`}
                  >
                    <CardHeader
                      className={`bg-linear-to-r ${item.color} text-white rounded-t-lg`}
                    >
                      <CardTitle className="flex items-center gap-2 text-xl">
                        <Icon className="h-6 w-6" />
                        {item.phase}
                      </CardTitle>
                      <Badge className="bg-white/20 text-white border-white/30 w-fit">
                        {item.highlight}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>

                  {/* SPACER */}
                  <div className="hidden md:block w-1/12"></div>
                </div>
              );
            })}
          </div>

          {/* QUOTE */}
          <Card className="max-w-3xl mx-auto mt-14 bg-linear-to-r from-primary/10 to-accent/10 border">
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-10 w-10 text-primary mx-auto mb-3" />
              <p className="italic text-lg">
                "Every idea begins with frustration. Roomezy was born from the
                chaos of college room-hunting — and shaped into something
                meaningful."
              </p>
              <p className="text-primary font-semibold mt-2">
                – Aman Yadav, Creator of Roomezy
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary flex justify-center items-center gap-2 mb-4">
            <Code className="h-6 w-6" /> Built with Modern Technology
          </h2>

          <div className="flex flex-wrap justify-center gap-3 mt-6 mb-8">
            {techStack.map((tech) => (
              <Badge key={tech} className="px-4 py-2 text-sm">
                {tech}
              </Badge>
            ))}
          </div>

          <p className="text-muted-foreground max-w-xl mx-auto">
            Roomezy uses the reliable MERN stack to ensure fast, secure, and
            seamless performance.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground shadow-xl">
            <CardContent className="p-10 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Join the Roomezy Community
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Roomezy is where smart living begins. Find your next roommate or
                your next home with confidence.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-background text-foreground"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white bg-primary text-background hover:bg-white hover:text-primary"
                  onClick={() => navigate("/")}
                >
                  Explore Listings
                </Button>
              </div>

              <p className="text-sm mt-6 opacity-90">
                Let’s make shared living smarter and safer — together.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SCROLL TO TOP BUTTON */}
      <ScrollToTop />
    </div>
  );
};

export default AboutPage;
