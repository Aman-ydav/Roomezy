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
  MapPin,
  Calendar,
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
      phase: "Problem Discovery",
      icon: MessageCircle,
      description:
        "It all started in college WhatsApp groups — endless messages like 'Need a room near campus' or 'Looking for a roommate who doesn't smoke.' The chaos, the confusion, the uncertainty… something had to change.",
      highlight: "Inspired by real struggles",
      color: "bg-gradient-to-br from-red-500 to-pink-600",
    },
    {
      phase: "Vision Crafting",
      icon: Target,
      description:
        "I wanted Roomezy to be more than a listing app — a trusted space where people could match based on habits, lifestyle, and comfort. A platform that values people, not just properties.",
      highlight: "Building trust in shared living",
      color: "bg-gradient-to-br from-purple-500 to-indigo-600",
    },
    {
      phase: "Solution Development",
      icon: Code,
      description:
        "Every feature — from filters to chat to verification — was built based on real user problems. Roomezy was shaped by community stories and powered by modern web technologies.",
      highlight: "Code meets real problems",
      color: "bg-gradient-to-br from-green-500 to-emerald-600",
    },
    {
      phase: "Community Growth",
      icon: Users,
      description:
        "From beta feedback to real users finding their roommates — Roomezy grew into a community. A place where safety, clarity, and comfort lead the experience.",
      highlight: "From idea to reality",
      color: "bg-gradient-to-br from-orange-500 to-red-600",
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

  const stats = [
    { label: "User Focused", value: "100%", icon: Users },
    { label: "Secure Platform", value: "Verified", icon: Shield },
    { label: "Modern Tech", value: "Cutting Edge", icon: Zap },
    { label: "Community Driven", value: "Growing", icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      {/* HERO SECTION - Modern Gradient */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-accent/10 to-primary/5"></div>
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-accent/10 rounded-full blur-2xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 border border-primary/20">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">About Roomezy</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Redefining Roommate Finding
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Where modern technology meets human connection. Roomezy makes finding roommates simple, safe, and transparent.
          </p>
        </div>
      </section>

      {/* CREATOR SECTION - Modern Card Layout */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-3">Meet the Creator</h2>
            <p className="text-muted-foreground">The visionary behind Roomezy</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Avatar Section */}
            <div className="relative flex justify-center">
              <div className="relative">
                <div className="absolute -inset-4 bg-linear-to-r from-primary to-accent rounded-3xl blur-lg opacity-30"></div>
                <Avatar className="w-48 h-48 border-4 border-background shadow-2xl relative z-10">
                  <AvatarImage
                    src={developerInfo.avatarUrl}
                    alt={developerInfo.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-2xl bg-muted text-muted-foreground font-bold">
                    AY
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold">{developerInfo.name}</h3>
                <p className="text-muted-foreground text-lg mt-1">
                  {developerInfo.role}
                </p>
              </div>

              <Card className="bg-card border shadow-lg">
                <CardContent className="p-6">
                  <p className="text-muted-foreground leading-relaxed">
                    I created Roomezy to fix the chaos of finding roommates. Every feature is crafted to make shared living safer, simpler, and more comfortable.
                  </p>
                </CardContent>
              </Card>

              {/* Social Links - Modern */}
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: Code, href: developerInfo.github, label: "GitHub" },
                  { icon: Linkedin, href: developerInfo.linkedin, label: "LinkedIn" },
                  { icon: Globe, href: developerInfo.portfolio, label: "Portfolio" },
                  { icon: Mail, href: developerInfo.email, label: "Email" },
                ].map((item, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(item.href, "_blank")}
                    className="rounded-lg gap-2"
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center p-6 bg-background rounded-2xl shadow-sm border">
                  <div className="w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* JOURNEY SECTION - Modern Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4 border border-primary/20">
              <Rocket className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">BUILDING ROOMEZY</span>
            </div>
            <h2 className="text-4xl font-bold text-primary mb-4">
              The Evolution of an Idea
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              How real problems sparked a revolution in roommate finding
            </p>
          </div>

          <div className="space-y-8">
            {journey.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex gap-6 group">
                  {/* Timeline Dot */}
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${item.color.replace('bg-linear-to-br', 'bg-primary')} group-hover:scale-125 transition-transform`}></div>
                    {index !== journey.length - 1 && (
                      <div className="w-0.5 h-full bg-muted-foreground/20 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <Card className="flex-1 shadow-lg border-l-4 border-l-primary hover:shadow-xl transition-all duration-300">
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{item.phase}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {item.highlight}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* QUOTE CARD */}
          <Card className="mt-12 bg-linear-to-r from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="p-8 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <p className="italic text-lg text-muted-foreground mb-4">
                "Great solutions don't come from technology alone—they come from understanding real human problems."
              </p>
              <p className="text-primary font-semibold">– Aman Yadav, Creator of Roomezy</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* TECH STACK - Modern Grid */}
      <section className="py-16 px-4 bg-muted/10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary flex justify-center items-center gap-3 mb-3">
              <Code className="h-6 w-6" /> 
              Built With Modern Technology
            </h2>
            <p className="text-muted-foreground">Powered by cutting-edge tools and frameworks</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {techStack.map((tech, index) => (
              <div
                key={tech}
                className="bg-background p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow text-center group hover:border-primary/50"
              >
                <div className="font-medium text-foreground group-hover:text-primary transition-colors">
                  {tech}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION - Modern Gradient */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-primary to-accent text-primary-foreground shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>
            
            <div className="relative z-10 p-10 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Find Your Perfect Match?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join thousands who've found their ideal roommates and homes through Roomezy.
              </p>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-background text-foreground hover:bg-background/90"
                  onClick={() => navigate("/register")}
                >
                  Get Started Free
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate("/")}
                >
                  Browse Listings
                </Button>
              </div>

              <p className="text-sm mt-6 opacity-80">
                No credit card required • Simple setup • Find matches in minutes
              </p>
            </div>
          </div>
        </div>
      </section>

      <ScrollToTop />
    </div>
  );
};

export default AboutPage;