
// Removed 'use server'; for static export compatibility.
// This function will now execute client-side if imported and called.

import { z } from 'zod';
import { firestore } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore'; // Changed serverTimestamp to Timestamp

// This schema should match the one in your contact page
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  honeypot: z.string().optional(), // Keep the honeypot field
});

export async function saveContactMessage(formData: unknown) {
  const parsedData = contactFormSchema.safeParse(formData);

  if (!parsedData.success) {
    // Construct a user-friendly error message from Zod errors
    const errorMessages = parsedData.error.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    return { success: false, error: `Invalid data: ${errorMessages}` };
  }

  const { honeypot, ...messageData } = parsedData.data;

  if (honeypot) {
    console.log("Spam attempt detected (client-side). Data:", parsedData.data);
    // Still return success-like to not alert the bot, but don't save.
    // The client will show its generic success toast.
    return { success: true, message: "Message received." };
  }

  if (!firestore) {
    console.error("Firestore is not initialized. Cannot save contact message.");
    return { success: false, error: "Database connection error. Message not saved." };
  }

  try {
    await addDoc(collection(firestore, 'contactMessages'), {
      ...messageData,
      createdAt: Timestamp.now(), // Use client-side Timestamp
      status: 'new', // Optional: add a status for tracking
    });
    return { success: true, message: "Your message has been saved successfully!" };
  } catch (error) {
    console.error("Error saving contact message to Firestore (client-side):", error);
    // In a production app, you might want to log this error to a monitoring service
    return { success: false, error: "Failed to save your message due to a server error. Please try again later." };
  }
}
