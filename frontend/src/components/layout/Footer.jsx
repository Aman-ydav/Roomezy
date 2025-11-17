import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground border-t border-border">

      {/* TOP GRID */}
      <div className="w-full py-10 md:py-14 px-6 sm:px-10 lg:px-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={logo}
              alt="Roomezy logo"
              className="w-12 h-12 rounded-lg shadow bg-white"
            />
            <h2 className="text-3xl font-extrabold">Roomezy</h2>
          </div>
          <p className="text-base text-primary-foreground/90 max-w-xs leading-relaxed">
            Connecting roommates & simplifying shared living.
            Find, connect, and live better — all in one place.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center lg:items-start gap-2">
          <h3 className="text-lg font-semibold mb-2 tracking-wide">Navigation</h3>
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/about" className="footer-link">About Us</Link>
          <Link to="/help" className="footer-link">Help Center</Link>
        </div>

        <div className="flex flex-col items-center lg:items-start gap-2">
          <h3 className="text-lg font-semibold mb-2 tracking-wide">Resources</h3>

          <Link to="/find-room" className="footer-link">
            How to Find a Room
          </Link>

          <Link to="/list-room" className="footer-link">
            How to List a Room
          </Link>

        </div>

        <div className="flex flex-col items-center lg:items-start gap-2">
          <h3 className="text-lg font-semibold mb-2 tracking-wide">Legal</h3>
          <Link to="/privacy" className="footer-link">Privacy Policy</Link>
          <Link to="/terms" className="footer-link">Terms of Service</Link>
        </div>

      </div>

      <div className="border-t border-primary-foreground/20"></div>

      <div className="w-full py-6 flex justify-center bg-primary/20">
        <p className="text-sm tracking-wide opacity-90">
          © {new Date().getFullYear()} Roomezy · All Rights Reserved
        </p>
      </div>

    </footer>
  );
}

<style>
{`
  .footer-link {
    @apply text-base opacity-90 hover:opacity-100 hover:text-accent transition-all duration-200;
  }
`}
</style>
