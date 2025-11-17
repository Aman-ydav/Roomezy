import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Eye,
  Lock,
  Users,
  Mail,
  Phone,
  Cookie,
  AlertTriangle,
} from "lucide-react";
import ScrollToTop from "@/components/layout/ScrollToTop";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground scrollbar-hide">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 bg-linear-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <Shield className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <h1 className="text-3xl md:text-5xl font-bold text-primary">Privacy Policy</h1>
          </div>
          <p className="text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed px-4">
            At Roomezy, your privacy is our priority. This Privacy Policy explains how we collect, use, protect, and share your information when you use our platform for connecting with roommates, rooms, and shared living spaces. By using Roomezy, you agree to the practices described here.
          </p>
        </div>
      </section>

    
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">

          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Eye className="h-6 w-6 text-primary" />
                1. Introduction
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                This Privacy Policy applies to all users of Roomezy, including our website, mobile app, and related services. We are committed to protecting your personal information and being transparent about our practices. If you have any questions, please contact us at support@roomezy.com.
              </p>
            </CardContent>
          </Card>

          {/* Section 2: Information We Collect */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Users className="h-6 w-6 text-primary" />
                2. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We collect information to provide and improve our services. This includes:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Personal Information:</strong> Email, password, display name, bio, age, and multiple locations (stored in an array) provided during registration or profile updates.</li>
                <li><strong>Post and Profile Data:</strong> Details from your posts (e.g., rent, room type, preferences) and uploaded photos.</li>
                <li><strong>Usage Data:</strong> Information about how you interact with the platform, such as pages viewed, searches, and device information (e.g., IP address, browser type).</li>
                <li><strong>Communications:</strong> Messages sent through our future chat feature or via email/phone shared in posts.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                We do not collect sensitive data like financial details unless necessary for specific features (e.g., payments, if implemented).
              </p>
            </CardContent>
          </Card>

     
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Eye className="h-6 w-6 text-primary" />
                3. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your information helps us deliver a personalized experience. We use it to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Create and manage your account and posts.</li>
                <li>Match you with potential roommates or rooms based on preferences and locations.</li>
                <li>Improve our platform through analytics and user feedback.</li>
                <li>Communicate updates, support, or security alerts.</li>
                <li>Ensure compliance with our Terms of Service and legal obligations.</li>
              </ul>
            </CardContent>
          </Card>

        
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Users className="h-6 w-6 text-primary" />
                4. Sharing Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell your personal information. We may share it in the following ways:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>With Other Users:</strong> Public profile details and post information are visible to facilitate connections.</li>
                <li><strong>Service Providers:</strong> Trusted third parties for hosting, analytics, or support (under strict confidentiality).</li>
                <li><strong>Legal Requirements:</strong> If required by law, to protect rights, or in response to legal processes.</li>
                <li><strong>Business Transfers:</strong> In case of a merger or sale, your data may be transferred.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You control some sharing through privacy settings in your dashboard.
              </p>
            </CardContent>
          </Card>

          {/* Section 5: Data Security */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Lock className="h-6 w-6 text-primary" />
                5. Data Security
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures to protect your data, including encryption, secure servers, and access controls. However, no system is 100% secure. We recommend using strong passwords and not sharing sensitive information publicly. In case of a breach, we will notify affected users promptly.
              </p>
            </CardContent>
          </Card>

          {/* Section 6: Your Rights and Choices */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                6. Your Rights and Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have control over your data. Depending on your location, you may have rights such as:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Access and Update:</strong> View and edit your profile and posts via the dashboard.</li>
                <li><strong>Delete:</strong> Request deletion of your account and data, subject to legal retention requirements.</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from emails or adjust visibility settings.</li>
                <li><strong>Data Portability:</strong> Request a copy of your data in a portable format.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To exercise these rights, contact us at support@roomezy.com. We will respond within 30 days.
              </p>
            </CardContent>
          </Card>

          {/* Section 7: Cookies and Tracking */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Cookie className="h-6 w-6 text-primary" />
                7. Cookies and Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use cookies and similar technologies to enhance your experience:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Essential Cookies:</strong> For login and security.</li>
                <li><strong>Analytics Cookies:</strong> To understand usage and improve the platform.</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-4">
                You can manage cookies through your browser settings. Disabling them may affect functionality.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <AlertTriangle className="h-6 w-6 text-primary" />
                8. Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                Roomezy is not intended for children under 18. We do not knowingly collect personal information from minors. If we discover such data, we will delete it immediately. Parents or guardians should monitor their children's online activities.
              </p>
            </CardContent>
          </Card>

          {/* Section 9: Changes to This Policy */}
          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Shield className="h-6 w-6 text-primary" />
                9. Changes to This Policy
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy to reflect changes in our practices or laws. Significant changes will be communicated via email or in-app notifications. Your continued use of Roomezy after updates indicates acceptance.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border shadow-lg">
            <CardHeader className="bg-muted/20">
              <CardTitle className="flex items-center gap-3 text-xl md:text-2xl">
                <Mail className="h-6 w-6 text-primary" />
                10. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have questions or concerns about this Privacy Policy, please reach out:
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>Email: support@roomezy.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>Phone: +91 123-456-789</span>
                </div>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Last updated: November 2025 . This policy is effective as of the date posted.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Scroll Indicator */}
      <ScrollToTop/>
    </div>
  );
}
