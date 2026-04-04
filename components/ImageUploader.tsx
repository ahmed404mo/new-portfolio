"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle, X } from "lucide-react"

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  
  const [popup, setPopup] = useState({ isOpen: false, type: 'success', message: '' })

  const closePopup = () => setPopup({ ...popup, isOpen: false })

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a local preview URL
    setPreview(URL.createObjectURL(file))
    setLoading(true)

    // Prepare Multipart Form Data
    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("https://portfolioapi-flame.vercel.app/upload", {
        method: "POST",
        body: formData, 
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setPopup({ isOpen: true, type: 'success', message: 'Image uploaded successfully! ✅' })
        onUploadSuccess(result.url) 
      } else {
        setPopup({ isOpen: true, type: 'error', message: result.message || "Upload failed. Please try again." })
      }
    } catch (error) {
      console.error("Upload error:", error)
      setPopup({ isOpen: true, type: 'error', message: "Server connection error. Check your network ❌" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {popup.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={closePopup}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#161B22] border border-[#30363D] rounded-2xl p-6 shadow-2xl z-[101] max-w-sm w-full text-center relative flex flex-col items-center"
            >
              <button onClick={closePopup} className="absolute top-4 right-4 text-[#6B7280] hover:text-white transition-colors">
                <X size={20} />
              </button>

              {popup.type === 'success' ? (
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-4 mt-2">
                  <CheckCircle2 size={32} />
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-4 mt-2">
                  <AlertCircle size={32} />
                </div>
              )}

              <h3 className="text-xl font-bold text-white mb-2">
                {popup.type === 'success' ? 'Success!' : 'Oops! Error'}
              </h3>
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-6">
                {popup.message}
              </p>

              <button
                onClick={closePopup}
                className="w-full py-3 bg-[#30363D] text-white font-semibold rounded-xl hover:bg-[#3b424b] transition-all"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="border border-[#30363D] p-4 rounded-xl text-center bg-[#161B22]">
        {preview ? (
          <div className="relative group">
            <img 
              src={preview} 
              alt="Preview" 
              className={`w-full h-40 object-cover rounded-lg mb-4 border border-[#30363D] transition-opacity ${loading ? 'opacity-40' : 'opacity-100'}`} 
            />
            {loading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-lg mb-4">
                 <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00BFFF] mb-2"></div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-40 flex items-center justify-center border-2 border-dashed border-[#30363D] bg-[#0D1117] rounded-lg mb-4">
            <p className="text-[#9CA3AF] text-sm">Select an image...</p>
          </div>
        )}
        
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          disabled={loading}
          className="w-full text-sm text-[#9CA3AF] 
            file:mr-4 file:py-2.5 file:px-4 
            file:rounded-lg file:border-0 
            file:text-sm file:font-semibold 
            file:bg-[#00BFFF]/10 file:text-[#00BFFF] 
            hover:file:bg-[#00BFFF] hover:file:text-white 
            file:transition-colors file:cursor-pointer disabled:opacity-50"
        />
        
        {loading && (
          <p className="text-[#00BFFF] mt-3 text-sm font-medium animate-pulse">
            Uploading to Cloudinary...
          </p>
        )}
      </div>
    </>
  )
}