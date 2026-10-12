import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, Upload, Sparkles, Shield, Layers } from 'lucide-react';

const SlideUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  return (
    <motion.div
      ref={ref}
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export function Landing() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { mass: 0.1, stiffness: 100, damping: 20 });
  
  // Parallax values
  const yHero = useTransform(smoothProgress, [0, 1], [0, 300]);
  const opacityHero = useTransform(smoothProgress, [0, 0.2], [1, 0]);

  return (
    <div className="bg-[#0a0a0a] text-[#FAFAFA] min-h-screen selection:bg-[#FAFAFA] selection:text-[#050505] font-sans overflow-x-hidden">
      
      {/* Navbar - Minimal */}
      <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 py-6 mix-blend-difference">
        <div className="text-xl font-medium tracking-tighter">CampusMitra©</div>
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-sm font-medium hover:opacity-70 transition-opacity">Login</Link>
          <Link to="/register" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:scale-105 transition-transform">
            Start Free
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-end pb-24 px-6 md:px-12 z-0">
        <motion.div style={{ y: yHero, opacity: opacityHero }} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <div className="md:col-span-9 z-10">
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[12vw] md:text-[8vw] leading-[0.85] font-display font-medium tracking-tighter uppercase"
              >
                Intelligent
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="text-[12vw] md:text-[8vw] leading-[0.85] font-display font-medium tracking-tighter uppercase text-[#555]"
              >
                Knowledge
              </motion.h1>
            </div>
            <div className="overflow-hidden flex items-center gap-4 md:gap-8">
              <motion.h1 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                className="text-[12vw] md:text-[8vw] leading-[0.85] font-display font-medium tracking-tighter uppercase flex items-center gap-4 md:gap-8"
              >
                Retrieval
              </motion.h1>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
                className="hidden md:inline-flex h-4 w-4 md:h-12 md:w-12 bg-[#FAFAFA] rounded-full"
              />
            </div>
          </div>
          
          <div className="md:col-span-3 pb-2 md:pb-6">
            <SlideUp delay={0.4}>
              <p className="text-lg md:text-xl font-light text-[#888] leading-snug max-w-sm">
                A system built for college environments. Turn sterile PDFs and course materials into interactive intelligence.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link to="/register" className="group flex items-center justify-center h-16 w-16 rounded-full border border-white/20 hover:bg-white hover:text-black transition-colors">
                  <ArrowUpRight className="w-6 h-6 transform group-hover:rotate-45 transition-transform" />
                </Link>
                <span className="text-sm font-medium uppercase tracking-widest text-[#666]">Explore</span>
              </div>
            </SlideUp>
          </div>
        </motion.div>

        {/* Abstract Background Elements instead of AI glowing orbs */}
        <div className="absolute top-1/4 right-1/4 w-[40vw] h-[40vw] border border-white/5 rounded-full blur-[1px] opacity-50 point-events-none -z-10 animate-[spin_60s_linear_infinite]" />
        <div className="absolute top-[30%] right-[20%] w-[20vw] h-[20vw] bg-white rounded-full blur-[150px] opacity-[0.02] point-events-none -z-10" />
      </section>

      {/* Asymmetric Feature Grid (Bento style, high contrast) */}
      <section className="py-32 px-6 md:px-12 bg-[#050505]">
        <SlideUp>
          <div className="mb-20">
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-4">( Capabilities )</p>
            <h2 className="text-4xl md:text-6xl font-display font-medium tracking-tighter leading-none max-w-4xl">
              Architectural grade data processing for academic institutions.
            </h2>
          </div>
        </SlideUp>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <SlideUp delay={0.1} className="lg:col-span-2 relative group overflow-hidden bg-[#0A0A0A] rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-between border border-white/[0.05]">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-transparent to-white/[0.02] pointer-events-none" />
            
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-8 bg-black/50 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors duration-500">
              <Upload className="w-5 h-5" />
            </div>
            
            <div className="z-10 relative">
              <h3 className="text-3xl md:text-5xl font-medium tracking-tighter mb-4 group-hover:text-white transition-colors duration-300">Semantic Parsing</h3>
              <p className="text-[#888] text-lg max-w-md font-light">Instantly ingest syllabi, notices, and large academic texts. Let the system build the unstructured data into a queried index.</p>
            </div>
          </SlideUp>

          <SlideUp delay={0.2} className="relative group overflow-hidden bg-[#0A0A0A] rounded-3xl p-8 min-h-[400px] flex flex-col justify-between border border-white/[0.05]">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-8 bg-black/50 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors duration-500">
              <Sparkles className="w-5 h-5" />
            </div>
            
            <div className="z-10 relative">
              <h3 className="text-2xl font-medium tracking-tighter mb-3 group-hover:text-white transition-colors duration-300">RAG Driven</h3>
              <p className="text-[#888] font-light leading-relaxed">Conversational access to vast document troves, grounded purely in your contextual data to eliminate hallucination.</p>
            </div>
          </SlideUp>

          <SlideUp delay={0.3} className="relative group overflow-hidden bg-[#0A0A0A] rounded-3xl p-8 min-h-[400px] flex flex-col justify-between border border-white/[0.05]">
            <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center mb-8 bg-black/50 backdrop-blur-sm group-hover:bg-white group-hover:text-black transition-colors duration-500">
              <Shield className="w-5 h-5" />
            </div>
            
            <div className="z-10 relative">
              <h3 className="text-2xl font-medium tracking-tighter mb-3 group-hover:text-white transition-colors duration-300">Isolated Tenants</h3>
              <p className="text-[#888] font-light leading-relaxed">Enterprise-grade isolation ensuring zero cross-mingling of university data resources.</p>
            </div>
          </SlideUp>

          <SlideUp delay={0.4} className="lg:col-span-2 relative group overflow-hidden bg-[#0A0A0A] rounded-3xl p-8 md:p-12 min-h-[400px] flex flex-col justify-end border border-white/[0.05] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHBhdGggZD0iTTAgMGg0MHY0MEgwek0wIDBWMGg0MHY0MEgweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJibGFjayIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTEwIDEwdjIwaDIwdjIwSDEweiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3N2Zz4=')]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent pointer-events-none" />
            <div className="z-10 relative flex justify-between items-end w-full">
              <div>
                <h3 className="text-3xl md:text-5xl font-medium tracking-tighter mb-4">API Architecture</h3>
                <p className="text-[#888] text-lg max-w-md font-light">Access your RAG system programmatically. Build custom clients over our robust backend stack.</p>
              </div>
              <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center bg-black/50 backdrop-blur-sm group-hover:rotate-12 transition-transform duration-500">
                <Layers className="w-5 h-5 text-white" />
              </div>
            </div>
          </SlideUp>
        </div>
      </section>

      {/* Typography / Stats Section */}
      <section className="py-32 px-6 md:px-12 border-t border-white/[0.05] flex items-center justify-center bg-[#050505]">
        <SlideUp className="text-center w-full max-w-5xl">
          <h2 className="text-5xl md:text-7xl lg:text-[8rem] font-medium tracking-tighter leading-[0.9] text-[#FAFAFA]">
            Built for scale. <br/>
            <span className="text-[#333]">Engineered for precision.</span>
          </h2>
          <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/[0.05]">
            <div className="flex flex-col gap-3">
              <span className="text-5xl md:text-6xl font-light tracking-tighter">99.9%</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Uptime</span>
            </div>
            <div className="flex flex-col gap-3">
              <span className="text-5xl md:text-6xl font-light tracking-tighter">{'<'}1s</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Query Latency</span>
            </div>
            <div className="flex flex-col gap-3 pl-8">
              <span className="text-5xl md:text-6xl font-light tracking-tighter">10k+</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Pages Indexed</span>
            </div>
            <div className="flex flex-col gap-3 pl-8">
              <span className="text-5xl md:text-6xl font-light tracking-tighter">∞</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666]">Possibilities</span>
            </div>
          </div>
        </SlideUp>
      </section>

      {/* Hero Marquee Section (Awwards flavor) */}
      <section className="py-12 bg-white text-black overflow-hidden border-y border-white flex flex-col justify-center">
         <motion.div 
           className="whitespace-nowrap flex"
           animate={{ x: ["0%", "-50%"] }}
           transition={{ ease: "linear", duration: 20, repeat: Infinity }}
         >
           <h2 className="text-[6vw] font-medium tracking-tighter uppercase px-4 inline-block">
             Data → Knowledge → Intelligence → Action →
             Data → Knowledge → Intelligence → Action →
             Data → Knowledge → Intelligence → Action →
             Data → Knowledge → Intelligence → Action →
           </h2>
         </motion.div>
      </section>

      {/* Footer */}
      <footer className="pt-32 pb-12 px-6 md:px-12 bg-[#050505]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-32">
          <div className="max-w-md">
            <h3 className="text-3xl md:text-4xl font-medium tracking-tighter mb-8 leading-tight">Ready to transform your institutional memory?</h3>
            <Link to="/register" className="inline-flex items-center gap-3 bg-white text-black px-8 py-5 rounded-full text-lg font-medium hover:bg-neutral-200 transition-colors">
              Deploy now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-16">
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-4">Platform</span>
              <Link to="/chat" className="text-sm tracking-wide text-[#999] hover:text-white transition-colors">Chat Interface</Link>
              <Link to="/files" className="text-sm tracking-wide text-[#999] hover:text-white transition-colors">File Management</Link>
              <Link to="/login" className="text-sm tracking-wide text-[#999] hover:text-white transition-colors">Login</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-4">Legal</span>
              <a href="#" className="text-sm tracking-wide text-[#999] hover:text-white transition-colors">Privacy</a>
              <a href="#" className="text-sm tracking-wide text-[#999] hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 flex flex-col md:flex-row justify-between items-end gap-6 overflow-hidden">
          <h1 className="text-[15vw] md:text-[18vw] font-medium tracking-tighter leading-[0.75] opacity-5">CampusMitra</h1>
          <p className="text-[10px] text-[#666] uppercase tracking-[0.2em] md:pb-8">© 2024 All Rights</p>
        </div>
      </footer>
    </div>
  );
}
