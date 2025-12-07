import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Plus,
} from "lucide-react";
import ScrollToTop from "@/components/layout/ScrollToTop";

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

  // const faqCategories = [
  //   {
  //     id: "getting-started",
  //     title: "Getting Started with Roomezy",
  //     icon: Home,
  //     color: "bg-primary",
  //     faqs: [
  //       {
  //         question: "How do I create an account on Roomezy?",
  //         answer: [
  //           "Navigate to the Roomezy homepage and click the 'Sign Up' button in the top navigation.",
  //           "Provide your email address, create a secure password, and fill in basic profile details like your name, age, and preferences.",
  //           "You can add multiple locations by clicking the 'Add Location' button during registration; we store them in an array for flexible searching.",
  //           "Once registered, you'll receive a confirmation email to verify your account. Complete your profile by adding photos, lifestyle details, and verification info for better matches and visibility."
  //         ],
  //       },
  //       {
  //         question: "How do I list my room or find a roommate?",
  //         answer: [
  //           "On the homepage, click the 'Need Room' or 'Need Roommate' button, which redirects you to create a post.",
  //           "Choose your post type: 'Looking for a Room' (if you're seeking accommodation), 'Looking for a Roommate' (to find someone to share with), or 'Listing a Room' (if you have a room to rent).",
  //           "Enter details like rent, room size, amenities, location, and your preferences for roommates or rooms.",
  //           "Upload high-quality photos and submit; your post will be reviewed and go live shortly. You can also filter and browse other posts on the home page based on your needs."
  //         ],
  //       },
  //       {
  //         question: "Can I search for roommates instead of rooms?",
  //         answer: [
  //           "Yes, when creating a post, select 'Looking for a Roommate' to advertise your need for a co-living partner.",
  //           "On the home page, use filters to search for other users posting as 'Looking for a Roommate' or 'Listing a Room', specifying criteria like age range, lifestyle habits, budget, and shared interests.",
  //           "Browse profiles with photos, bios, and compatibility scores to find matches.",
  //           "Once interested, you can connect through our upcoming chat feature (currently under development) or other contact methods."
  //         ],
  //       },
  //       {
  //         question: "Can the owner of the property also register on Roomezy?",
  //         answer: [
  //           "Absolutely! Property owners can register just like any user by providing their email and details.",
  //           "As an owner, you can create posts under 'Listing a Room' to advertise available spaces in your property.",
  //           "You have access to the same dashboard for managing posts, editing details, and interacting with potential tenants or roommates.",
  //           "This allows you to find reliable roommates or tenants directly through the platform, with all the filtering and matching features available."
  //         ],
  //       },
  //       {
  //         question: "Can I post as a room seeker, and what are the different post options?",
  //         answer: [
  //           "Yes, Roomezy supports three distinct post types to cater to different needs:",
  //           "1. 'Looking for a Room': Post this if you're seeking accommodation and want to find available rooms or shared spaces.",
  //           "2. 'Looking for a Roommate': Use this to find someone to share your current living space or a new one.",
  //           "3. 'Listing a Room': Choose this if you have a room to rent out, whether as a property owner or existing tenant.",
  //           "Each option allows tailored details, filters, and visibility to connect you with the right matches. You can switch or create multiple posts from your dashboard."
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "account-security",
  //     title: "Account & Security",
  //     icon: Shield,
  //     color: "bg-trust",
  //     faqs: [
  //       {
  //         question: "How do I reset my password?",
  //         answer: [
  //           "On the login page, click the 'Forgot Password?' link.",
  //           "Enter the email address associated with your Roomezy account.",
  //           "Check your email for a secure reset link and follow the instructions to create a new password.",
  //           "For added security, consider updating your password regularly and enabling any future two-factor authentication features."
  //         ],
  //       },
  //       {
  //         question: "How do I manage my account settings and profile?",
  //         answer: [
  //           "Log in and access your dashboard, where you have a wonderful interface to manage all aspects of your account.",
  //           "Update personal details, add or remove locations (stored in an array for multiple options), upload photos, and set preferences.",
  //           "From the dashboard, you can also view and manage all your posts, toggle their status (active, archived, or hidden), and edit or delete them as needed.",
  //           "Use the settings to control visibility, such as making your profile public or private, and ensure your information is up-to-date for better matches."
  //         ],
  //       },
  //       {
  //         question: "What should I do if I encounter issues with my account?",
  //         answer: [
  //           "First, check your dashboard for any notifications or status updates on your posts and profile.",
  //           "If you can't access certain features, try refreshing the page or clearing your browser cache.",
  //           "For persistent issues, contact our support team via email or phone with your account details.",
  //           "Remember, our platform is designed for safety, so all actions are logged, and we can assist with recoveries or verifications."
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "roommate-matching",
  //     title: "Roommate & Room Matching",
  //     icon: Users,
  //     color: "bg-accent",
  //     faqs: [
  //       {
  //         question: "How does Roomezy recommend roommates or rooms?",
  //         answer: [
  //           "Roomezy's algorithm analyzes your profile preferences, including budget, location (from your added array), and lifestyle choices.",
  //           "It matches you with users or posts that have compatible habits, such as cleanliness, pet preferences, and study/work schedules.",
  //           "Compatibility scores are calculated based on shared interests, age, and other filters you set.",
  //           "Recommendations update as you refine your profile or as new posts are added; you can browse them on the home page with advanced filters."
  //         ],
  //       },
  //       {
  //         question: "How can I connect with potential roommates or room listings?",
  //         answer: [
  //           "Browse posts on the home page and use filters to narrow down options based on your post type (e.g., looking for roommates or rooms).",
  //           "Our chat feature is currently under development, so for now, use the contact details provided in posts or profiles.",
  //           "Once connected, you can discuss details directly; future updates will include in-app messaging for secure communication.",
  //           "Always prioritize safety by meeting in public and verifying details before committing."
  //         ],
  //       },
  //       {
  //         question: "How do I toggle the status of my posts (active, archived, etc.)?",
  //         answer: [
  //           "From your dashboard, navigate to 'My Posts' section.",
  //           "For each post, you'll see options to toggle status: 'Active' (visible to others), 'Archived' (hidden but saved), or 'Hidden' (temporarily removed from searches).",
  //           "This is an important feature to manage availability; for example, archive a post if you've found a match or hide it during updates.",
  //           "Changes take effect immediately, and you can reactivate archived posts anytime without losing data."
  //         ],
  //       },
  //     ],
  //   },
  //   {
  //     id: "editing-posts",
  //     title: "Editing & Managing Posts",
  //     icon: Edit,
  //     color: "bg-success",
  //     faqs: [
  //       {
  //         question: "How can I edit my room listing or roommate post?",
  //         answer: [
  //           "Log in to your Roomezy account and go to the dashboard's 'My Posts' section.",
  //           "Find the post you want to edit and click the 'Edit' button (pencil icon).",
  //           "Update details like rent, description, photos, locations (add or remove from your array), or preferences as needed.",
  //           "Save changes, and they'll be reflected immediately or after a brief review for accuracy and compliance."
  //         ],
  //       },
  //       {
  //         question: "Can I delete or deactivate my listing?",
  //         answer: [
  //           "In your dashboard under 'My Posts', select the listing and choose 'Deactivate' to temporarily hide it from searches.",
  //           "For permanent removal, click 'Delete' and confirm; this action cannot be undone and will remove all associated data.",
  //           "Deactivated listings can be reactivated anytime without losing information.",
  //           "Note that deleting a post removes it entirely, but archiving keeps it safe for future use."
  //         ],
  //       },
  //       {
  //         question: "How do I update my roommate or room preferences?",
  //         answer: [
  //           "Go to your profile settings in the dashboard and select the 'Preferences' tab.",
  //           "Adjust filters for age, gender, lifestyle, budget, and locations (from your added array) to refine matches.",
  //           "Save changes to see updated recommendations in your feed and on the home page.",
  //           "Regularly updating preferences helps Roomezy provide better, more personalized suggestions and post visibility."
  //         ],
  //       },
  //       {
  //         question: "What features does the dashboard offer for managing my account and posts?",
  //         answer: [
  //           "The dashboard is a comprehensive hub with sections for 'My Posts', 'Profile Settings', 'Preferences', and 'Activity'.",
  //           "View all your posts at a glance, edit them, toggle statuses (active/archived/hidden), and track interactions.",
  //           "Manage your profile: add multiple locations, upload photos, update details, and control privacy settings.",
  //           "It's user-friendly and mobile-optimized, allowing you to handle everything on the go, from creating new posts to archiving old ones."
  //         ],
  //       },
  //     ],
  //   },
  // ];

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
            "Provide your email address, create a secure password, and fill in basic profile details like your name, age, and preferences.",
            "You can add multiple locations by clicking the 'Add Location' button during registration; we store them in an array for flexible searching.",
            "Once registered, you'll receive a confirmation email to verify your account. Complete your profile by adding photos, lifestyle details, and verification info for better matches and visibility.",
          ],
        },
        {
          question: "How do I list my room or find a roommate?",
          answer: [
            "On the homepage, click the 'Need Room' or 'Need Roommate' button, which redirects you to create a post.",
            "Choose your post type: 'Looking for a Room' (if you're seeking accommodation), 'Looking for a Roommate' (to find someone to share with), or 'Listing a Room' (if you have a room to rent).",
            "Enter details like rent, room size, amenities, location, and your preferences for roommates or rooms.",
            "Upload high-quality photos and submit; your post will be reviewed and go live shortly. You can also filter and browse other posts on the home page based on your needs.",
          ],
        },
        {
          question: "Can I search for roommates instead of rooms?",
          answer: [
            "Yes, when creating a post, select 'Looking for a Roommate' to advertise your need for a co-living partner.",
            "On the home page, use filters to search for other users posting as 'Looking for a Roommate' or 'Listing a Room', specifying criteria like age range, lifestyle habits, budget, and shared interests.",
            "Browse profiles with photos, bios, and compatibility scores to find matches.",
            "Once interested, you can connect through our upcoming chat feature (currently under development) or other contact methods.",
          ],
        },
        {
          question: "Can the owner of the property also register on Roomezy?",
          answer: [
            "Absolutely! Property owners can register just like any user by providing their email and details.",
            "As an owner, you can create posts under 'Listing a Room' to advertise available spaces in your property.",
            "You have access to the same dashboard for managing posts, editing details, and interacting with potential tenants or roommates.",
            "This allows you to find reliable roommates or tenants directly through the platform, with all the filtering and matching features available.",
          ],
        },
        {
          question:
            "Can I post as a room seeker, and what are the different post options?",
          answer: [
            "Yes, Roomezy supports three distinct post types to cater to different needs:",
            "1. 'Looking for a Room': Post this if you're seeking accommodation and want to find available rooms or shared spaces.",
            "2. 'Looking for a Roommate': Use this to find someone to share your current living space or a new one.",
            "3. 'Listing a Room': Choose this if you have a room to rent out, whether as a property owner or existing tenant.",
            "Each option allows tailored details, filters, and visibility to connect you with the right matches. You can switch or create multiple posts from your dashboard.",
          ],
        },
      ],
    },
    {
      id: "posting",
      title: "Posting ",
      icon: Users,
      color: "bg-accent",
      faqs: [
        {
          question: "How do I create a post?",
          answer: [
            "From the Home page use the visible buttons: 'Need Room', 'Need Roommate', or 'Have Room'. These redirect to the post creation flow.",
            "Choose the post type that matches your intent (seeking room, seeking roommate, or listing a room/property).",
            "Fill details such as rent, room type, preferred roommate habits, and location(s). You can pick any of your saved locations or add a new one.",
            "Add clear photos and a short description. Submit — posts are immediately created and visible unless you toggle them off.",
          ],
        },
        {
          question:
            "What post types are available? Can I post as a room seeker?",
          answer: [
            "There are three main post types: 'Need Room' (you are searching for a room), 'Need Roommate' (you have a room and want a roommate), and 'Have Room' / 'Property' (owner lists a room/property).",
            "Yes — you can post as a room seeker using the 'Need Room' option. Each post type has tailored fields to collect the right info for that scenario.",
            "Because the post type is chosen at creation, filters on the Home page will surface relevant posts (e.g., users looking for roommates vs listings).",
          ],
        },
        {
          question: "What should I include in a good post?",
          answer: [
            "Clear photos of the room and common areas, accurate rent, utilities info, and exact or nearby location.",
            "Be honest about lifestyle preferences (smoking, pets, work hours) to get compatible matches.",
            "Add multiple locations if you are flexible — this increases your match chances.",
            "Use the title and first description line to highlight the most important selling points (e.g., 'Furnished 1BHK near Main Gate — Available Aug 1').",
          ],
        },
      ],
    },
    {
      id: "manage-posts",
      title: "Manage Your Posts",
      icon: Edit,
      color: "bg-success",
      faqs: [
        {
          question: "How do I edit or update my post?",
          answer: [
            "Open your Dashboard → My Posts, find the post, and click the Edit (pencil) icon.",
            "Update fields like rent, photos, or preferences and Save — changes are applied immediately.",
            "If you change locations, select an existing saved location or add a new one while editing.",
            "Tip: Regularly update photos and availability to keep interest high.",
          ],
        },
        {
          question: "How can I delete, archive or toggle my post visibility?",
          answer: [
            "In Dashboard → My Posts you have quick actions: Delete (permanently removes), Archive (hides but keeps data), and Toggle Visibility (make live or private).",
            "Archiving is useful when you want to hide a post temporarily but keep chat history and data for later reactivation.",
            "Toggling visibility lets you pause new inquiries without losing the post content.",
            "Deleted posts cannot be recovered — consider archiving if you might re-list in the future.",
          ],
        },
        {
          question: "Why is my post not visible to others?",
          answer: [
            "Check your post status in Dashboard: you may have toggled visibility off or archived it.",
            "Ensure required fields and at least one photo are included — some incomplete posts are hidden until completed.",
            "If you created a 'Need Roommate' or 'Need Room' post, confirm the correct post type is selected — home filters show specific post types.",
            "If everything looks correct and you still can't see it, try viewing as guest (logged out) to confirm public visibility or contact support with the post ID.",
          ],
        },
      ],
    },
    {
      id: "communication",
      title: "Communication & Chat",
      icon: MessageCircle,
      color: "bg-secondary",
      faqs: [
        {
          question: "Is there a chat or messaging feature?",
          answer: [
            "A secure in-app chat is planned and currently under development.",
            "Until it launches, users usually contact each other via the contact information shared in posts (phone/email) or via the community forum.",
            "Once chat is live you'll be able to message directly from a post or profile — we will announce the feature and rollout in-app.",
            "For urgent matters, include a preferred contact method in your post description (but avoid sharing sensitive personal data).",
          ],
        },
        {
          question: "Can I report a user or message inappropriate behaviour?",
          answer: [
            "An integrated reporting system is not available yet. We plan to add this in a future update with moderation workflows.",
            "For critical safety issues, please reach out to support directly via email (support@roomezy.com) and provide relevant details and post IDs.",
            "We encourage users to follow safety tips (meet in public places, bring a friend to viewings, share minimal personal info until comfortable).",
          ],
        },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting & Account",
      icon: Shield,
      color: "bg-trust",
      faqs: [
        {
          question: "I forgot my password. How do I reset it?",
          answer: [
            "On the login page click 'Forgot Password'. Enter your registered email to receive a password reset link.",
            "Follow the link to set a new password. If you don't receive it within a few minutes, check spam or try again.",
            "If problems persist, contact support with your account email and approximate registration time.",
          ],
        },
        {
          question: "Why can't I upload images or they fail to show?",
          answer: [
            "Ensure photos are within allowed size limits and file types (JPG/PNG).",
            "Try smaller photo sizes or fewer photos in a single upload if you see a timeout.",
            "If uploads fail repeatedly, clear browser cache or try from a different network to rule out connectivity issues.",
            "Contact support with the error message and post ID so we can investigate.",
          ],
        },
        {
          question: "How do I update my profile information?",
          answer: [
            "Go to Dashboard → Edit Profile to update name, bio, locations, and photos.",
            "Changes to profile fields are saved immediately and reflected on new or existing posts where applicable.",
            "Remember to save changes and refresh your dashboard to confirm updates.",
          ],
        },
      ],
    },
    {
      id: "safety-guidelines",
      title: "Safety & Guidelines",
      icon: Info,
      color: "bg-muted",
      faqs: [
        {
          question: "How does Roomezy help keep users safe?",
          answer: [
            "We encourage clear, honest listings and ask users to provide helpful photos and details.",
            "Profiles display basic information and posts include contact preferences so you can choose how to connect.",
            "Always follow safety best practices: meet in public first, bring a friend, and avoid sharing sensitive personal info until trust is built.",
          ],
        },
        {
          question: "What behaviour or content is not allowed in posts?",
          answer: [
            "No illegal content, discriminatory language, or requests for sensitive personal data in post descriptions or images.",
            "Do not post misleading photos or false listings. Violations may result in content removal or account suspension once moderation tools are available.",
            "If you see a clearly fraudulent or dangerous listing, email support with the post ID and details.",
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
      description:
        "Receive a detailed response within 24 hours for complex queries.",
    },
    {
      method: "Community Forum",
      details: "Join the Roomezy Community",
      icon: MessageCircle,
      description:
        "Connect with other users for tips, experiences, and quick answers.",
    },
    {
      method: "Phone Support",
      details: "+1 (800) 555-ROOM",
      icon: Phone,
      description:
        "Speak directly with experts, available Mon–Fri, 9 AM – 6 PM (IST).",
    },
  ];

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      faqs: category.faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          faq.answer.some((point) =>
            point.toLowerCase().includes(searchTerm.toLowerCase())
          )
      ),
    }))
    .filter((category) => category.faqs.length > 0);

  const currentCategory = faqCategories.find(
    (cat) => cat.id === activeCategory
  );

  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 bg-linear-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <HelpCircle className="h-10 w-10 md:h-12 md:w-12 text-primary animate-bounce-slow" />
            <h1 className="text-3xl md:text-5xl font-bold text-primary">
              Roomezy Help Center
            </h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            Your go-to resource for navigating Roomezy. Find quick answers,
            learn tips, and get support for a seamless shared living experience.
            Explore detailed FAQs, manage your posts, and connect with our
            community.
          </p>
        </div>
      </section>

      {/* Quick Action Buttons */}
      <section className="py-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-center text-2xl md:text-3xl font-bold mb-6 text-primary">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <a
              href="/how-posting-works"
              className="group p-6 rounded-xl border bg-card shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-4 hover:bg-accent/5"
            >
              <div className="p-4 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-all">
                <svg
                  xmlns="https://www.w3.org/2000/svg"
                  className="w-7 h-7 text-accent"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path d="M12 6v12m6-6H6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">How to List a Room</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Understand how to post your room so seekers can easily find
                  it.
                </p>
              </div>
            </a>
            <a
              href="/find-room"
              className="group p-6 rounded-xl border bg-card shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-4 hover:bg-primary/5"
            >
              <div className="p-4 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-all">
                <svg
                  xmlns="httsp://www.w3.org/2000/svg"
                  className="w-7 h-7 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path d="M3 9.75L12 3l9 6.75M5.25 10.5V21h4.5v-6h4.5v6h4.5V10.5" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold">How to Find a Room</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                  Learn how to browse, search, and identify the right room for
                  your needs.
                </p>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Search and Category Tabs */}
      <section className="py-6 md:py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <Card className="mb-6 md:mb-8 bg-card border border-border shadow-md">
            <CardContent className="p-4 md:p-6">
              <div className="relative mb-4 md:mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search help topics, questions, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-10 md:h-12 text-base md:text-lg"
                />
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {faqCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={
                        activeCategory === category.id ? "default" : "outline"
                      }
                      onClick={() => setActiveCategory(category.id)}
                      className={`flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 text-sm md:text-base ${
                        activeCategory === category.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{category.title}</span>
                      <span className="sm:hidden">
                        {category.title.split(" ")[0]}
                      </span>
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
                <CardHeader className="bg-muted/20 p-4 md:p-6">
                  <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                    <div
                      className={`p-2 md:p-3 rounded-lg ${currentCategory.color} text-white`}
                    >
                      <currentCategory.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                    {currentCategory.title}
                    <Badge variant="secondary" className="ml-auto text-sm">
                      {currentCategory.faqs.length} FAQs
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {currentCategory.faqs.map((faq, index) => (
                      <Collapsible
                        key={index}
                        className="border border-border rounded-lg overflow-hidden"
                      >
                        <CollapsibleTrigger
                          className="flex items-center justify-between w-full p-3 md:p-4 text-left bg-muted/30 hover:bg-muted/50 transition-colors text-base md:text-lg"
                          onClick={() =>
                            toggleSection(`${currentCategory.id}-${index}`)
                          }
                        >
                          <span className="font-semibold">{faq.question}</span>
                          {openSections[`${currentCategory.id}-${index}`] ? (
                            <ChevronUp className="h-5 w-5 text-primary shrink-0" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-primary shrink-0" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-3 md:px-4 py-3 md:py-4 bg-background">
                          <ul className="space-y-2">
                            {faq.answer.map((point, idx) => (
                              <li
                                key={idx}
                                className="flex items-start gap-2 text-muted-foreground text-sm md:text-base"
                              >
                                <CheckCircle className="h-4 w-4 md:h-5 md:w-5 text-success shrink-0 mt-0.5" />
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
            <div className="mt-6 md:mt-8">
              <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">
                Search Results
              </h2>
              <div className="space-y-4">
                {filteredFAQs.map((category) => (
                  <Card
                    key={category.id}
                    className="bg-card border border-border"
                  >
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                        <category.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      {category.faqs.map((faq, idx) => (
                        <div key={idx} className="mb-4 last:mb-0">
                          <h4 className="font-semibold mb-2 text-base md:text-lg">
                            {faq.question}
                          </h4>
                          <ul className="space-y-1">
                            {faq.answer.map((point, pidx) => (
                              <li
                                key={pidx}
                                className="flex items-start gap-2 text-sm md:text-base text-muted-foreground"
                              >
                                <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-success shrink-0 mt-0.5" />
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
              <CardTitle className="text-3xl text-primary">
                Still Need Help?
              </CardTitle>
              <p className="text-muted-foreground mt-2">
                Can't find what you're looking for? Reach out to our dedicated
                support team for personalized assistance.
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
                      <h3 className="font-bold text-lg mb-2">
                        {option.method}
                      </h3>
                      <p className="text-primary font-medium mb-3">
                        {option.details}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {option.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-10 p-6 bg-trust/10 rounded-xl border border-trust/20">
                <div className="flex items-center gap-3 mb-3">
                  <Info className="h-6 w-6 text-trust" />
                  <span className="font-bold text-lg">
                    Support Hours & Tips
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">
                  Our support team is available Monday–Friday, 9 AM – 6 PM
                  (IST). We typically respond to all queries within 24 hours.
                </p>
                <p className="text-sm text-muted-foreground">
                  For faster resolution, include your account email and any
                  relevant post IDs when contacting us. Check our Community
                  Forum for user-shared solutions first!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scroll Indicator */}
      <ScrollToTop/>
    </div>
  );
}
