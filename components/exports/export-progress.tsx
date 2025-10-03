"use client";

import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw, CheckCircle, XCircle, X } from "lucide-react";

interface ExportProgressProps {
  status: 'queued' | 'processing' | 'packaging' | 'uploaded' | 'ready' | 'failed' | 'canceled';
  progress: number;
  error?: string;
  className?: string;
}

const statusConfig = {
  queued: { label: "Queued", color: "bg-blue-100 text-blue-800", icon: Clock },
  processing: { label: "Processing", color: "bg-yellow-100 text-yellow-800", icon: RefreshCw },
  packaging: { label: "Packaging", color: "bg-purple-100 text-purple-800", icon: RefreshCw },
  uploaded: { label: "Uploaded", color: "bg-indigo-100 text-indigo-800", icon: RefreshCw },
  ready: { label: "Ready", color: "bg-green-100 text-green-800", icon: CheckCircle },
  failed: { label: "Failed", color: "bg-red-100 text-red-800", icon: XCircle },
  canceled: { label: "Canceled", color: "bg-gray-100 text-gray-800", icon: X },
};

export function ExportProgress({ status, progress, error, className = "" }: ExportProgressProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;
  const isActive = status === 'processing' || status === 'packaging' || status === 'uploaded';

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <StatusIcon 
            className={`h-4 w-4 ${isActive ? 'animate-spin' : ''}`} 
          />
          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>
        <span className="text-sm text-gray-600">
          {progress}%
        </span>
      </div>
      
      <Progress value={progress} className="h-2" />
      
      {error && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
          {error}
        </p>
      )}
      
      {status === 'ready' && (
        <p className="text-xs text-green-600">
          âœ… Export completed successfully
        </p>
      )}
      
      {status === 'failed' && (
        <p className="text-xs text-red-600">
          âŒ Export failed. Please try again.
        </p>
      )}
      
      {status === 'canceled' && (
        <p className="text-xs text-gray-600">
          â¹ï¸ Export was canceled
        </p>
      )}
    </div>
  );
}