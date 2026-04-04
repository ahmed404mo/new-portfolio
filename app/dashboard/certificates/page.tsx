"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Plus, Pencil, Trash2, Image as ImageIcon, 
  Loader2, X, Award, Save, AlertTriangle, Calendar, Building
} from "lucide-react"
import ImageUploader from "@/components/ImageUploader" 

interface Certificate {
  _id: string;
  title: string;
  issuer: string; 
  issueDate: string; 
  certImage: string; 
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
    image: ""
  })

  const fetchCertificates = async () => {
    try {
      const res = await fetch("https://portfolioapi-flame.vercel.app/certificates")
      const result = await res.json()
      const fetchedData = result.data || []
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
      const formattedDate = cert.issueDate && !isNaN(Date.parse(cert.issueDate)) 
        ? new Date(cert.issueDate).toISOString().split('T')[0] 
        : ""
      
      setFormData({
        title: cert.title || "",
        issuer: cert.issuer || "",
        date: formattedDate,
        image: cert.certImage || ""
      })
    } else {
      setEditingCert(null)
      setFormData({ title: "", issuer: "", date: "", image: "" })
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    const payload = {
      title: formData.title,
      issuer: formData.issuer,
      issueDate: formData.date,   
      certImage: formData.image
    };

    try {
      const url = editingCert 
        ? `https://portfolioapi-flame.vercel.app/certificates/${editingCert._id}`
        : "https://portfolioapi-flame.vercel.app/certificates";
      
      const res = await fetch(url, {
        method: editingCert ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        await fetchCertificates();
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Award className="text-[#00BFFF]" size={32} /> Certificates
          </h1>
          <p className="text-[#9CA3AF]">Manage your professional achievements.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#3B82F6] text-white font-bold rounded-xl transition-all">
          <Plus size={20} /> Add Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {certificates.map((cert) => (
            <motion.div key={cert._id} layout className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden group flex flex-col hover:border-[#00BFFF]/50 transition-all shadow-xl">
              <div className="relative h-56 bg-[#0D1117] flex items-center justify-center border-b border-[#30363D]/50">
                {cert.certImage ? (
                  <img src={cert.certImage} alt={cert.title} className="max-w-full max-h-full object-contain p-2" />
                ) : (
                  <Award size={48} className="text-[#30363D]" />
                )}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button onClick={() => handleOpenModal(cert)} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-[#00BFFF] transition-all"><Pencil size={20} /></button>
                  <button onClick={() => { setSelectedCertId(cert._id); setIsDeleteModalOpen(true); }} className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-red-500 transition-all"><Trash2 size={20} /></button>
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-2 leading-tight">{cert.title}</h3>
                <div className="space-y-2 mt-auto">
                  <div className="flex items-center gap-2 text-[#9CA3AF] text-sm">
                    <Building size={16} className="text-[#00BFFF]" />
                    <span className="truncate">{cert.issuer}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#9CA3AF] text-sm">
                    <Calendar size={16} className="text-[#00BFFF]" />
                    <span>{cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : "No Date"}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-2xl bg-[#161B22] border border-[#30363D] rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#6B7280] hover:text-white"><X size={24} /></button>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2"><Award className="text-[#00BFFF]" />{editingCert ? "Update Certificate" : "New Certificate"}</h2>
              
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Certificate Image</label>
                  <div className="bg-[#0D1117] p-4 rounded-xl border border-[#30363D]">
                    <ImageUploader onUploadSuccess={handleImageUploaded} />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Certificate Title</label>
                  <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white outline-none focus:border-[#00BFFF]" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Organization</label>
                  <input value={formData.issuer} onChange={e => setFormData({...formData, issuer: e.target.value})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white outline-none focus:border-[#00BFFF]" required />
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-[#9CA3AF]">Date Issued</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full bg-[#0D1117] border border-[#30363D] rounded-xl px-4 py-3 text-white outline-none focus:border-[#00BFFF]" required />
                </div>

                <div className="md:col-span-2 flex justify-end gap-4 mt-4 pt-6 border-t border-[#30363D]">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 text-[#9CA3AF] hover:text-white transition-all">Cancel</button>
                  <button disabled={isSubmitting || !formData.image} className="px-8 py-3 bg-[#00BFFF] text-white font-bold rounded-xl flex items-center gap-2 disabled:opacity-50">
                    {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    {editingCert ? "Update" : "Save"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="relative w-full max-w-sm bg-[#161B22] border border-[#30363D] rounded-2xl p-6 text-center space-y-4 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto"><AlertTriangle size={32} /></div>
              <h3 className="text-xl font-bold text-white">Delete Certificate?</h3>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-[#30363D] text-white rounded-xl">No</button>
                <button onClick={confirmDelete} className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold">Yes, Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}