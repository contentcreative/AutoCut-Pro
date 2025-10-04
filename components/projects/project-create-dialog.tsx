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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  theme: z.string().min(1, "Theme is required"),
  targetAudience: z.string().min(1, "Target audience is required"),
  keyMessages: z.array(z.string()).min(1, "At least one key message is required"),
  brandGuidelines: z.string().optional(),
  contentGoals: z.string().min(1, "Content goals are required"),
  platformPreferences: z.array(z.string()).min(1, "Select at least one platform"),
  videoLength: z.string().optional(),
  stylePreferences: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

const platformOptions = [
  { value: "tiktok", label: "TikTok", description: "Short-form vertical videos" },
  { value: "instagram", label: "Instagram", description: "Stories, Reels, and IGTV" },
  { value: "youtube", label: "YouTube", description: "Long-form and Shorts" },
  { value: "linkedin", label: "LinkedIn", description: "Professional content" },
  { value: "twitter", label: "Twitter/X", description: "Quick updates and clips" },
];

const videoLengthOptions = [
  { value: "15-30s", label: "15-30 seconds" },
  { value: "30-60s", label: "30-60 seconds" },
  { value: "1-3min", label: "1-3 minutes" },
  { value: "3-10min", label: "3-10 minutes" },
  { value: "10+min", label: "10+ minutes" },
];

const styleOptions = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "educational", label: "Educational" },
  { value: "entertaining", label: "Entertaining" },
  { value: "inspirational", label: "Inspirational" },
];

export function ProjectCreateDialog() {
  const [open, setOpen] = useState(false);
  const [keyMessages, setKeyMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      description: "",
      theme: "",
      targetAudience: "",
      keyMessages: [],
      brandGuidelines: "",
      contentGoals: "",
      platformPreferences: [],
      videoLength: "",
      stylePreferences: "",
    },
  });

  const addKeyMessage = () => {
    if (newMessage.trim() && !keyMessages.includes(newMessage.trim())) {
      const updated = [...keyMessages, newMessage.trim()];
      setKeyMessages(updated);
      form.setValue("keyMessages", updated);
      setNewMessage("");
    }
  };

  const removeKeyMessage = (message: string) => {
    const updated = keyMessages.filter((m) => m !== message);
    setKeyMessages(updated);
    form.setValue("keyMessages", updated);
  };

  const togglePlatform = (platform: string) => {
    const updated = selectedPlatforms.includes(platform)
      ? selectedPlatforms.filter((p) => p !== platform)
      : [...selectedPlatforms, platform];
    setSelectedPlatforms(updated);
    form.setValue("platformPreferences", updated);
  };

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      // TODO: Implement project creation API call
      console.log("Creating project:", data);
      
      toast.success("Project created successfully!");
      setOpen(false);
      form.reset();
      setKeyMessages([]);
      setSelectedPlatforms([]);
    } catch (error) {
      toast.error("Failed to create project. Please try again.");
      console.error("Project creation error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="h-16 px-8">
          <Plus className="mr-3 h-6 w-6" />
          Create New Project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="h-6 w-6 text-primary" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Tell us about your project so we can create the perfect video content for your brand.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Q4 Marketing Campaign" {...field} />
                    </FormControl>
                    <FormDescription>
                      Give your project a descriptive name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your project goals, what you want to achieve, and any specific requirements..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a detailed description of your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Content Strategy */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Strategy</h3>
              
              <FormField
                control={form.control}
                name="theme"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme & Brand Voice</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Innovation, Sustainability, Growth, Community" {...field} />
                    </FormControl>
                    <FormDescription>
                      What&apos;s the main theme or brand voice for this project?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Millennials, B2B professionals, Gen Z consumers" {...field} />
                    </FormControl>
                    <FormDescription>
                      Who is your primary audience for this content?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Key Messages</FormLabel>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a key message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyMessage())}
                  />
                  <Button type="button" onClick={addKeyMessage} variant="outline">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {keyMessages.map((message) => (
                    <Badge key={message} variant="secondary" className="cursor-pointer">
                      {message}
                      <button
                        type="button"
                        onClick={() => removeKeyMessage(message)}
                        className="ml-2 hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </div>
            </div>

            {/* Platform Preferences */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Platform Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {platformOptions.map((platform) => (
                  <div
                    key={platform.value}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedPlatforms.includes(platform.value)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => togglePlatform(platform.value)}
                  >
                    <div className="font-medium">{platform.label}</div>
                    <div className="text-sm text-muted-foreground">{platform.description}</div>
                  </div>
                ))}
              </div>
              <FormMessage />
            </div>

            {/* Content Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Content Specifications</h3>
              
              <FormField
                control={form.control}
                name="contentGoals"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Goals</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What do you want to achieve with this content? (e.g., increase brand awareness, drive sales, educate audience)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Define what success looks like for this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="videoLength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Video Length</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select length</option>
                          {videoLengthOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="stylePreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Style Preferences</FormLabel>
                      <FormControl>
                        <select
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        >
                          <option value="">Select style</option>
                          {styleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="brandGuidelines"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Guidelines (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any specific brand guidelines, color preferences, tone requirements, or visual elements to include..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Additional brand requirements or preferences
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
