"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createExportJob } from "@/actions/exports-actions";
import { toast } from "sonner";

const exportFormSchema = z.object({
  sourceVideoPath: z.string().min(1, "Please upload a video file"),
  formats: z.array(z.object({
    ratio: z.string(),
    resolution: z.string(),
    bitrate: z.string().optional(),
    fps: z.number().optional(),
  })).min(1, "Please select at least one format"),
  options: z.object({
    generateThumbnails: z.boolean().default(true),
    thumbnailTimecode: z.string().default("00:00:01"),
    metadataOverrides: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      hashtags: z.array(z.string()).optional(),
    }).optional(),
  }).optional(),
});

type ExportFormValues = z.infer<typeof exportFormSchema>;

const VIDEO_FORMATS = [
  { ratio: "9:16", resolution: "1080x1920", name: "TikTok/Instagram Stories" },
  { ratio: "16:9", resolution: "1920x1080", name: "YouTube/Landscape" },
  { ratio: "1:1", resolution: "1080x1080", name: "Instagram Square" },
  { ratio: "4:5", resolution: "1080x1350", name: "Instagram Portrait" },
  { ratio: "16:9", resolution: "1280x720", name: "HD 720p" },
  { ratio: "16:9", resolution: "854x480", name: "SD 480p" },
];

export function ExportCreateDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFormats, setSelectedFormats] = useState<Array<{
    ratio: string;
    resolution: string;
    bitrate?: string;
    fps?: number;
  }>>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [newHashtag, setNewHashtag] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const form = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: {
      sourceVideoPath: "",
      formats: [],
      options: {
        generateThumbnails: true,
        thumbnailTimecode: "00:00:01",
        metadataOverrides: {
          title: "",
          description: "",
          hashtags: [],
        },
      },
    },
  });

  const addFormat = (format: typeof VIDEO_FORMATS[0]) => {
    if (!selectedFormats.find(f => f.ratio === format.ratio && f.resolution === format.resolution)) {
      const newFormat = {
        ratio: format.ratio,
        resolution: format.resolution,
        bitrate: "6M",
        fps: 30,
      };
      setSelectedFormats([...selectedFormats, newFormat]);
      form.setValue("formats", [...selectedFormats, newFormat]);
    }
  };

  const removeFormat = (index: number) => {
    const newFormats = selectedFormats.filter((_, i) => i !== index);
    setSelectedFormats(newFormats);
    form.setValue("formats", newFormats);
  };

  const addHashtag = () => {
    if (newHashtag.trim() && !hashtags.includes(newHashtag.trim())) {
      const tag = newHashtag.trim().startsWith('#') ? newHashtag.trim() : `#${newHashtag.trim()}`;
      setHashtags([...hashtags, tag]);
      setNewHashtag("");
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(h => h !== tag));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setVideoFile(file);
      form.setValue("sourceVideoPath", file.name);
    } else {
      toast.error("Please select a valid video file");
    }
  };

  const onSubmit = async (data: ExportFormValues) => {
    if (!videoFile) {
      toast.error("Please upload a video file");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Upload video to Supabase Storage first
      // For now, we'll use a placeholder path
      const videoPath = `uploads/${Date.now()}-${videoFile.name}`;
      
      const exportData = {
        ...data,
        sourceVideoPath: videoPath,
        options: {
          ...data.options,
          metadataOverrides: {
            ...data.options?.metadataOverrides,
            hashtags,
          },
        },
      };

      const result = await createExportJob(exportData);
      toast.success("Export job created successfully!");
      setOpen(false);
      
      // Reset form
      form.reset();
      setSelectedFormats([]);
      setHashtags([]);
      setVideoFile(null);
      
    } catch (error) {
      console.error("Export creation failed:", error);
      toast.error("Failed to create export job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Export
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Video Export</DialogTitle>
          <DialogDescription>
            Configure your video export with multiple formats and options.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Video Upload */}
            <div className="space-y-2">
              <FormLabel>Source Video</FormLabel>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-2">
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">
                      Click to upload
                    </span>{" "}
                    or drag and drop
                  </label>
                  <input
                    id="video-upload"
                    type="file"
                    accept="video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  MP4, MOV, AVI, or WebM up to 100MB
                </p>
                {videoFile && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {videoFile.name}
                  </p>
                )}
              </div>
            </div>

            {/* Export Formats */}
            <div className="space-y-4">
              <div>
                <FormLabel>Export Formats</FormLabel>
                <FormDescription>
                  Select the formats you want to export your video in.
                </FormDescription>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {VIDEO_FORMATS.map((format) => (
                  <Button
                    key={`${format.ratio}-${format.resolution}`}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addFormat(format)}
                    className="justify-start"
                  >
                    <Plus className="mr-2 h-3 w-3" />
                    {format.name}
                  </Button>
                ))}
              </div>

              {selectedFormats.length > 0 && (
                <div className="space-y-2">
                  <FormLabel>Selected Formats</FormLabel>
                  {selectedFormats.map((format, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{format.ratio}</span>
                        <span className="text-gray-500 ml-2">({format.resolution})</span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFormat(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Export Options */}
            <div className="space-y-4">
              <FormLabel>Export Options</FormLabel>
              
              <FormField
                control={form.control}
                name="options.generateThumbnails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Generate Thumbnails</FormLabel>
                      <FormDescription>
                        Create preview images for each format
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="options.thumbnailTimecode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Time</FormLabel>
                    <FormControl>
                      <Input placeholder="00:00:01" {...field} />
                    </FormControl>
                    <FormDescription>
                      Time in the video to capture thumbnail (HH:MM:SS)
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>

            {/* Metadata Overrides */}
            <div className="space-y-4">
              <FormLabel>Metadata Overrides (Optional)</FormLabel>
              
              <FormField
                control={form.control}
                name="options.metadataOverrides.title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Export title" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="options.metadataOverrides.description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Export description" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Hashtags</FormLabel>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Add hashtag"
                    value={newHashtag}
                    onChange={(e) => setNewHashtag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addHashtag())}
                  />
                  <Button type="button" onClick={addHashtag} size="sm">
                    Add
                  </Button>
                </div>
                {hashtags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeHashtag(tag)}>
                        {tag} <X className="ml-1 h-3 w-3" />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || selectedFormats.length === 0}>
                {isSubmitting ? "Creating..." : "Create Export"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}