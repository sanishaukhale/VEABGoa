
"use server";

import { firestore } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { revalidatePath } from 'next/cache';
import { teamMemberFormSchema, type TeamMemberFormValues } from '@/lib/schemas/teamMemberSchema';

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

  const { displayOrder, ...restOfData } = parsedData.data;
  
  const dataToSave: any = { ...restOfData };

  if (displayOrder !== undefined && !isNaN(displayOrder)) {
    dataToSave.displayOrder = Number(displayOrder);
  } else {
    dataToSave.displayOrder = null; // Store as null if not provided or NaN
  }


  try {
    if (memberId) {
      // Update existing member
      const memberRef = doc(firestore, 'teamMembers', memberId);
      await updateDoc(memberRef, {
        ...dataToSave,
        updatedAt: Timestamp.now(),
      });
    } else {
      // Add new member
      await addDoc(collection(firestore, 'teamMembers'), {
        ...dataToSave,
        createdAt: Timestamp.now(),
      });
    }
    revalidatePath('/about');
    revalidatePath('/admin/manage-team');
    return { success: true, message: `Team member ${memberId ? 'updated' : 'saved'} successfully!` };
  } catch (error: any) {
    console.error(`Error saving team member to Firestore:`, error); // Check server logs for this full error!
    let errorMessage = "Failed to save team member due to a server error.";
    if (error.message) {
        errorMessage += ` Firebase: ${error.message}`;
    }
    if (error.code) {
        errorMessage += ` (Code: ${error.code})`;
    }
    return { success: false, error: errorMessage };
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
  } catch (error: any) {
    console.error(`Error deleting team member from Firestore:`, error);
    let errorMessage = "Failed to delete team member.";
    if (error.message) {
        errorMessage += ` Firebase: ${error.message}`;
    }
    if (error.code) {
        errorMessage += ` (Code: ${error.code})`;
    }
    return { success: false, error: errorMessage };
  }
}

