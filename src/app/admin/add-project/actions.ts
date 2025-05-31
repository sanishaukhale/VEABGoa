
'use server';

import { z } from 'zod';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const addProjectFormSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  imageUrl: z.string().url({ message: "Please enter a valid URL for the image." }).optional().or(z.literal('')),
  dataAiHint: z.string().optional(),
  location: z.string().optional(),
});

export type AddProjectFormValues = z.infer<typeof addProjectFormSchema>;

export async function saveProject(formData: AddProjectFormValues) {
  const parsedData = addProjectFormSchema.safeParse(formData);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return { success: false, error: `Invalid data: ${errorMessages}` };
  }

  try {
    await addDoc(collection(firestore, 'projects'), {
      ...parsedData.data,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Project saved successfully!" };
  } catch (error) {
    console.error("Error saving project to Firestore:", error);
    return { success: false, error: "Failed to save the project due to a server error." };
  }
}
