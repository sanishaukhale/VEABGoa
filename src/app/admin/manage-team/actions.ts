
"use server";

import { z } from 'zod';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import type { TeamMember } from '@/types'; // Assuming TeamMember is defined

const socialLinkSchema = z.object({
  platform: z.string().min(1, "Platform name cannot be empty"),
  url: z.string().url("Social URL must be a valid URL (e.g., https://... or mailto:...)")
});

export const teamMemberFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  role: z.string().min(2, { message: "Role must be at least 2 characters." }),
  imageUrl: z.string().min(5, { message: "Image URL (path in Storage) is required. E.g., team-images/your-image.png" }),
  dataAiHint: z.string().optional().default(''),
  intro: z.string().min(10, { message: "Introduction must be at least 10 characters." }),
  profession: z.string().min(3, { message: "Profession must be at least 3 characters." }),
  socials: z.array(socialLinkSchema).optional().default([]),
  displayOrder: z.coerce.number().optional(),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberFormSchema>;

export async function saveTeamMember(
  data: TeamMemberFormValues,
  memberId?: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  const parsedData = teamMemberFormSchema.safeParse(data);

  if (!parsedData.success) {
    const errorMessages = parsedData.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return { success: false, error: `Invalid data: ${errorMessages}` };
  }

  if (!firestore) {
    console.error("Firestore is not initialized.");
    return { success: false, error: "Database connection error." };
  }

  const dataToSave = {
    ...parsedData.data,
    // Ensure displayOrder is stored as a number or removed if undefined
    displayOrder: parsedData.data.displayOrder === undefined || isNaN(parsedData.data.displayOrder) ? null : parsedData.data.displayOrder,
  };


  try {
    if (memberId) {
      // Update existing member
      const memberRef = doc(firestore, 'teamMembers', memberId);
      await updateDoc(memberRef, {
        ...dataToSave,
        updatedAt: Timestamp.now(), // Optional: add an updated timestamp
      });
    } else {
      // Add new member
      await addDoc(collection(firestore, 'teamMembers'), {
        ...dataToSave,
        createdAt: Timestamp.now(), // Optional: add a created timestamp
      });
    }
    revalidatePath('/about'); // Revalidate the public about page
    revalidatePath('/admin/manage-team'); // Revalidate the admin manage team page
    return { success: true, message: `Team member ${memberId ? 'updated' : 'saved'} successfully!` };
  } catch (error) {
    console.error(`Error saving team member to Firestore:`, error);
    return { success: false, error: "Failed to save team member due to a server error." };
  }
}

export async function deleteTeamMember(
  memberId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  if (!firestore) {
    console.error("Firestore is not initialized.");
    return { success: false, error: "Database connection error." };
  }
  if (!memberId) {
    return { success: false, error: "Member ID is required for deletion." };
  }

  try {
    const memberRef = doc(firestore, 'teamMembers', memberId);
    await deleteDoc(memberRef);
    revalidatePath('/about');
    revalidatePath('/admin/manage-team');
    return { success: true, message: "Team member deleted successfully." };
  } catch (error) {
    console.error(`Error deleting team member from Firestore:`, error);
    return { success: false, error: "Failed to delete team member." };
  }
}
