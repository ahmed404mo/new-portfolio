"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Github, 
  Image as ImageIcon, 
  Loader2, 
  X,
  Code2,
  Save,
  AlertTriangle
} from "lucide-react"
import ImageUploader from "@/components/ImageUploader" 

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
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    techStack: "",
    githubLink: "",
    liveLink: ""
  })

  const fetchProjects = async () => {
    try {
      const res = await fetch("https://portfolioapi-flame.vercel.app/project")
      const result = await res.json()
      setProjects(result.data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProjects() }, [])

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        title: project.title,
        description: project.description,
        image: project.image,
        techStack: project.techStack.join(", "),
        githubLink: project.githubLink || "",
        liveLink: project.liveLink || ""
      })
    } else {
      setEditingProject(null)
      setFormData({ title: "", description: "", image: "", techStack: "", githubLink: "", liveLink: "" })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.image) {
      alert("Please upload a project image first.");
      return;
    }

    setIsSubmitting(true)
    const token = localStorage.getItem("token")
    
    const payload = {
      ...formData,
      techStack: formData.techStack.split(",").map(s => s.trim())
    }

    try {
      const url = editingProject 
        ? `https://portfolioapi-flame.vercel.app/project/${editingProject._id}`
        : "https://portfolioapi-flame.vercel.app/project"
      
      const res = await fetch(url, {
        method: editingProject ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        fetchProjects()
        setIsModalOpen(false)
      }
    } catch (error) {
      console.error("Submit error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const confirmDelete = async () => {
    if (!selectedProjectId) return
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`https://portfolioapi-flame.vercel.app/project/${selectedProjectId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        setProjects(projects.filter(p => p._id !== selectedProjectId))
        setIsDeleteModalOpen(false)
      }
    } catch (error) {
      console.error("Delete error:", error)
    }
  }

  if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="animate-spin text-[#00BFFF]" size={40} /></div>

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Projects</h1>
          <p className="text-[#9CA3AF]">Showcase your best work and manage project details.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00BFFF]/20 transition-all"
        >
          <Plus size={20} /> Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {projects.map((project) => (
            <motion.div
              key={project._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden group hover:border-[#00BFFF]/50 transition-all shadow-xl flex flex-col"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-[#0D1117] overflow-hidden flex-shrink-0">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => handleOpenModal(project)} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-[#00BFFF] transition-all"><Pencil size={20} /></button>
                  <button onClick={() => { setSelectedProjectId(project._id); setIsDeleteModalOpen(true); }} className="p-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-red-500 transition-all"><Trash2 size={20} /></button>
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6 space-y-4 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <p className="text-[#9CA3AF] text-sm line-clamp-2 flex-grow">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.techStack.map(tech => (
                    <span key={tech} className="px-3 py-1 bg-[#0D1117] border border-[#30363D] text-[#00BFFF] text-xs rounded-full">{tech}</span>
                  ))}
                </div>
                <div className="flex gap-4 pt-4 border-t border-[#30363D]/50">
                  {project.githubLink && <a href={project.githubLink} target="_blank" className="text-[#6B7280] hover:text-white transition-colors"><Github size={20} /></a>}
                  {project.liveLink && <a href={project.liveLink} target="_blank" className="text-[#6B7280] hover:text-white transition-colors"><ExternalLink size={20} /></a>}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-3xl bg-[#161B22] border border-[#30363D] rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh] hide-scrollbar">
              
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#6B7280] hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#30363D] pb-4">
                {editingProject ? "Edit Project" : "Add New Project"}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[#9CA3AF] flex items-center gap-2">
                    <ImageIcon size={16} /> Project Cover Image
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                    {formData.image && (
                      <div className="w-full sm:w-1/3 flex-shrink-0">
                        <div className="relative aspect-video rounded-lg overflow-hidden border border-[#30363D]">
                          <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white bg-[#00BFFF] px-2 py-1 rounded">Current Image</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="w-full">
                      <ImageUploader onUploadSuccess={handleImageUploaded} />
                      {formData.image && (
                        <p className="text-[10px] text-[#6B7280] mt-2 font-mono truncate">
                          URL: {formData.image}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Project Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Tech Stack (comma separated)</label>
                  <input value={formData.techStack} onChange={e => setFormData({...formData, techStack: e.target.value})} placeholder="React, Node.js, Tailwind..." className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" required />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[#9CA3AF]">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none resize-none" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">GitHub Link (Optional)</label>
                  <input value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Live Demo Link (Optional)</label>
                  <input value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" />
                </div>
                
                <div className="md:col-span-2 flex justify-end gap-4 mt-6 pt-6 border-t border-[#30363D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-[#9CA3AF] hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">Cancel</button>
                  <button disabled={isSubmitting || !formData.image} className="px-8 py-3 bg-[#00BFFF] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00BFFF]/30 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingProject ? "Update Project" : "Create Project"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Delete Confirmation (Popup) */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-white">Delete Project?</h3>
              <p className="text-[#9CA3AF]">This will permanently remove the project from your portfolio.</p>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-[#30363D] text-white rounded-xl">Cancel</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}