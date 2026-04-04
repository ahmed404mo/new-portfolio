"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, ExternalLink, Calendar, Building, Loader2, X } from "lucide-react"

interface Certificate {
  _id: string;
  title: string;
  issuer: string; 
  issueDate: string; 
  certImage: string; 
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
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

    fetchCertificates()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-[#00BFFF]" size={48} />
          <p className="text-[#9CA3AF] font-medium animate-pulse">Loading certificates...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0D1117] pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center justify-center p-3 bg-[#00BFFF]/10 rounded-2xl mb-6">
            <Award className="text-[#00BFFF]" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            My <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00BFFF] to-[#3B82F6]">Certificates</span>
          </h1>
          <p className="text-[#9CA3AF] text-lg">
            A showcase of my continuous learning journey, professional qualifications, and specialized training.
          </p>
        </motion.div>

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {certificates.map((cert, index) => (
              <motion.div
                key={cert._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden group hover:border-[#00BFFF]/50 transition-all shadow-xl flex flex-col"
              >
                {/* Image Section */}
                <div 
                  className="relative h-64 bg-[#0D1117] p-4 flex items-center justify-center border-b border-[#30363D]/50 cursor-pointer overflow-hidden"
                  onClick={() => cert.certImage && setSelectedImage(cert.certImage)}
                >
                  {cert.certImage ? (
                    <img 
                      src={cert.certImage} 
                      alt={cert.title} 
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <Award size={48} className="text-[#30363D]" />
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <span className="px-4 py-2 bg-white/10 rounded-full text-white font-medium text-sm border border-white/20">
                      Click to expand
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-6 flex flex-col flex-grow bg-gradient-to-b from-[#161B22] to-[#0D1117]/50">
                  <h3 className="text-xl font-bold text-white mb-4 line-clamp-2 leading-snug group-hover:text-[#00BFFF] transition-colors">
                    {cert.title}
                  </h3>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="flex items-center gap-3 text-[#9CA3AF]">
                      <div className="p-2 bg-[#30363D] rounded-lg">
                        <Building size={16} className="text-[#00BFFF]" />
                      </div>
                      <span className="font-medium truncate">{cert.issuer}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-[#9CA3AF]">
                      <div className="p-2 bg-[#30363D] rounded-lg">
                        <Calendar size={16} className="text-[#00BFFF]" />
                      </div>
                      <span className="font-medium">
                        {cert.issueDate ? new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "Date not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-[#161B22] rounded-3xl border border-dashed border-[#30363D]"
          >
            <Award className="text-[#6B7280] mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">No Certificates Yet</h3>
            <p className="text-[#9CA3AF]">Check back later to see my latest achievements.</p>
          </motion.div>
        )}
      </div>

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setSelectedImage(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative w-full max-w-5xl max-h-[90vh] flex items-center justify-center"
            >
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-[#00BFFF] rounded-full transition-all"
              >
                <X size={24} />
              </button>
              <img 
                src={selectedImage} 
                alt="Expanded Certificate" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/10"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}