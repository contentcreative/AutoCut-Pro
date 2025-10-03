"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, X, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { listExportJobs, cancelExportJob, getExportDownloadUrl } from "@/actions/exports-actions";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface ExportJob {
  id: string;
  userId: string;
  projectId: string | null;
  contentId: string | null;
  status: 'queued' | 'processing' | 'packaging' | 'uploaded' | 'ready' | 'failed' | 'canceled';
  progress: number;
  formats: unknown; // JSONB field from database
  options: unknown; // JSONB field from database
  brandKitId: string | null;
  sourceVideoPath: string;
  storageBucket: string | null;
  zipStoragePath: string | null;
  zipSizeBytes: number | null;
  error: string | null;
  retryCount: number | null;
  workerId: string | null;
  createdAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  updatedAt: Date;
  processingStartedAt: Date | null;
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

export function ExportJobsTable() {
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingJobs, setDownloadingJobs] = useState<Set<string>>(new Set());

  const fetchJobs = async () => {
    try {
      const jobsData = await listExportJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      toast.error("Failed to load export jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleCancel = async (jobId: string) => {
    try {
      await cancelExportJob(jobId);
      toast.success("Export job canceled");
      fetchJobs();
    } catch (error) {
      console.error("Failed to cancel job:", error);
      toast.error("Failed to cancel export job");
    }
  };

  const handleDownload = async (jobId: string) => {
    setDownloadingJobs(prev => {
      const newSet = new Set(prev);
      newSet.add(jobId);
      return newSet;
    });
    
    try {
      const { url } = await getExportDownloadUrl(jobId);
      
      // Create a temporary link to download the file
      const link = document.createElement('a');
      link.href = url;
      link.download = `export-${jobId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started");
    } catch (error) {
      console.error("Failed to download:", error);
      toast.error("Failed to download export");
    } finally {
      setDownloadingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown";
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Export Jobs</CardTitle>
          <CardDescription>Loading your export jobs...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Export Jobs</CardTitle>
          <CardDescription>No export jobs found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p>You haven&apos;t created any export jobs yet.</p>
            <p className="text-sm">Create your first export to get started!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Export Jobs</CardTitle>
            <CardDescription>
              {jobs.length} job{jobs.length !== 1 ? 's' : ''} total
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchJobs}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Formats</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => {
                const status = statusConfig[job.status];
                const StatusIcon = status.icon;
                const isDownloading = downloadingJobs.has(job.id);
                
                return (
                  <motion.tr
                    key={job.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b"
                  >
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className={`h-4 w-4 ${job.status === 'processing' || job.status === 'packaging' || job.status === 'uploaded' ? 'animate-spin' : ''}`} />
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>
                      {job.error && (
                        <p className="text-xs text-red-600 mt-1" title={job.error}>
                          {job.error.length > 50 ? job.error.substring(0, 50) + '...' : job.error}
                        </p>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(job.formats) && job.formats.map((format: any, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {format.ratio} ({format.resolution})
                          </Badge>
                        ))}
                      </div>
                      {job.options && typeof job.options === 'object' && 'generateThumbnails' in job.options && 
                        (job.options as any).generateThumbnails && (
                        <Badge variant="secondary" className="text-xs mt-1">
                          + Thumbnails
                        </Badge>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={job.progress} className="h-2" />
                        <p className="text-xs text-gray-500">{job.progress}%</p>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div>{formatDate(job.createdAt)}</div>
                        {job.completedAt && (
                          <div className="text-xs text-gray-500">
                            Completed: {formatDate(job.completedAt)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {job.zipSizeBytes ? formatFileSize(job.zipSizeBytes) : '-'}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {job.status === 'ready' && (
                          <Button
                            size="sm"
                            onClick={() => handleDownload(job.id)}
                            disabled={isDownloading}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            {isDownloading ? 'Downloading...' : 'Download'}
                          </Button>
                        )}
                        
                        {(job.status === 'queued' || job.status === 'processing' || job.status === 'packaging' || job.status === 'uploaded') && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancel(job.id)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                        
                        {job.status === 'failed' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              // TODO: Implement retry functionality
                              toast.info("Retry functionality coming soon");
                            }}
                          >
                            <RefreshCw className="h-4 w-4 mr-1" />
                            Retry
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}