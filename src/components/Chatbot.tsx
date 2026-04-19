'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, AlertCircle, Loader2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant' | 'system' | 'error';
    content: string;
}

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Merhaba can! Ben Yiğido AI. Sivas\'ın lezzetlerini, şahsiyetlerini ve tarihini konuşmaya hazır mısın?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll function
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages.filter(m => m.role !== 'error') }),
            });

            // Res.ok check to catch HTTP errors (like 500) directly sent from handler
            if (!res.ok) {
                let errorData;
                const contentType = res.headers.get("content-type");
                
                // Content Type check to prevent JSON.parse unexpected char error on HTML error pages
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    errorData = await res.json();
                } else {
                    const textData = await res.text();
                    console.error("Non-JSON API error response:", textData);
                    throw new Error("Sunucudan geçersiz (JSON olmayan) bir yanıt geldi.");
                }
                
                throw new Error(errorData?.error || `Sunucu hatası: ${res.status}`);
            }

            const data = await res.json();
            
            if (data?.content) {
                setMessages([...newMessages, { role: 'assistant', content: data.content }]);
            } else if (data?.error) {
                throw new Error(data.error);
            } else {
                throw new Error("API'den beklenen yapıda veri gelmedi.");
            }

        } catch (error: any) {
            console.error("Chat Error:", error);
            setMessages([
                ...newMessages,
                { role: 'error', content: error.message || 'Üzgünüm, şu an sana cevap veremiyorum. Daha sonra tekrar dener misin?' }
            ]);
        } finally {
            setIsLoading(false);
            // Wait slightly for DOM update before scroll
            setTimeout(() => scrollToBottom(), 100);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        transition={{ duration: 0.3, type: "spring", stiffness: 200, damping: 20 }}
                        className="absolute bottom-16 right-0 w-80 sm:w-[360px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                        style={{ height: '500px', maxHeight: '70vh' }}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#A35A42] to-[#8B4533] p-4 flex items-center justify-between text-white shrink-0 shadow-sm relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/20">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-[16px] leading-tight flex items-center gap-2">
                                        Yiğido AI
                                        <span className="relative flex h-2 w-2">
                                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                        </span>
                                    </h3>
                                    <p className="text-xs text-white/80 font-medium tracking-wide">Sivas Dijital Rehberi</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent hover:bg-white/20 transition-colors duration-200 text-white"
                                aria-label="Kapat"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 scroll-smooth">
                            {messages.map((m, i) => {
                                const isUser = m.role === 'user';
                                const isError = m.role === 'error';
                                
                                return (
                                    <div key={i} className={`flex items-end gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                                        {!isUser && !isError && (
                                            <div className="w-8 h-8 rounded-full bg-[#A35A42] flex-shrink-0 flex items-center justify-center text-white shadow-sm mb-1">
                                                <Bot className="w-4 h-4" />
                                            </div>
                                        )}
                                        {isError && (
                                            <div className="w-8 h-8 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600 shadow-sm mb-1">
                                                <AlertCircle className="w-4 h-4" />
                                            </div>
                                        )}
                                        
                                        <div className={`
                                            max-w-[75%] px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm
                                            ${isUser 
                                                ? 'bg-[#A35A42] text-white rounded-br-sm' 
                                                : isError 
                                                    ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-bl-sm'
                                                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-bl-sm'
                                            }
                                        `}>
                                            <p className="whitespace-pre-wrap word-break">{m.content}</p>
                                        </div>
                                    </div>
                                );
                            })}
                            
                            {isLoading && (
                                <div className="flex items-end gap-2 justify-start">
                                    <div className="w-8 h-8 rounded-full bg-[#A35A42]/80 flex-shrink-0 flex items-center justify-center text-white shadow-sm mb-1">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm flex items-center gap-1">
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            
                            <div ref={messagesEndRef} className="h-1" />
                        </div>

                        {/* Input Area */}
                        <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 shrink-0 relative z-10">
                            <form onSubmit={sendMessage} className="relative flex items-center group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Sivas hakkında bir şey sor..."
                                    className="w-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-[#A35A42]/30 focus:bg-white dark:focus:bg-slate-900 outline-none rounded-full pl-5 pr-12 py-3 text-[14px] text-slate-800 dark:text-slate-200 placeholder-slate-500 transition-all duration-300 shadow-inner group-focus-within:shadow-[0_0_15px_rgba(163,90,66,0.1)]"
                                    disabled={isLoading}
                                    autoComplete="off"
                                />
                                <button 
                                    type="submit" 
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-1 w-10 h-10 flex items-center justify-center rounded-full bg-[#A35A42] text-white disabled:opacity-50 disabled:bg-slate-300 dark:disabled:bg-slate-700 hover:bg-[#8B4533] transition-colors duration-300 shadow-md"
                                    aria-label="Mesaj Gönder"
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </button>
                            </form>
                            <div className="text-center mt-2">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Llama-3.3 70B destekli • Groq</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 bg-gradient-to-tr from-[#A35A42] to-[#c66e51] text-white rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_25px_rgba(163,90,66,0.6)] transition-shadow duration-300 z-50 border-2 border-white/20"
                aria-label={isOpen ? 'Chatbotu Kapat' : 'Yiğido AI Aç'}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </motion.button>
        </div>
    );
}