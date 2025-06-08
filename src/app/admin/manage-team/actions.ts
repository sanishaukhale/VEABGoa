
"use server";

import { firestore, auth } from '@/lib/firebase'; // Import auth
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

  // Diagnostic log for authentication state
  if (auth && auth.currentUser) {
    console.log(`[Server Action] saveTeamMember: Executing as authenticated user: ${auth.currentUser.uid}, email: ${auth.currentUser.email}`);
  } else {
    console.warn("[Server Action] saveTeamMember: Executing with NO AUTHENTICATED USER according to Firebase client SDK. This WILL LIKELY CAUSE PERMISSION_DENIED if rules require auth. Ensure client is logged in and auth state is propagated.");
    // Depending on strictness, you might even return an error here:
    // return { success: false, error: "User not authenticated in server action context. Cannot save team member." };
  }

  if (!firestore) {
    console.error("Firestore is not initialized.");
    return { success: false, error: "Database connection error." };
  }

  const { displayOrder, ...restOfData } = parsedData.data;
  
  const dataToSave: any = { ...restOfData };

  if (displayOrder !== undefined && displayOrder !== null && !isNaN(displayOrder)) {
    dataToSave.displayOrder = Number(displayOrder);
  } else if (displayOrder === null || displayOrder === undefined || (typeof displayOrder === 'string' && displayOrder.trim() === '')) {
    dataToSave.displayOrder = null; // Explicitly set to null if cleared or not provided
  } else {
    // If it's some other non-numeric string, it might be an issue, but Zod should coerce.
    // For safety, if it's not a valid number or explicitly null/undefined, treat as null.
    dataToSave.displayOrder = Number.isNaN(Number(displayOrder)) ? null : Number(displayOrder);
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
    console.error(`Error saving team member to Firestore:`, error); 
    let errorMessage = "Failed to save team member due to a server error.";
    if (error.message) {
        errorMessage += ` Firebase: ${error.message}`;
    }
    if (error.code) {
        errorMessage += ` (Code: ${error.code})`; // This will show PERMISSION_DENIED
    }
    return { success: false, error: errorMessage };
  }
}

export async function deleteTeamMember(
  memberId: string
): Promise<{ success: boolean; error?: string; message?: string }> {
  // Diagnostic log for authentication state
  if (auth && auth.currentUser) {
    console.log(`[Server Action] deleteTeamMember: Executing as authenticated user: ${auth.currentUser.uid}, email: ${auth.currentUser.email}`);
  } else {
    console.warn("[Server Action] deleteTeamMember: Executing with NO AUTHENTICATED USER according to Firebase client SDK. This WILL LIKELY CAUSE PERMISSION_DENIED if rules require auth.");
  }
  
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
  } catch (error: any)
{
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

