"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, Loader2, Github, ExternalLink, Calendar, Code2, LayoutDashboard } from "lucide-react"
import Image from "next/image"

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubLink?: string;
  liveLink?: string;
  createdAt?: string;
}

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id

  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

useEffect(() => {
    const fetchSingleProject = async () => {
      try {
        const res = await fetch(`https://portfolioapi-flame.vercel.app/project`)
        const data = await res.json()
        
        const allProjects = data.data?.projects || data.data || [];
        
        const foundProject = allProjects.find((p: Project) => p._id === id);
        
        if (foundProject) {
          setProject({
            ...foundProject,
            techStack: Array.isArray(foundProject.techStack) 
              ? foundProject.techStack 
              : typeof foundProject.techStack === 'string' 
                ? foundProject.techStack.split(',').map((t: string) => t.trim()) 
                : []
          })
        } else {
          setProject(null)
        }
        
      } catch (error) {
        console.error("Error fetching project details:", error)
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchSingleProject()
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-[#00BFFF] animate-spin" size={48} />
          <p className="text-[#9CA3AF] animate-pulse font-medium">Loading Project Details...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex flex-col items-center justify-center text-white space-y-4">
        <LayoutDashboard size={64} className="text-[#30363D]" />
        <h1 className="text-3xl font-bold">Project Not Found</h1>
        <p className="text-[#9CA3AF]">The project you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/projects')} className="text-[#00BFFF] hover:underline mt-4 font-semibold">
          Return to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white pb-24">
      
      {/* 🔙 Back Button Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-[#30363D] py-4">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={() => router.push('/projects')}
            className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors group w-fit"
          >
            <div className="p-2 bg-[#161B22] rounded-full border border-[#30363D] group-hover:border-[#00BFFF] transition-colors">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="font-medium text-sm">Back to all projects</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        
        {/* Header (Title & Links) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              {project.title || "Untitled Project"}
            </h1>
            <div className="flex items-center gap-4 text-[#6B7280] text-sm">
              <span className="flex items-center gap-1.5"><Code2 size={16} /> Full-Stack Application</span>
              {project.createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} /> {new Date(project.createdAt).getFullYear()}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-wrap gap-4">
            {project.githubLink && (
              <a 
                href={project.githubLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#161B22] border border-[#30363D] rounded-xl hover:bg-[#30363D] hover:text-[#00BFFF] transition-all font-semibold text-sm"
              >
                <Github size={18} /> Source Code
              </a>
            )}
            {project.liveLink && (
              <a 
                href={project.liveLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-[#00BFFF] text-white rounded-xl hover:shadow-[0_0_20px_rgba(0,191,255,0.4)] transition-all font-bold text-sm"
              >
                <ExternalLink size={18} /> Live Preview
              </a>
            )}
          </motion.div>
        </div>

        {/* Hero Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative w-full aspect-video md:h-[500px] rounded-3xl overflow-hidden border border-[#30363D] shadow-2xl bg-[#161B22] mb-12"
        >
          <Image
            src={project.image || "/project-placeholder.png"}
            alt={project.title || "Project Image"}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D1117] via-transparent to-transparent opacity-60" />
        </motion.div>

        {/* Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Description */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-8"
          >
            <div className="bg-[#161B22] border border-[#30363D] p-8 md:p-10 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#30363D] pb-4">Project Overview</h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed whitespace-pre-wrap">
                {project.description || "No description provided for this project."}
              </p>
            </div>
          </motion.div>

          {/* Sidebar (Tech Stack & Details) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Tech Stack Box */}
            <div className="bg-[#161B22] border border-[#30363D] p-8 rounded-3xl shadow-lg">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Code2 className="text-[#00BFFF]" /> Technologies Used
              </h3>
              
              {project.techStack && project.techStack.length > 0 ? (
                <div className="flex flex-wrap gap-2.5">
                  {project.techStack.map((tech, index) => (
                    <span 
                      key={`${tech}-${index}`} 
                      className="px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E5E7EB] rounded-lg text-sm font-semibold hover:border-[#00BFFF]/50 hover:text-[#00BFFF] transition-colors cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[#6B7280] text-sm italic">No technologies listed.</p>
              )}
            </div>

            {/* CTA Box */}
            <div className="bg-gradient-to-br from-[#00BFFF]/10 to-[#3B82F6]/5 border border-[#00BFFF]/20 p-8 rounded-3xl shadow-lg">
              <h3 className="text-xl font-bold text-white mb-2">Like this project?</h3>
              <p className="text-[#9CA3AF] mb-6 text-sm leading-relaxed">Let's collaborate and build something amazing together.</p>
              <button 
                onClick={() => router.push('/contact')}
                className="w-full py-3.5 bg-[#00BFFF] text-white font-bold rounded-xl hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(0,191,255,0.4)] transition-all"
              >
                Contact Me
              </button>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  )
}