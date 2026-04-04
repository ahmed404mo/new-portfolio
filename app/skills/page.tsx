"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Code2, Terminal } from "lucide-react"
import ParticlesBackground from "@/components/particles-background"

interface Skill {
  _id: string;
  name: string;
  level: number;
  icon: string;
  category?: string; 
}

// ديزاين الكارت الجديد
const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.05, duration: 0.4 }}
    className="relative group bg-[#161B22] border border-[#30363D] rounded-2xl p-6 flex flex-col items-center justify-center hover:-translate-y-2 hover:border-[#00BFFF]/50 transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(0,191,255,0.15)] overflow-hidden"
  >
    {/* خط علوي بينور في الـ Hover */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00BFFF] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

    {/* الأيقونة (تم تكبيرها هنا) */}
    <div className="w-20 h-20 rounded-2xl bg-[#0D1117] border border-[#30363D] p-3 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500 shadow-inner">
      {skill.icon?.startsWith("http") || skill.icon?.startsWith("data:image") ? (
        <img src={skill.icon} alt={skill.name} className="w-full h-full object-contain drop-shadow-md" />
      ) : (
        <Code2 size={40} className="text-[#9CA3AF] group-hover:text-[#00BFFF] transition-colors" />
      )}
    </div>

    {/* اسم المهارة */}
    <h3 className="text-lg font-bold text-[#E6EDF3] text-center mb-3 line-clamp-1">
      {skill.name}
    </h3>

    {/* شريط النسبة المئوية الصغير */}
    <div className="w-full space-y-1.5">
      <div className="flex justify-between text-xs font-medium text-[#9CA3AF]">
        <span>Proficiency</span>
        <span className="text-[#00BFFF]">{skill.level}%</span>
      </div>
      <div className="w-full bg-[#0D1117] rounded-full h-1.5 overflow-hidden border border-[#30363D]/50">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          transition={{ duration: 1, delay: 0.2 + (index * 0.05) }}
          className="h-full bg-gradient-to-r from-[#00BFFF]/50 to-[#00BFFF] rounded-full"
        />
      </div>
    </div>
  </motion.div>
);

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("https://portfolioapi-flame.vercel.app/skills");
        const result = await res.json();
        const fetchedData = result.data || [];
        setSkills(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        console.error("Error fetching skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const techSkills = skills.filter(s => s.category === "technical" || !s.category);

  if (loading) return (
    <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-[#00BFFF] animate-spin" size={48} />
        <p className="text-[#9CA3AF] font-medium animate-pulse">Loading technologies...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0D1117] relative overflow-hidden text-white pb-24">
      <ParticlesBackground />

      {/* Header */}
      <section className="relative pt-32 pb-16 px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center p-3 bg-[#00BFFF]/10 rounded-2xl mb-6 border border-[#00BFFF]/20"
        >
          <Terminal className="text-[#00BFFF]" size={28} />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
        >
          Technology <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#3B82F6]">Stack</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[#9CA3AF] max-w-2xl mx-auto text-lg leading-relaxed"
        >
          A comprehensive overview of my programming languages, frameworks, and development tools.
        </motion.p>
      </section>

      {/* Skills Grid */}
      <section className="px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl mx-auto">
        <AnimatePresence>
          {techSkills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
              {techSkills.map((skill, index) => (
                <SkillCard key={skill._id} skill={skill} index={index} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center bg-[#161B22] rounded-3xl border border-dashed border-[#30363D] max-w-2xl mx-auto"
            >
              <Code2 className="text-[#6B7280] mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">No Skills Added Yet</h3>
              <p className="text-[#9CA3AF]">Your tech stack will appear here once added from the dashboard.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}