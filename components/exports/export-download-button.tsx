"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getExportDownloadUrl } from "@/actions/exports-actions";
import { toast } from "sonner";

interface ExportDownloadButtonProps {
  jobId: string;
  disabled?: boolean;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function ExportDownloadButton({ 
  jobId, 
  disabled = false, 
  size = "default",
  variant = "default",
  className = ""
}: ExportDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    
    setDownloading(true);
    
    try {
      const { url } = await getExportDownloadUrl(jobId);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${jobId}.zip`;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started");
      
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download export. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || downloading}
      size={size}
      variant={variant}
      className={className}
    >
      <Download className="h-4 w-4 mr-2" />
      {downloading ? "Downloading..." : "Download"}
    </Button>
  );
}