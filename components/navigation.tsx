"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation"; 

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredPath, setHoveredPath] = useState<string | null>(null); 
  const pathname = usePathname();
  const [profile, setProfile] = useState({ name: "Ahmed", logo: "/portTwo.png" });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://portfolioapi-flame.vercel.app/profile");
        const result = await res.json();
        if (result?.data?.profile || result?.data) {
          const data = result.data.profile || result.data;
          setProfile({
            name: data.fullName ? data.fullName.split(' ')[0] : "Ahmed",
            logo: data.logo || data.avatar || "/portTwo.png" 
          });
        }
      } catch (error) {
        console.error("Error fetching nav profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Projects" },
    { href: "/skills", label: "Skills" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-lg border-b border-[#30363D]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-[#00BFFF]/50 transition-shadow overflow-hidden p-0.5">
              <div className="w-full h-full bg-[#0D1117] rounded-md overflow-hidden relative">
                <Image
                  alt="Brand Logo"
                  src={profile.logo}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
            </div>
            <span className="font-bold text-lg text-white">{profile.name}</span> 
          </Link>

          <div 
            className="hidden md:flex items-center gap-2"
            onMouseLeave={() => setHoveredPath(null)} 
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onMouseEnter={() => setHoveredPath(link.href)} 
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 rounded-md ${
                    isActive ? "text-white" : "text-[#9CA3AF] hover:text-white"
                  }`}
                >
                  {hoveredPath === link.href && (
                    <motion.span
                      layoutId="hoverBackground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-[#30363D]/50 rounded-md -z-10"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.5
                      }}
                    />
                  )}
                  
                  {link.label}

                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00BFFF] mx-4"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white hover:text-[#00BFFF] transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden pb-4 space-y-2 overflow-hidden"
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className="block px-4 py-2 text-sm font-medium text-[#9CA3AF] hover:text-[#00BFFF] hover:bg-[#161B22] rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}