import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layout } from "../components/Layout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { fileAPI } from "../lib/api";
import { FileText, MessageSquare, Upload, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export function Dashboard() {
  const [fileCount, setFileCount] = useState(0);
  const [readyCount, setReadyCount] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fileAPI.getMyFiles();
      const files = response.files || [];
      setFileCount(files.length);
      const ready = files.filter((f) => f.status === "ready");
      setReadyCount(ready.length);
      const chunks = files.reduce((sum, f) => sum + (f.chunks_count || 0), 0);
      setTotalChunks(chunks);
    } catch {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FileText,
      title: "Document Vault",
      description: "Ingest and process your large architectural, academic, or corporate PDFs into the vector engine.",
      link: "/files",
    },
    {
      icon: MessageSquare,
      title: "Active Console",
      description: "Query your RAG system directly through the terminal chat interface.",
      link: "/chat",
    }
  ];

  return (
    <Layout className="bg-[#050505]">
      <div className="flex flex-col gap-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-8 border-b border-white/[0.05] pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-4">Operations Center</p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tighter uppercase leading-[0.85]">
              System Overview
            </h1>
          </div>
          <Link to="/files" className="inline-flex items-center justify-center rounded-full font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50 disabled:pointer-events-none uppercase tracking-widest bg-white text-black hover:bg-white/90 px-6 py-3 text-sm flex-shrink-0">
            <Upload className="w-4 h-4 mr-2" />
            Upload Document
          </Link>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-4">
               <CardDescription>Processed Chunks</CardDescription>
               <CardTitle className="text-6xl lg:text-8xl pt-4">
                 {loading ? "-" : totalChunks}
               </CardTitle>
            </CardHeader>
          </Card>
          
          <Card>
            <CardHeader className="pb-4">
               <CardDescription>Active Documents</CardDescription>
               <CardTitle className="text-6xl lg:text-8xl pt-4">
                 {loading ? "-" : fileCount}
               </CardTitle>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader className="pb-4">
               <CardDescription>Query Index Health</CardDescription>
               <CardTitle className="text-6xl lg:text-8xl pt-4 text-[#888]">
                 {loading ? "-" : `${Math.round((readyCount / Math.max(fileCount, 1)) * 100)}%`}
               </CardTitle>
            </CardHeader>
          </Card>
        </section>

        <div className="w-full h-px bg-white/[0.05] my-4" />

        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-display font-medium uppercase tracking-tighter">Endpoints</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link to={feature.link} key={index}>
                  <Card className="group hover:bg-[#111] transition-colors cursor-pointer h-full">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mb-6 bg-black group-hover:bg-white group-hover:text-black transition-colors duration-500">
                        <Icon className="w-5 h-5" />
                      </div>
                      <CardTitle className="text-2xl mb-2 group-hover:text-white transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-lg">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                       <ArrowRight className="w-6 h-6 text-white transform group-hover:translate-x-2 transition-transform"/>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </Layout>
  );
}
