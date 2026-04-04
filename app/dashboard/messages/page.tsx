"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageSquare, Trash2, Mail, User, Calendar, Loader2, Inbox, Reply, AlertTriangle, X, Clock } from "lucide-react"

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null)

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("https://portfolioapi-flame.vercel.app/message", {
        headers: { "Authorization": `Bearer ${token}` }
      })
      const result = await res.json()
      const fetchedData = result?.data?.messages || result?.data?.message || result?.data || [];
      
      // ترتيب الرسائل من الأحدث للأقدم
      const sortedMessages = Array.isArray(fetchedData) 
        ? fetchedData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        : [];
        
      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error)
      setMessages([]); 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchMessages() }, [])

  const confirmDelete = async () => {
    if (!selectedMsgId) return
    
    setDeletingId(selectedMsgId)
    setShowDeleteModal(false) 
    
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`https://portfolioapi-flame.vercel.app/message/${selectedMsgId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      })

      if (res.ok) {
        setMessages(messages.filter(msg => msg._id !== selectedMsgId))
      }
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeletingId(null)
      setSelectedMsgId(null)
    }
  }

  const openDeleteModal = (id: string) => {
    setSelectedMsgId(id)
    setShowDeleteModal(true)
  }

  const handleReply = (email: string, name: string) => {
    const subject = encodeURIComponent(`Regarding your message on Ahmed's Portfolio`);
    const body = encodeURIComponent(`Hi ${name},\n\n`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    }).format(date);
  }

  if (loading) {
    return (
      <div className="flex-1 h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-[#00BFFF] animate-spin" size={48} />
          <p className="text-[#9CA3AF] animate-pulse font-medium">Loading inbox...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 relative">
      
      {/* Delete Confirmation Modal (Popup) */}
      <AnimatePresence>
        {showDeleteModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#161B22] border border-[#30363D] rounded-2xl p-6 z-[101] shadow-2xl"
            >
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="absolute top-4 right-4 text-[#6B7280] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex flex-col items-center text-center space-y-4 pt-2">
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center text-red-500">
                  <AlertTriangle size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Delete Message?</h3>
                  <p className="text-[#9CA3AF] text-sm leading-relaxed px-4">
                    Are you sure you want to permanently delete this message? This action cannot be undone.
                  </p>
                </div>
                <div className="flex w-full gap-3 pt-4">
                  <button 
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 px-4 py-3.5 bg-[#0D1117] border border-[#30363D] text-white font-semibold rounded-xl hover:bg-[#30363D] transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-3.5 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-all shadow-lg shadow-red-500/20"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <div className="p-2 bg-[#00BFFF]/10 rounded-lg text-[#00BFFF]">
              <MessageSquare size={28} />
            </div>
            Inbound Messages
            {!loading && messages.length > 0 && (
              <span className="text-sm font-medium bg-[#30363D] text-[#9CA3AF] px-3 py-1 rounded-full ml-2">
                {messages.length} Total
              </span>
            )}
          </h1>
          <p className="text-[#9CA3AF]">Manage and respond to messages from your portfolio visitors.</p>
        </div>
      </motion.div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#161B22] border border-[#30363D] rounded-3xl p-20 flex flex-col items-center justify-center text-center space-y-5 shadow-lg">
          <div className="p-6 rounded-full bg-[#0D1117] text-[#30363D] border border-[#30363D]">
            <Inbox size={64} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Inbox is empty</h2>
            <p className="text-[#9CA3AF]">You haven't received any messages yet. They will appear here.</p>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id} layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="bg-[#161B22] border border-[#30363D] rounded-2xl overflow-hidden hover:border-[#00BFFF]/50 hover:shadow-lg hover:shadow-[#00BFFF]/5 transition-all group"
              >
                <div className="p-6 space-y-6">
                  
                  {/* Sender Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-[#00BFFF]/20 to-blue-600/20 border border-[#00BFFF]/30 rounded-full flex items-center justify-center text-[#00BFFF]">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight">{msg.name}</h3>
                      <a href={`mailto:${msg.email}`} className="flex items-center gap-2 text-[#9CA3AF] text-sm hover:text-[#00BFFF] transition-colors mt-1 w-fit">
                        <Mail size={14} />
                        {msg.email}
                      </a>
                    </div>
                  </div>

                  {/* Message Body */}
                  <div className="bg-[#0D1117] rounded-xl p-5 border-l-4 border-l-[#00BFFF] relative">
                    <MessageSquare size={16} className="absolute top-4 right-4 text-[#30363D]" />
                    <p className="text-[#E5E7EB] leading-relaxed whitespace-pre-wrap pr-6">
                      {msg.message}
                    </p>
                  </div>

                  {/* Footer: Date & Actions */}
                  <div className="flex flex-wrap justify-between items-center pt-2 border-t border-[#30363D]/50 gap-4">
                    <div className="flex items-center gap-2 text-[#6B7280] text-sm font-medium">
                      <Clock size={16} />
                      {formatDate(msg.createdAt)}
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleReply(msg.email, msg.name)} 
                        className="flex items-center gap-2 px-4 py-2 bg-[#00BFFF]/10 text-[#00BFFF] font-medium rounded-lg hover:bg-[#00BFFF] hover:text-white transition-all"
                      >
                        <Reply size={18} /> Reply
                      </button>
                      
                      <button 
                        onClick={() => openDeleteModal(msg._id)} 
                        disabled={deletingId === msg._id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 font-medium rounded-lg hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        {deletingId === msg._id ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
                        Delete
                      </button>
                    </div>
                  </div>
                  
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}