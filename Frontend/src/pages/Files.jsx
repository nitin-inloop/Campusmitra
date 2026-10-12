import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "../components/Layout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { fileAPI } from "../lib/api";
import { FileText, Trash2, RefreshCw, Upload, FileUp, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

export function Files() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fileAPI.getMyFiles();
      setFiles(response.files || []);
    } catch (error) {
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }

    setUploading(true);
    const toastId = toast.loading("Uploading document...");

    try {
      await fileAPI.upload(file);
      toast.success("Document uploaded successfully", { id: toastId });
      loadFiles();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      // Reset input
      event.target.value = "";
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to purge this document?")) return;

    try {
      await fileAPI.deleteFile(fileId);
      toast.success("Document purged");
      loadFiles();
    } catch (error) {
      toast.error("Failed to purge document");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "ready":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "processing":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropEvent = { target: { files: e.dataTransfer.files } };
      await handleFileUpload(dropEvent);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-12 pb-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pt-8 border-b border-white/[0.05] pb-8">
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#666] mb-4">Storage Matrix</p>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-medium tracking-tighter uppercase leading-[0.85]">
              Document Vault
            </h1>
          </div>
        </header>

        {/* Upload Zone */}
        <div 
          className={`relative border border-dashed rounded-3xl p-12 transition-all duration-300 md:p-24 flex flex-col items-center justify-center bg-[#0a0a0a] ${
            dragActive 
              ? "border-white/50 bg-[#111]" 
              : "border-white/[0.1] hover:border-white/[0.3] hover:bg-[#111]"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={uploading}
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer w-full text-center"
          >
            <div className={`w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-8 bg-black transition-transform duration-500 ${dragActive ? 'scale-110' : ''}`}>
              <FileUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-medium tracking-tight mb-2">
              {uploading ? "Ingesting..." : "Initialize Upload sequence"}
            </h3>
            <p className="text-[#666] uppercase tracking-[0.2em] text-[10px] max-w-sm mt-4">
              Drag & Drop or Click to Select (PDF ONLY)
            </p>
          </label>
        </div>

        {/* Files Terminal */}
        <div className="border-t border-white/[0.05] pt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-medium tracking-tight">Indexed Entities</h2>
            <Button variant="ghost" size="sm" onClick={loadFiles} className="text-[#888] hover:text-white uppercase tracking-widest text-[10px]" disabled={loading}>
              <RefreshCw className={`w-3 h-3 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          <div className="bg-[#0A0A0A] border border-white/[0.05] rounded-3xl overflow-hidden">
            {loading && files.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-24 text-[#666]">
                <RefreshCw className="w-8 h-8 animate-spin mb-4 opacity-50" />
                <p className="text-xs uppercase tracking-[0.2em]">Interrogating Matrix...</p>
              </div>
            ) : files.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-24 text-[#666]">
                <FileText className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-[10px] uppercase tracking-[0.2em]">No entities found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/[0.05] text-[10px] uppercase tracking-[0.2em] text-[#666]">
                      <th className="p-6 font-medium">Filename</th>
                      <th className="p-6 font-medium">Status</th>
                      <th className="p-6 font-medium hidden sm:table-cell">Chunks</th>
                      <th className="p-6 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    <AnimatePresence>
                      {files.map((file) => (
                        <motion.tr 
                          key={file.id}
                          initial={{ opacity: 0, bg: "#0a0a0a" }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-[#111] transition-colors"
                        >
                          <td className="p-6">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-black border border-white/10 rounded-lg">
                                <FileText className="w-4 h-4 text-white" />
                              </div>
                              <span className="font-medium text-sm truncate max-w-[200px] md:max-w-xs">
                                {file.filename}
                              </span>
                            </div>
                          </td>
                          <td className="p-6">
                            <span className={`inline-flex items-center px-2 py-1 rounded-sm text-[10px] uppercase tracking-widest border ${getStatusColor(file.status)}`}>
                              {file.status === "failed" && <AlertTriangle className="w-3 h-3 mr-1" />}
                              {file.status}
                            </span>
                          </td>
                          <td className="p-6 hidden sm:table-cell text-[#888] font-mono text-sm">
                            {file.chunks_count || 0}
                          </td>
                          <td className="p-6 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(file.id)}
                              className="text-[#666] hover:text-red-500 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
