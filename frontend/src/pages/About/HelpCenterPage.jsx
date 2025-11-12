import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Home,
  Users,
  Shield,
  MapPin,
  MessageCircle,
  Mail,
  Phone,
  Info,
  CheckCircle,
  Edit,
  Settings,
} from "lucide-react";

export default function HelpCenterPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openSections, setOpenSections] = useState({});
  const [activeCategory, setActiveCategory] = useState("getting-started");

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const faqCategories = [
    {
      id: "getting-started",
      title: "Getting Started with Roomezy",
      icon: Home,
      color: "bg-primary",
      faqs: [
        {
          question: "How do I create an account on Roomezy?",
          answer: [
            "Navigate to the Roomezy homepage and click the 'Sign Up' button in the top navigation.",
            "Provide your email address, create a secure password, and fill in basic profile details like your name and location.",
            "Verify your email by clicking the confirmation link sent to your inbox to activate your account.",
            "Once verified, complete your profile by adding preferences, photos, and verification details for better matches."
          ],
        },
        {
          question: "How do I list my room?",
          answer: [
            "Log in to your Roomezy account and go to the 'List Room' section from the dashboard.",
            "Enter comprehensive details including rent amount, room size, amenities, and location specifics.",
            "Upload high-quality photos of the room, common areas, and surroundings to attract potential roommates.",
            "Set your preferences for ideal roommates and submit the listing for review; it typically goes live within 30 minutes."
          ],
        },
        {
          question: "Can I search for roommates instead of rooms?",
          answer: [
            "Yes, Roomezy offers a dedicated 'Find Roommates' feature accessible from the main menu.",
            "Use filters to specify criteria like age range, lifestyle habits, budget, and shared interests.",
            "Browse profiles with photos, bios, and compatibility scores to find the best matches.",
            "Initiate contact through our secure in-app messaging once you've found a potential roommate."
          ],
        },
      ],
    },
    {
      id: "account-security",
      title: "Account & Verification",
      icon: Shield,
      color: "bg-trust",
      faqs: [
        {
          question: "How do I verify my profile?",
          answer: [
            "Access your profile settings and navigate to the 'Verification' tab.",
            "Upload a government-issued ID (like a driver's license or passport) for identity confirmation.",
            "Link and verify your email and phone number to enhance account security.",
            "Once verified, you'll receive a badge on your profile, increasing trust and visibility in searches."
          ],
        },
        {
          question: "Can I hide my contact details?",
          answer: [
            "Go to your account settings under the 'Privacy' section.",
            "Toggle options to control what information is visible to other users.",
            "Choose to share contact details only after establishing communication through the app.",
            "Remember, Roomezy prioritizes safety by keeping personal info private until mutual consent."
          ],
        },
        {
          question: "How do I reset my password?",
          answer: [
            "On the login page, click the 'Forgot Password?' link.",
            "Enter the email address associated with your Roomezy account.",
            "Check your email for a secure reset link and follow the instructions to create a new password.",
            "For added security, enable two-factor authentication in your account settings after resetting."
          ],
        },
      ],
    },
    {
      id: "roommate-matching",
      title: "Roommate & Room Matching",
      icon: Users,
      color: "bg-accent",
      faqs: [
        {
          question: "How does Roomezy recommend roommates?",
          answer: [
            "Roomezy's algorithm analyzes your profile preferences, including budget, location, and lifestyle choices.",
            "It matches you with users who have compatible habits, such as cleanliness, pet preferences, and study/work schedules.",
            "Compatibility scores are calculated based on shared interests and mutual friend connections if available.",
            "Recommendations are updated regularly as more users join and profiles are refined."
          ],
        },
        {
          question: "Can I chat with potential roommates?",
          answer: [
            "Yes, use Roomezy's built-in chat feature for secure communication.",
            "Access the chat from any profile or listing by clicking the message icon.",
            "All conversations are monitored for safety, and you can report any inappropriate behavior.",
            "Upgrade to premium for advanced features like video calls and priority messaging."
          ],
        },
        {
          question: "How can I report a suspicious user?",
          answer: [
            "From the user's profile or chat window, click the 'Report' button.",
            "Select the reason for reporting, such as suspicious activity or inappropriate content.",
            "Provide additional details if needed, and our moderation team will investigate promptly.",
            "Reported users may be temporarily suspended while reviews are conducted to maintain community safety."
          ],
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting & Technical Issues",
      icon: MapPin,
      color: "bg-secondary",
      faqs: [
        {
          question: "Why is my post not visible?",
          answer: [
            "New listings undergo a quick moderation process to ensure quality and compliance.",
            "Check your dashboard for the post status; most are approved within 30 minutes.",
            "Ensure all required fields are filled and photos meet our guidelines (no personal info in images).",
            "If it's been longer, contact support with your post ID for assistance."
          ],
        },
        {
          question: "I can't send messages to other users",
          answer: [
            "Verify that your account is fully verified and not under any restrictions.",
            "Check your internet connection and try refreshing the app or browser.",
            "Ensure the recipient hasn't blocked you or set their profile to private messaging.",
            "If issues persist, clear your browser cache or update the app to the latest version."
          ],
        },
        {
          question: "My location is showing incorrectly",
          answer: [
            "Grant location permissions in your browser or device settings for accurate detection.",
            "Manually update your location in the 'Edit Profile' section with your exact address.",
            "If using a VPN, disable it temporarily as it may interfere with location services.",
            "Contact support if the issue continues, providing details about your device and browser."
          ],
        },
      ],
    },
    {
      id: "editing-posts",
      title: "Editing & Managing Posts",
      icon: Edit,
      color: "bg-success",
      faqs: [
        {
          question: "How can I edit my room listing personally?",
          answer: [
            "Log in to your Roomezy account and navigate to your dashboard.",
            "Find the listing under 'My Posts' and click the 'Edit' button (pencil icon).",
            "Update details like rent, description, photos, or preferences as needed.",
            "Save changes, and they'll be reflected immediately or after a brief review for accuracy."
          ],
        },
        {
          question: "Can I delete or deactivate my listing?",
          answer: [
            "In your dashboard, select the listing and choose 'Deactivate' to temporarily hide it.",
            "For permanent removal, click 'Delete' and confirm; this action cannot be undone.",
            "Deactivated listings can be reactivated anytime without losing data.",
            "Note that deleting removes all associated chats and applications."
          ],
        },
        {
          question: "How do I update my roommate preferences?",
          answer: [
            "Go to your profile settings and select the 'Preferences' tab.",
            "Adjust filters for age, gender, lifestyle, and budget to refine matches.",
            "Save changes to see updated recommendations in your feed.",
            "Regularly updating preferences helps Roomezy provide better, more personalized suggestions."
          ],
        },
      ],
    },
  ];

  const contactOptions = [
    {
      method: "Email Support",
      details: "support@roomezy.com",
      icon: Mail,
      description: "Receive a detailed response within 24 hours for complex queries.",
    },
    {
      method: "Community Forum",
      details: "Join the Roomezy Community",
      icon: MessageCircle,
      description: "Connect with other users for tips, experiences, and quick answers.",
    },
    {
      method: "Phone Support",
      details: "+1 (800) 555-ROOM",
      icon: Phone,
      description: "Speak directly with experts, available Mon–Fri, 9 AM – 6 PM (IST).",
    },
  ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.some(point => point.toLowerCase().includes(searchTerm.toLowerCase()))
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  const currentCategory = faqCategories.find(cat => cat.id === activeCategory);

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      {/* Hero Section */}
      <section className="relative py-16 px-4 bg-linear-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <HelpCircle className="h-12 w-12 text-primary animate-bounce-slow" />
            <h1 className="text-5xl font-bold text-primary">Roomezy Help Center</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Your go-to resource for navigating Roomezy. Find quick answers, learn tips, and get support for a seamless shared living experience.
          </p>
        </div>
      </section>

      {/* Search and Category Tabs */}
      <section className="py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="mb-8 bg-card border border-border shadow-md">
            <CardContent className="p-6">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search help topics, questions, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={activeCategory === category.id ? "default" : "outline"}
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 ${activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'}`}
                    >
                      <Icon className="h-4 w-4" />
                      {category.title}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Active Category Content */}
          {currentCategory && (
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-card border border-border shadow-lg">
                <CardHeader className="bg-muted/20">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className={`p-3 rounded-lg ${currentCategory.color} text-white`}>
                      <currentCategory.icon className="h-6 w-6" />
                    </div>
                    {currentCategory.title}
                    <Badge variant="secondary" className="ml-auto">{currentCategory.faqs.length} FAQs</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {currentCategory.faqs.map((faq, index) => (
                      <Collapsible key={index} className="border border-border rounded-lg overflow-hidden">
                        <CollapsibleTrigger
                          className="flex items-center justify-between w-full p-4 text-left bg-muted/30 hover:bg-muted/50 transition-colors"
                          onClick={() => toggleSection(`${currentCategory.id}-${index}`)}
                        >
                          <span className="font-semibold text-lg">{faq.question}</span>
                          {openSections[`${currentCategory.id}-${index}`] ? (
                            <ChevronUp className="h-5 w-5 text-primary" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-primary" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 py-4 bg-background">
                          <ul className="space-y-2">
                            {faq.answer.map((point, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-muted-foreground">
                                <CheckCircle className="h-5 w-5 text-success shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filtered Results if Searching */}
          {searchTerm && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">Search Results</h2>
              <div className="space-y-4">
                {filteredFAQs.map((category) => (
                  <Card key={category.id} className="bg-card border border-border">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <category.icon className="h-5 w-5 text-primary" />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {category.faqs.map((faq, idx) => (
                        <div key={idx} className="mb-4 last:mb-0">
                          <h4 className="font-semibold mb-2">{faq.question}</h4>
                          <ul className="space-y-1">
                            {faq.answer.map((point, pidx) => (
                              <li key={pidx} className="flex items-start gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-16 px-4 bg-muted/20">
        <div className="container mx-auto max-w-6xl">
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl text-primary">Still Need Help?</CardTitle>
              <p className="text-muted-foreground mt-2">
                Can't find what you're looking for? Reach out to our dedicated support team for personalized assistance.
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {contactOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <div
                      key={option.method}
                      className="text-center p-6 rounded-xl bg-linear-to-br from-primary/5 to-accent/5 border border-border hover:shadow-md transition-shadow"
                    >
                      <Icon className="h-10 w-10 text-primary mx-auto mb-4" />
                      <h3 className="font-bold text-lg mb-2">{option.method}</h3>
                      <p className="text-primary font-medium mb-3">{option.details}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 p-6 bg-trust/10 rounded-xl border border-trust/20">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="h-6 w-6 text-trust" />
                  <span className="font-bold text-lg">Support Hours & Tips</span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Our support team is available Monday–Friday, 9 AM – 6 PM (IST). We typically respond to all queries within 24 hours.
                </p>
                <p className="text-sm text-muted-foreground">
                  For faster resolution, include your account email and any relevant post IDs when contacting us. Check our Community Forum for user-shared solutions first!
                </p>
              </div>
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
}