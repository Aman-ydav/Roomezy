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
  Mail,
  Zap,
  Clock,
  Smile,
  MessageCircle,
  DollarSign,
  TrendingUp,
} from "lucide-react";

const AboutPage = () => {
  const navigate = useNavigate();

  const developerInfo = {
    name: "Aman Yadav",
    role: "Full Stack Developer & Creator of Roomezy",
    avatarUrl: "https://res.cloudinary.com/djsytmwcw/image/upload/v1762451646/roomezy/fbhptaw89uhnvbatqipf.jpg", 
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
        "It all started in college WhatsApp groups. I'd see endless messages like 'Need a room near campus, budget ₹5000-7000' or 'Looking for a roommate who doesn't smoke.' Frustrated by the chaos and lack of trust, I realized there had to be a better way to connect people seeking shared living spaces.",
      highlight: "Inspired by real college struggles",
      color: "from-red-900 to-pink-600",
    },
    {
      phase: "The Vision",
      icon: Target,
      description:
        "I envisioned Roomezy as more than just an app — a trusted platform where students and young professionals could find compatible roommates and affordable rooms with verified profiles, secure chats, and smart matching based on lifestyle and budget.",
      highlight: "Building trust in shared living",
      color: "from-purple-400 to-purple-600",
    },
    {
      phase: "The Creation",
      icon: Code,
      description:
        "Using modern web technologies, I built Roomezy from scratch. From designing intuitive filters for budget and preferences to implementing real-time chat and verification systems, every feature was crafted to solve the problems I saw in those group chats.",
      highlight: "Code meets community needs",
      color: "from-green-400 to-green-600",
    },
    {
      phase: "The Launch & Growth",
      icon: Rocket,
      description:
        "After rigorous testing and feedback from beta users, Roomezy launched. Today, it's a growing community where thousands find their perfect roommate match, proving that technology can make shared living simpler, safer, and more enjoyable.",
      highlight: "From idea to reality",
      color: "from-orange-400 to-red-600",
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
    "Nodemailer",
  ];

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-linear-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6 animate-bounce-slow">
            <Code className="h-12 w-12 text-primary" />
            <h1 className="text-5xl font-bold text-primary">About Roomezy</h1>
            <Code className="h-12 w-12 text-primary" />
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Roomezy is built to make finding roommates and rooms simpler, safer,
            and more transparent. Our goal is to connect people — not just
            properties — and build a trusted community for shared living.
          </p>
        </div>
     
      </section>

      {/* Developer Section - Redesigned */}
      <section className="py-20 px-4 bg-linear-to-r from-background via-muted/10 to-background">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Meet the Creator</h2>
            <p className="text-muted-foreground">The visionary behind Roomezy</p>
          </div>
          <div className="flex flex-col items-center">
            {/* Avatar with Glow Effect */}
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
              <Avatar className="w-48 h-48 ring-8 ring-primary/30 shadow-2xl relative z-10">
                <AvatarImage
                  src={developerInfo.avatarUrl}
                  alt={developerInfo.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-5xl bg-muted text-muted-foreground font-bold">
                  AY
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-4 -right-4 bg-accent text-accent-foreground rounded-full p-3 shadow-lg">
                <Smile className="h-8 w-8" />
              </div>
            </div>
            
            {/* Name and Role */}
            <div className="text-center mb-6">
              <h3 className="text-4xl font-bold text-foreground mb-2">{developerInfo.name}</h3>
              <p className="text-xl text-muted-foreground">{developerInfo.role}</p>
            </div>
            
            {/* Description */}
            <Card className="bg-card/80 backdrop-blur-sm border border-border shadow-xl mb-8 max-w-2xl">
              <CardContent className="p-6">
                <p className="text-muted-foreground leading-relaxed text-center">
                  I created Roomezy to make the house-hunting journey simpler
                  and safer. Every feature — from posting rooms to chatting with
                  potential roommates — was built to make living together easy,
                  reliable, and enjoyable.
                </p>
              </CardContent>
            </Card>
            
            {/* Social Links - Circular Layout */}
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open(developerInfo.github, "_blank")}
                className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-md"
              >
                <Code className="h-5 w-5" />
                GitHub
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open(developerInfo.linkedin, "_blank")}
                className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-md"
              >
                <Linkedin className="h-5 w-5" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open(developerInfo.portfolio, "_blank")}
                className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-md"
              >
                <Globe className="h-5 w-5" />
                Portfolio
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open(developerInfo.email, "_blank")}
                className="flex items-center gap-3 px-6 py-3 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 shadow-md"
              >
                <Mail className="h-5 w-5" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section - Completely Redesigned */}
      <section className="py-20 px-4 bg-linear-to-b from-muted/10 to-background">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">The Roomezy Journey</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto ">
              From college WhatsApp chaos to a trusted roommate platform — discover how Roomezy was born from real-world frustrations.
            </p>
          </div>

          {/* Timeline Layout */}
          <div className="relative">
            {/* Central Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-linear-to-b from-primary via-accent to-primary h-full hidden md:block"></div>

            {journey.map((phase, index) => {
              const Icon = phase.icon;
              const isEven = index % 2 === 0;
              return (
                <div key={phase.phase} className={`relative mb-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} flex flex-col md:flex items-center`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg z-0 hidden md:block"></div>

                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left'} ${isEven ? '' : 'md:order-2'}`}>
                    <Card className={`bg-card z-20 border border-border shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 ${isEven ? 'md:ml-auto' : 'md:mr-auto'}`}>
                      <CardHeader className={`bg-linear-to-r ${phase.color} text-white rounded-t-lg`}>
                        <CardTitle className="flex items-center gap-3 text-xl">
                          <Icon className="h-6 w-6" />
                          {phase.phase}
                        </CardTitle>
                        <Badge variant="secondary" className="w-fit bg-white/20 text-white border-white/30">
                          {phase.highlight}
                        </Badge>
                      </CardHeader>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground leading-relaxed z-30">
                          {phase.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Spacer for Timeline */}
                  <div className="hidden md:block w-2/12"></div>
                </div>
              );
            })}
          </div>

          {/* Inspirational Quote */}
          <div className="text-center mt-16">
            <Card className="bg-linear-to-rbg-linear-to-r from-primary/10 to-accent/10 border border-primary/20 max-w-3xl mx-auto">
              <CardContent className="p-8">
                <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                <blockquote className="text-lg italic text-foreground mb-4">
                  "Every great idea starts with a problem. Roomezy began when I saw the frustration in college group chats — endless posts about rooms and roommates with no easy way to connect safely."
                </blockquote>
                <cite className="text-primary font-semibold">- Aman Yadav, Creator of Roomezy</cite>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

     

      {/* Tech Stack Section */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4 flex items-center justify-center gap-2">
              <Code className="h-6 w-6" /> Built with Modern Technology
            </h2>
            <p className="text-muted-foreground">
              Reliable, fast, and scalable — just like your dream home
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {techStack.map((tech) => (
              <Badge key={tech} variant="secondary" className="px-4 py-2 text-sm">
                {tech}
              </Badge>
            ))}
          </div>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto">
            Roomezy is powered by the MERN stack, ensuring secure, smooth, and
            efficient experiences — from search to communication.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <Card className="bg-primary text-primary-foreground shadow-lg">
            <CardContent className="p-8 text-center">
              <h2 className="text-4xl font-bold mb-4">
                Join the Roomezy Community
              </h2>
              <p className="text-primary-foreground/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                Roomezy isn’t just about finding a roommate — it’s about finding
                your next home and building connections that last.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => navigate("/register")}
                  className="bg-background text-foreground hover:bg-muted transition-colors"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="border-primary-foreground bg-primary text-background hover:bg-primary-foreground hover:text-primary transition-colors"
                >
                  Explore Listings
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-6">
                Together, let’s make shared living smarter and safer.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scroll Indicator */}
      <div className="scroll-indicator" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </div>
    </div>
  );
};

export default AboutPage;
