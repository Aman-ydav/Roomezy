import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground border-t border-border m-0 p-0">
      {/* Main Footer Content */}
      <div className="w-full py-10 md:py-14 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left px-6 sm:px-8 lg:px-12">
        {/* Brand Section */}
        <div className="flex flex-col items-center md:items-start">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="Roomezy logo"
              className="w-12 h-12 rounded-lg shadow-md bg-white"
            />
            <h2 className="text-3xl font-extrabold tracking-tight">Roomezy</h2>
          </div>
          <p className="text-base sm:text-md text-primary-foreground/95 leading-relaxed max-w-sm">
            Connecting roommates, simplifying living. <br />
            Find your ideal match with trust, comfort, and convenience — all in
            one place.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start gap-2">
          <h3 className="text-xl font-semibold mb-3 underline decoration-accent/50 underline-offset-4">
            Quick Links
          </h3>
          <Link
            to="/"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/find-room"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            Find a Room
          </Link>
          <Link
            to="/list-room"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            List a Room
          </Link>
          <Link
            to="/about"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            Contact
          </Link>
        </div>

        {/* Support Section */}
        <div className="flex flex-col items-center md:items-end gap-2">
          <h3 className="text-xl font-semibold mb-3 underline decoration-accent/50 underline-offset-4">
            Support
          </h3>
          <Link
            to="/privacy"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            Privacy Policy
          </Link>
          <Link
            to="/terms"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            Terms of Service
          </Link>
          <Link
            to="/help"
            className="text-base hover:text-accent transition-colors duration-200"
          >
            Help Center
          </Link>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-primary-foreground/20"></div>

      {/* Big Branding Line */}
      <div className="w-full flex justify-center py-6 bg-linear-to-r from-primary/10 to-primary/60 m-0">
        <h1
          className="text-[10vw] sm:text-[8vw] md:text-[6vw] lg:text-[4vw] font-extrabold
            text-primary-foreground hover:text-accent transition-all duration-300
            text-center leading-none tracking-[1vw] sm:tracking-[2vw] md:tracking-[3vw] lg:tracking-[4vw]
          "
        >
          ROOMEZY
        </h1>
      </div>
    </footer>
  );
}
