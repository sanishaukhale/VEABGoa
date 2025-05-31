
// Removed 'use server'; for static export compatibility.
// This function will now execute client-side if imported and called.

import { z } from 'zod';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Changed serverTimestamp to Timestamp

function slugify(text: string): string {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

const addArticleFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  slug: z.string().optional().refine(value => !value || /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value), {
    message: "Slug must be lowercase alphanumeric with hyphens, or empty for auto-generation.",
  }),
  date: z.string().min(5, { message: "Display date is required." }), // e.g., "July 30, 2024"
  author: z.string().optional(),
  snippet: z.string().min(10, { message: "Snippet must be at least 10 characters." }),
  content: z.string().min(20, { message: "Content must be at least 20 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
});

export type AddArticleFormValues = z.infer<typeof addArticleFormSchema>;

export async function saveArticle(formData: AddArticleFormValues) {
  const parsedData = addArticleFormSchema.safeParse(formData);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return { success: false, error: `Invalid data: ${errorMessages}` };
  }

  let { slug, ...articleData } = parsedData.data;

  if (!slug) {
    slug = slugify(articleData.title);
  }
  
  if (!firestore) {
    console.error("Firestore is not initialized. Cannot save article.");
    return { success: false, error: "Database connection error. Article not saved." };
  }

  try {
    await addDoc(collection(firestore, 'articles'), {
      ...articleData,
      slug: slug,
      createdAt: Timestamp.now(), // Use client-side Timestamp
    });
    return { success: true, message: "Article saved successfully!" };
  } catch (error) {
    console.error("Error saving article to Firestore (client-side):", error);
    return { success: false, error: "Failed to save the article due to a server error." };
  }
}
