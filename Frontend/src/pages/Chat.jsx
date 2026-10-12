import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { ragAPI } from "../lib/api";
import { Send, Bot, User, Loader2, Info } from "lucide-react";
import toast from "react-hot-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await ragAPI.ask(userMessage.content);
      
      const assistantMessage = {
        role: "assistant",
        content: response.answer,
        sources: response.sources
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to get answer");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again.", error: true }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-8rem)] flex flex-col pt-8 md:pt-12 pb-12">
        <header className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-2">Active Console</p>
          <h1 className="text-4xl md:text-5xl font-display font-medium tracking-tighter uppercase">
            Query Engine
          </h1>
        </header>

        <div className="flex flex-col flex-1 min-h-0 relative overflow-hidden border-y border-white/[0.05] bg-[#050505]">
          <div className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto py-12 md:py-24 space-y-12">
            <AnimatePresence initial={false}>
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-start justify-center text-[#666] h-full"
                >
                  <p className="text-xs tracking-widest uppercase font-mono">CONNECTION ESTABLISHED...</p>
                  <p className="text-xs tracking-widest uppercase font-mono mt-2 animate-pulse">AWAITING QUERY INPUT...</p>
                </motion.div>
              )}
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col w-full group"
                >
                  <div className="flex items-center text-[10px] uppercase tracking-[0.2em] mb-4">
                    {msg.role === "user" ? (
                      <span className="text-[#888] font-mono">USER_INPUT</span>
                    ) : (
                      <span className="text-white font-mono flex items-center">
                        <span className="w-1.5 h-1.5 bg-white rounded-full mr-2"></span>
                        SYSTEM_OUTPUT
                      </span>
                    )}
                  </div>
                  
                  <div
                    className={`${msg.error ? "text-red-500" : "text-[#FAFAFA]"} font-light`}
                  >
                    {msg.role === "assistant" && !msg.error ? (
                      <div className="prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-white/10 max-w-none text-base md:text-lg">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {msg.content}
                        </ReactMarkdown>
                        {msg.sources && msg.sources.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-white/[0.05]">
                            <h4 className="text-[10px] uppercase tracking-[0.2em] text-[#555] mb-4">
                              Referenced Documents
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {msg.sources.map((src, i) => (
                                <span key={i} className="px-3 py-1.5 bg-[#111] border border-white/5 rounded-sm text-xs font-mono text-[#888]">
                                  {src.filename} [PG:{src.page_num}]
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xl md:text-2xl font-medium tracking-tight bg-gradient-to-r from-white to-[#666] bg-clip-text text-transparent">
                        {msg.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col w-full"
                >
                  <div className="flex items-center text-[10px] uppercase tracking-[0.2em] mb-4">
                    <span className="text-white font-mono flex items-center">
                      <span className="w-1.5 h-1.5 bg-white rounded-full mr-2 animate-pulse"></span>
                      PROCESSING
                    </span>
                  </div>
                  <div className="font-mono text-[#666] text-sm animate-pulse">
                    Generating response matrix...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="bg-[#050505] p-6 border-t border-white/[0.05] sticky bottom-0 w-full shrink-0 z-10">
            <form onSubmit={handleSend} className="max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center">
              <div className="relative w-full flex-1">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Initiate Query..."
                  className="w-full bg-[#0a0a0a] border-white/10 hover:border-white/30 focus:border-white/50 rounded-none h-16 pl-6 text-lg font-mono placeholder:text-[#333] transition-colors"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={!input.trim() || loading}
                className="h-16 px-8 rounded-none bg-white text-black font-mono tracking-widest hover:bg-neutral-200 transition-colors w-full md:w-auto flex-shrink-0"
              >
                EXECUTE <Send className="w-4 h-4 ml-3" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
