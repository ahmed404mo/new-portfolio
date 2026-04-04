"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, 
  Loader2, 
  CheckCircle2,
  Info,
  ArrowLeft,
  Cpu,
  Type,
  Image as ImageIcon,
  AlertCircle, 
  X 
} from "lucide-react"
import ImageUploader from "@/components/ImageUploader" 

export default function AboutDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    pageTitle: "",
    pageSubtitle: "",
    missionTitle: "",
    missionDescription: "",
    aboutImage: "" 
  })

  const fetchAboutData = async () => {
    try {
      const res = await fetch("https://portfolioapi-flame.vercel.app/about", { cache: "no-store" }) 
      const result = await res.json()
      
      if (result.data) {
        setFormData({
          pageTitle: result.data.pageTitle || "Behind the Systems",
          pageSubtitle: result.data.pageSubtitle || "Engineering high-performance solutions...",
          missionTitle: result.data.missionTitle || "Technical Vision",
          missionDescription: result.data.missionDescription || "I am a Full-Stack Developer...",
          aboutImage: result.data.aboutImage || "" 
        })
      }
    } catch (error) {
      console.error("Error fetching about data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAboutData() }, [])

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, aboutImage: url }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg(null) 
    const token = localStorage.getItem("token")

    try {
      const res = await fetch("https://portfolioapi-flame.vercel.app/about", {
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
         const errorData = await res.json()
         setErrorMsg(errorData.message || "Failed to update content. Please try again.")
      }
    } catch (error) {
      console.error("Update error:", error)
      setErrorMsg("Connection error. Please check your internet or server.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) return (
    <div className="h-[80vh] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#00BFFF]" size={40} />
    </div>
  )

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 relative">
      
      <AnimatePresence>
        {errorMsg && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setErrorMsg(null)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-6 z-[101] shadow-2xl flex flex-col items-center text-center gap-4"
            >
              <button 
                onClick={() => setErrorMsg(null)}
                className="absolute top-4 right-4 text-[#6B7280] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mt-2">
                <AlertCircle size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-white">Oops! Error</h3>
                <p className="text-[#9CA3AF] text-sm leading-relaxed">{errorMsg}</p>
              </div>
              <button 
                onClick={() => setErrorMsg(null)}
                className="w-full mt-2 py-3 bg-[#30363D] text-white font-semibold rounded-xl hover:bg-[#3b424b] transition-all"
              >
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => router.push("/dashboard")}
        className="flex items-center gap-2 text-[#9CA3AF] hover:text-[#00BFFF] transition-colors group mb-2"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium text-sm italic">Back to Dashboard</span>
      </motion.button>

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Info className="text-[#00BFFF]" /> About Page Content
          </h1>
          <p className="text-[#9CA3AF]">Manage the text, image, and mission statement on your public About page.</p>
        </div>
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              className="bg-green-500/10 text-green-500 px-4 py-2 rounded-xl border border-green-500/20 flex items-center gap-2"
            >
              <CheckCircle2 size={18} /> Content Saved
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-[#00BFFF] mb-2 font-bold text-xs uppercase tracking-wider">
              <Type size={16} /> Hero Section
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Page Main Title</label>
              <input 
                required
                value={formData.pageTitle}
                onChange={e => setFormData({...formData, pageTitle: e.target.value})}
                placeholder="e.g. Behind the Systems"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Page Subtitle</label>
              <textarea 
                rows={3}
                required
                value={formData.pageSubtitle}
                onChange={e => setFormData({...formData, pageSubtitle: e.target.value})}
                placeholder="Engineering high-performance solutions..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none resize-none"
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs text-[#9CA3AF] flex items-center gap-2">
                <ImageIcon size={14} /> About Page Image
              </label>
              
              {formData.aboutImage && (
                <div className="mb-2 relative w-full h-32 rounded-xl overflow-hidden border border-[#30363D]">
                  <img src={formData.aboutImage} alt="Current About" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] bg-black/50 px-2 py-1 rounded text-white">Current Active Image</span>
                  </div>
                </div>
              )}

              <ImageUploader onUploadSuccess={handleImageUploaded} />
              <p className="text-[10px] text-[#6B7280] mt-1 pl-1 italic">
                Current URL: {formData.aboutImage || "No image set"}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161B22] border border-[#30363D] p-6 rounded-2xl space-y-4 shadow-lg">
            <div className="flex items-center gap-2 text-[#00BFFF] mb-2 font-bold text-xs uppercase tracking-wider">
              <Cpu size={16} /> Technical Mission
            </div>
            
            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Mission Title</label>
              <input 
                required
                value={formData.missionTitle}
                onChange={e => setFormData({...formData, missionTitle: e.target.value})}
                placeholder="e.g. Technical Vision"
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#9CA3AF]">Mission Description (Your Bio)</label>
              <textarea 
                rows={6}
                required
                value={formData.missionDescription}
                onChange={e => setFormData({...formData, missionDescription: e.target.value})}
                placeholder="I am a Full-Stack Developer specializing in..."
                className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none resize-none leading-relaxed"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] text-white font-bold rounded-2xl hover:shadow-lg hover:shadow-[#00BFFF]/30 transition-all flex items-center justify-center gap-2 group"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} className="group-hover:scale-110 transition-transform" />}
            Save About Content
          </button>
        </div>
      </form>
    </div>
  )
}