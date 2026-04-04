"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, 
  Briefcase, 
  FileText, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle2,
  Github,
  Linkedin,
  ArrowLeft,
  Link as LinkIcon,
  Download,
  BarChart3,
  AlertCircle,
  Hexagon 
} from "lucide-react"
import ImageUploader from "@/components/ImageUploader"

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    fullName: "",
    jobTitle: "",
    bio: "",
    avatar: "",
    logo: "", 
    github: "",
    linkedin: "",
    cvLink: "",
    projectsCount: "",
    certificatesCount: "",
    skillsCount: ""
  })

  const fetchProfileData = async () => {
    try {
      const res = await fetch("https://portfolioapi-flame.vercel.app/profile")
      const result = await res.json()
      
      const profileData = result?.data?.profile || result?.data;
      if (profileData) {
        setFormData({
          fullName: profileData.fullName || "",
          jobTitle: profileData.jobTitle || "",
          bio: profileData.bio || "",
          avatar: profileData.avatar || "",
          logo: profileData.logo || "", 
          github: profileData.github || "",
          linkedin: profileData.linkedin || "",
          cvLink: profileData.cvLink || "",
          projectsCount: profileData.projectsCount || "",
          certificatesCount: profileData.certificatesCount || "",
          skillsCount: profileData.skillsCount || ""
        })
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchProfileData() }, [])

  const handleAvatarUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, avatar: url }))
  }

  const handleLogoUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, logo: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null)
    const token = localStorage.getItem("token")

    try {
      const res = await fetch("https://portfolioapi-flame.vercel.app/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowSuccess(true)
        setTimeout(() => setShowSuccess(false), 3000)
      } else {
        const result = await res.json()
        setErrorMsg(result.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Update error:", error)
      setErrorMsg("Connection error. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#00BFFF]" size={40} />
    </div>
  )

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#00BFFF] transition-colors group mb-2"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-sm italic">Back to Dashboard</span>
      </motion.button>

      {/* Header */}
      <div className="flex justify-between items-center relative">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <User className="text-[#00BFFF]" /> Profile Settings
          </h1>
          <p className="text-[#9CA3AF]">Update your personal details, bio, brand logo, and social links.</p>
        </div>
        
        <div className="absolute right-0 top-0 flex flex-col gap-2 z-50">
          <AnimatePresence>
            {showSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl border border-green-500/20 flex items-center gap-2"
              >
                <CheckCircle2 size={18} /> Profile Saved
              </motion.div>
            )}
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
                className="bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 flex items-center gap-2"
              >
                <AlertCircle size={18} /> {errorMsg}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          {/* Card Preview */}
          <div className="bg-[#161B22] border border-[#30363D] p-8 rounded-3xl text-center space-y-4 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6]" />
            
            {formData.logo && (
              <div className="absolute top-4 left-4 w-12 h-12 bg-[#0D1117] border border-[#30363D] rounded-lg p-1.5 shadow-lg">
                <img src={formData.logo} alt="Brand Logo" className="w-full h-full object-contain" />
              </div>
            )}
            
            <div className="relative w-40 h-40 mx-auto mt-4">
              <div className="absolute inset-0 bg-[#00BFFF]/20 rounded-full blur-xl" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#161B22] shadow-[0_0_0_2px_#30363D]">
                <img 
                  src={formData.avatar || "https://ui-avatars.com/api/?name=Ahmed+Mokhtar&background=0D1117&color=00BFFF"} 
                  alt="Avatar Preview" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{formData.fullName || "Ahmed Mokhtar"}</h2>
              <p className="text-[#00BFFF] text-xs font-mono uppercase tracking-widest mt-1">{formData.jobTitle || "Full-Stack Developer"}</p>
            </div>
          </div>

          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-6 shadow-lg">
            <div className="flex items-center gap-2 text-[#00BFFF] mb-2 font-bold text-xs uppercase tracking-wider border-b border-[#30363D]/50 pb-2">
              <Camera size={16} /> Brand & Media
            </div>
            
            <div className="space-y-2">
              <label className="text-xs text-[#9CA3AF] flex items-center gap-2">
                <User size={14} /> Profile Avatar Image
              </label>
              <ImageUploader onUploadSuccess={handleAvatarUploaded} />
            </div>

            <div className="space-y-2 pt-4 border-t border-[#30363D]/50">
              <label className="text-xs text-[#9CA3AF] flex items-center gap-2">
                <Hexagon size={14} /> Brand Logo (Navbar/Footer)
              </label>
              <ImageUploader onUploadSuccess={handleLogoUploaded} />
            </div>
          </div>
        </div>

        {/* Right Column: Links, Basic Details & Stats */}
        <div className="space-y-6">
          
          {/* Social Links */}
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-[#00BFFF] mb-2 font-bold text-xs uppercase tracking-wider">
              <LinkIcon size={16} /> Social Links & Resume
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Resume (CV Link)</label>
              <div className="relative">
                <Download className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                <input 
                  value={formData.cvLink}
                  onChange={e => setFormData({...formData, cvLink: e.target.value})}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#00BFFF] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">GitHub Profile</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                <input 
                  value={formData.github}
                  onChange={e => setFormData({...formData, github: e.target.value})}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#00BFFF] outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">LinkedIn Profile</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                <input 
                  value={formData.linkedin}
                  onChange={e => setFormData({...formData, linkedin: e.target.value})}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-2.5 text-white text-sm focus:border-[#00BFFF] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* General Information */}
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-[#00BFFF] mb-2 font-bold text-xs uppercase tracking-wider">
              <FileText size={16} /> General Information
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                <input 
                  required
                  value={formData.fullName}
                  onChange={e => setFormData({...formData, fullName: e.target.value})}
                  placeholder="e.g. Ahmed Mokhtar"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#00BFFF] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={16} />
                <input 
                  required
                  value={formData.jobTitle}
                  onChange={e => setFormData({...formData, jobTitle: e.target.value})}
                  placeholder="e.g. Full-Stack Developer"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl pl-10 pr-4 py-3 text-white focus:border-[#00BFFF] outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Short Bio (Appears in Header/Footer)</label>
              <textarea 
                rows={4}
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                placeholder="A brief introduction about yourself..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Quick Stats Edit */}
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-[#00BFFF] mb-2 font-bold text-xs uppercase tracking-wider">
              <BarChart3 size={16} /> Quick Stats
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-[#9CA3AF]">Projects</label>
                <input 
                  value={formData.projectsCount}
                  onChange={e => setFormData({...formData, projectsCount: e.target.value})}
                  placeholder="e.g. 10+"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2.5 text-white text-center text-sm focus:border-[#00BFFF] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#9CA3AF]">Certificates</label>
                <input 
                  value={formData.certificatesCount}
                  onChange={e => setFormData({...formData, certificatesCount: e.target.value})}
                  placeholder="e.g. 5+"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2.5 text-white text-center text-sm focus:border-[#00BFFF] outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[#9CA3AF]">Skills</label>
                <input 
                  value={formData.skillsCount}
                  onChange={e => setFormData({...formData, skillsCount: e.target.value})}
                  placeholder="e.g. 15+"
                  className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-3 py-2.5 text-white text-center text-sm focus:border-[#00BFFF] outline-none"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#00BFFF]/30 transition-all flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  )
}