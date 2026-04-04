"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Image as ImageIcon, 
  Loader2, 
  X,
  Award,
  Save,
  AlertTriangle,
  Calendar,
  Building
} from "lucide-react"
import ImageUploader from "@/components/ImageUploader" 

interface Certificate {
  _id: string;
  title: string;
  issuer: string; 
  date: string;
  image: string;
  link?: string; 
}

export default function CertificatesDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certificate | null>(null)
  const [selectedCertId, setSelectedCertId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    issuer: "",
    date: "",
    image: "",
    link: ""
  })

  // جلب الشهادات
  const fetchCertificates = async () => {
    try {
      const res = await fetch("https://portfolioapi-flame.vercel.app/certificates")
      const result = await res.json()
      const fetchedData = result.data?.certificates || result.data || []
      setCertificates(Array.isArray(fetchedData) ? fetchedData : [])
    } catch (error) {
      console.error("Error fetching certificates:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCertificates() }, [])

  const handleImageUploaded = (url: string) => {
    setFormData(prev => ({ ...prev, image: url }))
  }

  const handleOpenModal = (cert?: Certificate) => {
    if (cert) {
      setEditingCert(cert)
      // تأمين التاريخ للمدخل (Input Date)
      const formattedDate = cert.date && !isNaN(Date.parse(cert.date)) 
        ? new Date(cert.date).toISOString().split('T')[0] 
        : ""
      
      setFormData({
        title: cert.title || "",
        issuer: cert.issuer || "",
        date: formattedDate,
        image: cert.image || "",
        link: cert.link || ""
      })
    } else {
      setEditingCert(null)
      setFormData({ title: "", issuer: "", date: "", image: "", link: "" })
    }
    setIsModalOpen(true)
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsSubmitting(true)
  const token = localStorage.getItem("token")

  try {
    const url = editingCert 
      ? `https://portfolioapi-flame.vercel.app/certificates/${editingCert._id}`
      : "https://portfolioapi-flame.vercel.app/certificates"
    
    const payload = {
      title: formData.title,
      issuer: formData.issuer,
      issueDate: formData.date, 
      certImage: formData.image, 
      certLink: formData.link    
    }

    const res = await fetch(url, {
      method: editingCert ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      fetchCertificates()
      setIsModalOpen(false)
    }
  } catch (error) {
    console.error("Submit error:", error)
  } finally {
    setIsSubmitting(false)
  }
}

  const confirmDelete = async () => {
    if (!selectedCertId) return
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`https://portfolioapi-flame.vercel.app/certificates/${selectedCertId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) {
        setCertificates(certificates.filter(c => c._id !== selectedCertId))
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
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Award className="text-[#00BFFF]" size={32} /> Certificates
          </h1>
          <p className="text-[#9CA3AF]">Manage and showcase your professional certifications and degrees.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] text-white font-bold rounded-xl hover:shadow-lg hover:shadow-[#00BFFF]/20 transition-all"
        >
          <Plus size={20} /> Add Certificate
        </button>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {certificates.map((cert) => (
            <motion.div
              key={cert._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden group hover:border-[#00BFFF]/50 transition-all shadow-xl flex flex-col"
            >
              {/* Certificate Image Area */}
              <div className="relative h-56 bg-[#0D1117] overflow-hidden p-4 flex items-center justify-center border-b border-[#30363D]/50">
                {cert.image ? (
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 shadow-md"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400/161B22/00BFFF?text=Certificate+Image";
                    }}
                  />
                ) : (
                  <Award size={48} className="text-[#30363D]" />
                )}
                
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-sm">
                  <button onClick={() => handleOpenModal(cert)} className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-[#00BFFF] transition-all" title="Edit"><Pencil size={20} /></button>
                  <button onClick={() => { setSelectedCertId(cert._id); setIsDeleteModalOpen(true); }} className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-red-500 transition-all" title="Delete"><Trash2 size={20} /></button>
                </div>
              </div>

              {/* Certificate Info */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight">{cert.title || "Untitled Certificate"}</h3>
                
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-[#9CA3AF] text-sm font-medium">
                    <Building size={16} className="text-[#00BFFF]" />
                    <span className="truncate">{cert.issuer || "Unknown Issuer"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#9CA3AF] text-sm">
                    <Calendar size={16} className="text-[#00BFFF]" />
                    <span>
                        {cert.date && !isNaN(Date.parse(cert.date)) 
                            ? new Date(cert.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                            : "Date not specified"}
                    </span>
                  </div>
                </div>

                {cert.link && (
                  <div className="pt-4 mt-4 border-t border-[#30363D]/50">
                    <a 
                      href={cert.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-[#00BFFF]/10 text-[#00BFFF] font-semibold text-sm rounded-lg hover:bg-[#00BFFF] hover:text-white transition-all"
                    >
                      Verify Credential <ExternalLink size={16} />
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {certificates.length === 0 && !loading && (
           <motion.div 
             initial={{ opacity: 0 }} animate={{ opacity: 1 }}
             className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-[#161B22] rounded-2xl border border-dashed border-[#30363D]"
           >
             <Award className="text-[#6B7280] mb-4" size={48} />
             <h3 className="text-xl font-bold text-white mb-2">No Certificates Found</h3>
             <p className="text-[#9CA3AF]">Upload your professional achievements to display them here.</p>
           </motion.div>
        )}
      </div>

      {/* --- Modals --- */}
      
      {/* 1. Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="relative w-full max-w-2xl bg-[#161B22] border border-[#30363D] rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh] hide-scrollbar">
              
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#6B7280] hover:text-white transition-colors">
                <X size={24} />
              </button>

              <h2 className="text-2xl font-bold text-white mb-6 border-b border-[#30363D] pb-4 flex items-center gap-2">
                <Award className="text-[#00BFFF]" />
                {editingCert ? "Update Certificate" : "New Certificate"}
              </h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                
                {/* Image Uploader Section */}
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[#9CA3AF] flex items-center gap-2">
                    <ImageIcon size={16} /> Certificate Image
                  </label>
                  
                  <div className="flex flex-col sm:flex-row gap-6 items-start bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                    {formData.image && (
                      <div className="w-full sm:w-1/3 flex-shrink-0">
                        <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-[#30363D] bg-[#161B22]">
                          <img 
                            src={formData.image} 
                            alt="Preview" 
                            className="w-full h-full object-contain p-1" 
                            onError={(e) => (e.currentTarget.src = "https://placehold.co/600x400/161B22/00BFFF?text=Error")}
                          />
                        </div>
                      </div>
                    )}
                    <div className="w-full">
                      <ImageUploader onUploadSuccess={handleImageUploaded} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[#9CA3AF]">Certificate Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. AWS Certified Solutions Architect" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Organization</label>
                  <input value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} placeholder="e.g. Amazon Web Services" className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Date Issued</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" required />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm text-[#9CA3AF]">Verification Link (URL)</label>
                  <input value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white focus:border-[#00BFFF] outline-none" />
                </div>
                
                <div className="md:col-span-2 flex justify-end gap-4 mt-6 pt-6 border-t border-[#30363D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 text-[#9CA3AF] hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">Cancel</button>
                  <button disabled={isSubmitting || !formData.image} className="px-8 py-3 bg-[#00BFFF] text-white font-bold rounded-xl hover:shadow-[0_0_20px_rgba(0,191,255,0.3)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingCert ? "Update" : "Save Certificate"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-white">Remove Certificate?</h3>
              <p className="text-[#9CA3AF] text-sm">This action is permanent. Are you sure you want to delete this record?</p>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-[#30363D] text-white rounded-xl hover:bg-[#3b424b] transition-all">No, Keep it</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}