import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Send, User, MessageCircle, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Message } from '../types';

interface AdminPanelProps {
  onClose: () => void;
  messages: Message[];
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, messages }) => {
  const [sender, setSender] = useState<'Yusuf' | 'Ece'>('Yusuf');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'send' | 'manage'>('send');

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'messages'), {
        sender,
        content,
        createdAt: serverTimestamp(),
      });
      setContent('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden relative border border-blue-50 flex flex-col max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-30"
        >
          <X className="text-gray-400" />
        </button>

        <div className="p-8 pb-4 space-y-6">
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-serif text-[#1e293b]">Admin Panel</h2>
            <div className="flex justify-center gap-6 mt-4">
              <button 
                onClick={() => setActiveTab('send')}
                className={`text-xs uppercase tracking-widest font-bold pb-2 border-b-2 transition-colors ${activeTab === 'send' ? 'border-[#A2D2FF] text-[#1e293b]' : 'border-transparent text-gray-400'}`}
              >
                Mesaj Gönder
              </button>
              <button 
                onClick={() => setActiveTab('manage')}
                className={`text-xs uppercase tracking-widest font-bold pb-2 border-b-2 transition-colors ${activeTab === 'manage' ? 'border-[#A2D2FF] text-[#1e293b]' : 'border-transparent text-gray-400'}`}
              >
                Yönet ({messages.length})
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-10 pt-4">
          <AnimatePresence mode="wait">
            {activeTab === 'send' ? (
              <motion.div
                key="send"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#243342] opacity-60">
                      <User size={14} /> Kim?
                    </label>
                    <div className="flex gap-4">
                      {(['Yusuf', 'Ece'] as const).map((name) => (
                        <button
                          key={name}
                          type="button"
                          onClick={() => setSender(name)}
                          className={`flex-1 py-4 rounded-2xl font-serif text-lg transition-all ${
                            sender === name 
                              ? 'bg-[#243342] text-white shadow-lg scale-105' 
                              : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                          }`}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-[#243342] opacity-60">
                      <MessageCircle size={14} /> Mesajın
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Buraya sevgi dolu bir mesaj yaz..."
                      className="w-full h-32 p-6 bg-gray-50 rounded-3xl border-none focus:ring-2 focus:ring-[#A2D2FF] resize-none font-serif text-lg text-[#1e293b]"
                    />
                  </div>

                  <button
                    disabled={loading || !content.trim()}
                    className="w-full py-5 bg-[#A2D2FF] hover:bg-[#8ebce6] text-white rounded-3xl font-serif text-xl shadow-xl shadow-[#A2D2FF]/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50 disabled:scale-100 active:scale-95"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send size={20} /> Gönder
                      </>
                    )}
                  </button>
                </form>

                <AnimatePresence>
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-center text-green-500 font-serif"
                    >
                      Mesaj başarıyla gönderildi! ✨
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="manage"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 font-serif italic py-10">Henüz hiç mesaj yok...</p>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between gap-4 border border-gray-100">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[10px] uppercase font-bold tracking-widest ${msg.sender === 'Yusuf' ? 'text-blue-400' : 'text-pink-400'}`}>
                            {msg.sender}
                          </span>
                          <span className="text-[10px] text-gray-300">
                            {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleDateString('tr-TR') : 'Şimdi'}
                          </span>
                        </div>
                        <p className="text-sm font-serif text-[#1e293b] truncate">{msg.content}</p>
                      </div>
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        disabled={deletingId === msg.id}
                        className="p-3 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all disabled:opacity-50"
                      >
                        {deletingId === msg.id ? (
                           <div className="w-4 h-4 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
