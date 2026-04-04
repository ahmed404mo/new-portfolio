"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader2, Github, ExternalLink, Code } from "lucide-react"
import ParticlesBackground from "@/components/particles-background"
import Link from "next/link"
import Image from "next/image"

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://portfolioapi-flame.vercel.app/project");
        const data = await res.json();
        const fetchedProjects = data.data?.projects || data.data || [];
        setProjects(Array.isArray(fetchedProjects) ? fetchedProjects : []);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <Loader2 className="text-[#00BFFF] animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] relative overflow-hidden text-white">
      <ParticlesBackground />

      {/* Header Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#3B82F6]">Work</span>
            </h1>
            <p className="text-lg text-[#9CA3AF] max-w-2xl mx-auto mt-6 leading-relaxed">
              A curated collection of my best projects, highlighting my expertise in full-stack development and creative problem-solving.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="group relative bg-[#161B22] rounded-2xl overflow-hidden border border-[#30363D] hover:border-[#00BFFF]/50 hover:shadow-[0_0_30px_rgba(0,191,255,0.1)] transition-all duration-300 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <Link href={`/projects/${project._id}`} className="block relative h-56 w-full overflow-hidden bg-[#0D1117]">
                    <Image
                      src={project.image || "/project-placeholder.png"}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-[#161B22]/20 to-transparent opacity-80" />
                    <div className="absolute inset-0 bg-[#00BFFF]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>

                  {/* Content Container */}
                  <div className="p-6 flex flex-col flex-grow">
                    
                    <Link href={`/projects/${project._id}`}>
                      <h3 className="text-2xl font-bold text-white group-hover:text-[#00BFFF] transition-colors mb-3 line-clamp-1">
                        {project.title}
                      </h3>
                    </Link>
                    
                    <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                      {project.description}
                    </p>

                    {/* Tech Stack Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.techStack.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-[11px] font-semibold tracking-wide bg-[#0D1117] text-[#E5E7EB] rounded-md border border-[#30363D] group-hover:border-[#00BFFF]/30 transition-colors"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 pt-5 mt-auto border-t border-[#30363D]/50">
                      
                      <Link 
                        href={`/projects/${project._id}`}
                        className="flex-1 py-2.5 bg-[#00BFFF]/10 text-[#00BFFF] font-semibold text-sm rounded-xl text-center hover:bg-[#00BFFF] hover:text-white transition-all duration-300"
                      >
                        View Details
                      </Link>

                      {project.githubLink && (
                        <a 
                          href={project.githubLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 bg-[#161B22] border border-[#30363D] text-[#9CA3AF] rounded-xl hover:text-white hover:border-[#00BFFF]/50 hover:shadow-[0_0_15px_rgba(0,191,255,0.2)] transition-all duration-300"
                          title="View Source Code"
                        >
                          <Github size={20} />
                        </a>
                      )}

                      {project.liveLink && (
                        <a 
                          href={project.liveLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 bg-[#161B22] border border-[#30363D] text-[#9CA3AF] rounded-xl hover:text-white hover:border-[#00BFFF]/50 hover:shadow-[0_0_15px_rgba(0,191,255,0.2)] transition-all duration-300"
                          title="View Live Demo"
                        >
                          <ExternalLink size={20} />
                        </a>
                      )}
                      
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="col-span-full flex flex-col items-center justify-center py-24 text-center"
              >
                <div className="w-20 h-20 bg-[#161B22] rounded-full flex items-center justify-center border border-[#30363D] mb-6">
                  <Code className="text-[#6B7280]" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No Projects Yet</h3>
                <p className="text-[#9CA3AF]">Projects you add from your dashboard will appear here.</p>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center bg-[#161B22] border border-[#30363D] p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/5 to-[#3B82F6]/5" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10 space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white">Let's Build Something Great</h2>
            <p className="text-[#9CA3AF] max-w-xl mx-auto text-lg">
              I'm currently available for freelance work and exciting full-time opportunities.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 mt-4 bg-[#00BFFF] text-white font-bold rounded-xl hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all duration-300"
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