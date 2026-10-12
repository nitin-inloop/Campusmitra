import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, X, FileUp } from "lucide-react";
import { cn } from "../../lib/utils";

export function Dropzone({ onFileSelect, accept = ".pdf", maxSize = 10 * 1024 * 1024, className }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError("");

    const file = e.dataTransfer.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndSelectFile(file);
    }
  };

  const validateAndSelectFile = (file) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    if (file.size > maxSize) {
      setError(`File size must be less than ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      return;
    }

    setError("");
    onFileSelect(file);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={cn(
          "relative border border-dashed rounded-3xl p-12 transition-all duration-300 md:p-24 flex flex-col items-center justify-center bg-[#0a0a0a] cursor-pointer",
          isDragging 
            ? "border-white/50 bg-[#111]" 
            : "border-white/[0.1] hover:border-white/[0.3] hover:bg-[#111]"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center w-full text-center">
          <div className={`w-20 h-20 rounded-full border border-white/10 flex items-center justify-center mb-8 bg-black transition-transform duration-500 ${isDragging ? 'scale-110' : ''}`}>
             <FileUp className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-2xl font-medium tracking-tight mb-2 text-white">
              {isDragging ? "Drop to Ingest" : "Initialize Upload Sequence"}
          </h3>
          <p className="text-[#666] uppercase tracking-[0.2em] text-[10px] max-w-sm mt-4">
              Drag & Drop or Click to Select (PDF ONLY)
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-2 text-red-500 border border-red-500/20 bg-red-500/10 px-4 py-2 mt-6 rounded-sm uppercase tracking-widest text-[10px]"
            >
              <X className="w-3 h-3" />
              <span className="font-medium">{error}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
