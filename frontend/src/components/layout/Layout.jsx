import { useState, useEffect, useRef } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import Navbar from "./Navbar";
import { motion } from "framer-motion";
import SidebarCoachmark from "@/components/ui/SidebarCoachmark";


export default function Layout() {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const sidebarIconRef = useRef(null); // Reference for the sidebar icon

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarOpen((prev) => !prev);
    }
  };

  // Detect viewport for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle click outside and Esc key
  useEffect(() => {
    if (!sidebarOpen) return;

    const handleClickOutside = (e) => {
      if (e.target.closest("[data-sidebar-toggle]")) return;
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-hidden">
      {/* Fixed Navbar */}
      <Navbar
        onToggleSidebar={toggleSidebar}
        isSidebarOpen={sidebarOpen || mobileSidebarOpen}
        sidebarIconRef={sidebarIconRef}
      />

      <SidebarCoachmark targetRef={sidebarIconRef} />

      <div className="flex flex-1 relative">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <motion.aside
            ref={sidebarRef}
            initial={{ x: -300, opacity: 0 }}
            animate={{
              x: sidebarOpen ? 0 : -300,
              opacity: sidebarOpen ? 1 : 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="
                fixed left-0 top-[50px] 
                h-[calc(100vh-50px)] w-72 
                bg-card/70 backdrop-blur-md 
                border-r border-border shadow-lg 
                z-40
              "
          >
            {/* Pass setSidebarOpen for desktop */}
            <Sidebar setOpen={setSidebarOpen} />
          </motion.aside>
        )}

        {/* Mobile Sidebar (slides below navbar) */}
        {isMobile && (
          <MobileSidebar
            open={mobileSidebarOpen}
            setOpen={setMobileSidebarOpen}
          />
        )}

        {/* Main Content */}
        <motion.main
          animate={{
            marginLeft: !isMobile && sidebarOpen ? 288 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="
            flex-1 mt-16 
            transition-all
          "
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
