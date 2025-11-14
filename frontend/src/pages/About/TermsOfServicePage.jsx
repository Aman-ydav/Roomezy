import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FileText,
  Shield,
  Users,
  AlertTriangle,
  Mail,
  Phone,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 bg-linear-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <FileText className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold text-primary">Terms of Service</h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            Welcome to Roomezy! These Terms of Service ("Terms") govern your use of our platform for finding roommates, rooms, and shared living spaces. By accessing or using Roomezy, you agree to be bound by these Terms. Please read them carefully.
          </p>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          {/* Section 1: Acceptance of Terms */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                By registering, accessing, or using Roomezy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service, our Privacy Policy, and any additional guidelines or policies referenced herein. If you do not agree, please do not use our services. These Terms apply to all users, including property owners, room seekers, and roommates.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Description of Service */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Users className="h-6 w-6 text-primary" />
                2. Description of Service
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Roomezy is an online platform that connects individuals seeking shared living arrangements, including finding roommates, rooms, or properties. Our services include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Creating and managing posts for rooms, roommates, or properties.</li>
                <li>Browsing and filtering listings based on preferences like location, budget, and lifestyle.</li>
                <li>Profile management, including adding multiple locations and personal details.</li>
                <li>Community forums and future features like in-app messaging (currently under development).</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Roomezy does not guarantee matches, conduct background checks, or verify the accuracy of user-provided information. Users are responsible for their own due diligence.
              </p>
            </CardContent>
          </Card>

          {/* Section 3: User Eligibility */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                3. User Eligibility
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                To use Roomezy, you must be at least 18 years old and capable of entering into legally binding agreements. By using our platform, you represent that you meet these requirements. Roomezy is not intended for use by minors. If you are registering on behalf of a property owner or organization, you must have authority to do so.
              </p>
            </CardContent>
          </Card>

          {/* Section 4: Account Registration and Security */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                4. Account Registration and Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Registration requires providing an email, password, display name, and at least one location. You are responsible for maintaining the confidentiality of your account credentials. You agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Provide accurate and up-to-date information.</li>
                <li>Notify us immediately of any unauthorized use of your account.</li>
                <li>Not share your account with others.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Roomezy reserves the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
              </p>
            </CardContent>
          </Card>

          {/* Section 5: User Conduct */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <AlertTriangle className="h-6 w-6 text-primary" />
                5. User Conduct
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to use Roomezy responsibly and lawfully. Prohibited activities include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Posting false, misleading, or illegal content.</li>
                <li>Discriminating based on race, gender, religion, or other protected characteristics.</li>
                <li>Harassing, threatening, or abusing other users.</li>
                <li>Sharing sensitive personal information without consent.</li>
                <li>Using the platform for commercial purposes without permission.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Violations may result in content removal, account suspension, or legal action. We encourage safe practices, such as meeting in public places and verifying details.
              </p>
            </CardContent>
          </Card>

          {/* Section 6: Content and Intellectual Property */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <FileText className="h-6 w-6 text-primary" />
                6. Content and Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                By posting content (e.g., photos, descriptions), you grant Roomezy a non-exclusive, royalty-free license to use, display, and distribute it on our platform. You retain ownership of your content but warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>You have the right to share it.</li>
                <li>It does not infringe on third-party rights.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Roomezy's trademarks, logos, and software are protected. You may not copy, modify, or distribute them without permission.
              </p>
            </CardContent>
          </Card>

          {/* Section 7: Privacy */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                7. Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                Your privacy is important. Please review our Privacy Policy, which explains how we collect, use, and protect your data. By using Roomezy, you consent to our data practices as outlined in the Privacy Policy.
              </p>
            </CardContent>
          </Card>

          {/* Section 8: Disclaimers and Limitations of Liability */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <AlertTriangle className="h-6 w-6 text-primary" />
                8. Disclaimers and Limitations of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Roomezy provides the platform "as is" without warranties of any kind. We do not guarantee the accuracy of listings, the suitability of matches, or the safety of interactions. You use the service at your own risk.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                To the fullest extent permitted by law, Roomezy shall not be liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to disputes between users.
              </p>
            </CardContent>
          </Card>

          {/* Section 9: Termination */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                9. Termination
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                You may terminate your account at any time by contacting support or deleting your profile. Roomezy may terminate or suspend your access for violations of these Terms, with or without notice. Upon termination, your right to use the service ceases, but existing obligations remain.
              </p>
            </CardContent>
          </Card>

          {/* Section 10: Governing Law */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <FileText className="h-6 w-6 text-primary" />
                10. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                These Terms are governed by the laws of India, without regard to conflict of law principles. Any disputes shall be resolved in the courts of India.
              </p>
            </CardContent>
          </Card>

          {/* Section 11: Changes to Terms */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <FileText className="h-6 w-6 text-primary" />
                11. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                Roomezy may update these Terms at any time. We will notify users of significant changes via email or in-app notifications. Continued use after changes constitutes acceptance.
              </p>
            </CardContent>
          </Card>

          {/* Section 12: Contact Information */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Mail className="h-6 w-6 text-primary" />
                12. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions about these Terms, please contact us:
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Email: support@roomezy.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Phone: +91-123-456-789</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Last updated: November 2025. These Terms are effective as of the date of your acceptance.
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
}
