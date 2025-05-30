
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
import { Loader2, PlusCircle } from "lucide-react";
import type { AddArticleFormValues as ActionFormValues } from "./actions"; // Keep type import for safety if needed by other parts

// Schema for client-side validation, duplicated from actions.ts to avoid type import issues with static export
const addArticleFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().optional().refine(value => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: "Slug must be lowercase alphanumeric with hyphens, or empty for auto-generation.",
  }),
  date: z.string().min(5, { message: "Display date is required (e.g., August 1, 2024)." }),
  author: z.string().optional(),
  snippet: z.string().min(10, { message: "Snippet must be at least 10 characters." }),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

type AddArticleFormValues = z.infer<typeof addArticleFormSchema>;

export default function AddArticlePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isStaticExport, setIsStaticExport] = useState(false);
  const [saveArticleAction, setSaveArticleAction] = useState<null | ((data: ActionFormValues) => Promise<{ success: boolean; error?: string; message?: string }>)>(null);


  useEffect(() => {
    // Check if running in a static export environment (e.g., GitHub Pages build)
    // NEXT_PUBLIC_BASE_PATH is set during GitHub Actions build for static export.
    if (process.env.NEXT_PUBLIC_BASE_PATH) {
      setIsStaticExport(true);
    } else {
      // Dynamically import the server action only in non-static environments
      // and after the component has mounted.
      import("./actions")
        .then(module => {
          setSaveArticleAction(() => module.saveArticle);
        })
        .catch(err => {
          console.error("Failed to load saveArticle action:", err);
          // Handle error, maybe show a message to the user if it's critical
        });
    }
  }, []); // Empty dependency array ensures this runs once on mount

  const form = useForm<AddArticleFormValues>({
    resolver: zodResolver(addArticleFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      date: "",
      author: "",
      snippet: "",
      content: "",
      imageUrl: "",
      dataAiHint: "",
    },
  });

  async function onSubmit(data: AddArticleFormValues) {
    setIsLoading(true);

    if (isStaticExport || !saveArticleAction) {
      console.log("Static export mode or action not available: Admin form submission simulated. Data not sent to server.", data);
      setTimeout(() => { // Simulate network delay
        toast({
          title: "Action Simulated (Static Export)",
          description: "In a live environment, the article would be saved. This page is not functional in static export mode.",
          variant: "default",
        });
        form.reset();
        setIsLoading(false);
      }, 1000);
      return;
    }

    try {
      const result = await saveArticleAction(data as ActionFormValues); // Type assertion might be needed if signatures differ subtly
      if (result.success) {
        toast({
          title: "Article Saved!",
          description: result.message || "The new article has been successfully added.",
          variant: "default",
        });
        form.reset();
      } else {
        toast({
          title: "Error Saving Article",
          description: result.error || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to submit article form:", error);
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
            <PlusCircle size={32} className="text-primary mr-3" />
            <CardTitle className="text-3xl text-primary">Add New Article</CardTitle>
          </div>
          <CardDescription>
            Fill in the details below to publish a new news article or blog post.
            {(isStaticExport || !saveArticleAction) && ( // Show note if static or action couldn't load
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter article title" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="article-title-slug (auto-generated if blank)" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      URL-friendly version of the title. Leave blank to auto-generate. Use lowercase letters, numbers, and hyphens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Date</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., August 1, 2024" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      The date that will be shown on the article card.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Author's name" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="snippet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Snippet / Summary</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Short summary of the article for previews." {...field} rows={3} disabled={isLoading} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Write the full article content here. Basic Markdown is not currently supported, enter plain text." {...field} rows={10} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Currently supports plain text. Rich text editor can be added later.
                    </FormDescription>
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
                      <Input type="url" placeholder="https://example.com/image.png" {...field} disabled={isLoading} />
                    </FormControl>
                     <FormDescription>
                      Direct link to an image for the article.
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
                      <Input placeholder="e.g., 'forest conservation'" {...field} disabled={isLoading} />
                    </FormControl>
                    <FormDescription>
                      Keywords for placeholder images if Image URL is from placehold.co. Max two words.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6" disabled={isLoading || isStaticExport || !saveArticleAction}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <PlusCircle className="mr-2 h-5 w-5" /> Publish Article
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

