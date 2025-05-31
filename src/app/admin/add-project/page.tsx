
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, PlusCircle, Sprout } from "lucide-react";
import type { AddProjectFormValues as ActionFormValues } from "./actions";

// Schema for client-side validation, duplicated from actions.ts to avoid type import issues with static export
const addProjectFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
  location: z.string().optional(),
});

type AddProjectFormValues = z.infer<typeof addProjectFormSchema>;

export default function AddProjectPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isStaticExport, setIsStaticExport] = useState(false);
  const [saveProjectAction, setSaveProjectAction] = useState<null | ((data: ActionFormValues) => Promise<{ success: boolean; error?: string; message?: string }>)>(null);

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      setIsStaticExport(true);
    } else {
      import("./actions")
        .then(module => {
          setSaveProjectAction(() => module.saveProject);
        })
        .catch(err => {
          console.error("Failed to load saveProject action:", err);
        });
    }
  }, []);

  const form = useForm<AddProjectFormValues>({
    resolver: zodResolver(addProjectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      dataAiHint: "",
      location: "",
    },
  });

  async function onSubmit(data: AddProjectFormValues) {
    setIsLoading(true);

    if (isStaticExport || !saveProjectAction) {
      console.log("Static export mode or action not available: Project form submission simulated.", data);
      setTimeout(() => {
        toast({
          title: "Action Simulated (Static Export)",
          description: "In a live environment, the project would be saved.",
          variant: "default",
        });
        form.reset();
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const result = await saveProjectAction(data as ActionFormValues);
      if (result.success) {
        toast({
          title: "Project Saved!",
          description: result.message || "The new project has been successfully added.",
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Error Saving Project",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to submit project form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <Card className="max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Sprout size={32} className="text-primary mr-3" />
            <CardTitle className="text-3xl text-primary">Add New Project</CardTitle>
          </div>
          <CardDescription>
            Fill in the details below to add a new conservation project.
            {(isStaticExport || !saveProjectAction) && (
              <span className="block text-destructive text-sm mt-1">
                Note: This admin form is not functional in static export mode or if server actions are unavailable.
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter project title" {...field} disabled={isLoading} />
                    </FormControl>
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
                      <Textarea placeholder="Detailed description of the project." {...field} rows={5} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL (Optional)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://example.com/project-image.png" {...field} disabled={isLoading} />
                    </FormControl>
                     <FormDescription>
                      Link to an image representing the project.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dataAiHint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image AI Hint (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 'tree plantation'" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Keywords for placeholder images if Image URL is from placehold.co. Max two words.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Keri, Sattari" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={isLoading || isStaticExport || !saveProjectAction}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Project...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-5 w-5" /> Add Project
                  </>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
