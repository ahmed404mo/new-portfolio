"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Loader2, Download } from "lucide-react"
import ParticlesBackground from "@/components/particles-background"

// تعريف شكل البيانات اللي هترجع من الباك اند
interface ProfileData {
  fullName: string;
  jobTitle: string;
  bio: string;
  avatar: string;
  cvLink?: string;
  projectsCount?: string;
  certificatesCount?: string;
  skillsCount?: string;
}

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("https://portfolioapi-flame.vercel.app/profile");
        const result = await res.json();
        
        if (result.data) {
          setProfile(result.data);
        } else {
           console.warn("Profile data is empty or malformed", result);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <Loader2 className="text-[#00BFFF] animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] relative overflow-hidden">
      <ParticlesBackground />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 order-2 lg:order-1"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[#00BFFF] font-semibold text-lg"
              >
                {profile?.jobTitle || "Full-Stack Developer"}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
              >
                Hi, I'm <span className="gradient-text">{profile?.fullName?.split(' ')[0] || "Ahmed"}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-[#9CA3AF] leading-relaxed"
              >
                Building scalable web applications and intuitive digital experiences
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-lg text-[#6B7280] leading-relaxed"
              >
                {profile?.bio || "Passionate about engineering robust web applications and scalable digital solutions."}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row flex-wrap gap-4 pt-8" 
              >
                <Link
                  href="/projects"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00BFFF]/50 transition-all hover:scale-105 animate-glow"
                >
                  View Projects
                  <ArrowRight size={20} />
                </Link>

                {profile?.cvLink && (
                  <a
                    href={profile.cvLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#161B22] border border-[#30363D] text-white font-semibold rounded-lg hover:bg-[#30363D] hover:border-[#00BFFF]/50 transition-all glow-border"
                  >
                    <Download size={20} className="text-[#00BFFF]" />
                    Download CV
                  </a>
                )}

                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-[#00BFFF] text-[#00BFFF] font-semibold rounded-lg hover:bg-[#00BFFF]/10 transition-all glow-border"
                >
                  Contact Me
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative order-1 lg:order-2 flex justify-center"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] rounded-full blur-3xl opacity-30 animate-pulse" />

                <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-[#00BFFF]/30 shadow-2xl shadow-[#00BFFF]/20 bg-[#0D1117]">
                  <img
                    src={profile?.avatar || "/portTwo.png"}
                    alt={`${profile?.fullName || "Ahmed"}'s Profile`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <motion.div
                  animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-20 h-20 bg-[#00BFFF]/20 rounded-lg backdrop-blur-sm border border-[#00BFFF]/30"
                />
                <motion.div
                  animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#3B82F6]/20 rounded-lg backdrop-blur-sm border border-[#3B82F6]/30"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { number: profile?.projectsCount || "10+", label: "Projects Completed" },
              { number: profile?.certificatesCount || "5+", label: "Certificates Earned" },
              { number: profile?.skillsCount || "15+", label: "Skills Mastered" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="text-center p-8 rounded-xl bg-[#161B22] border border-[#30363D] hover:border-[#00BFFF]/50 transition-all group"
              >
                <div className="text-5xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <p className="text-[#9CA3AF] font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Let's Create Something <span className="gradient-text">Amazing</span> Together
            </h2>
            <p className="text-lg text-[#9CA3AF] leading-relaxed max-w-2xl mx-auto">
              Ready to turn your ideas into scalable digital realities? Let's build robust web applications together.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-[#00BFFF]/50 transition-all hover:scale-105 animate-glow"
            >
              Get In Touch
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}