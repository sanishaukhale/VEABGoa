
import type { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  location?: string;
  createdAt?: Timestamp; // Added for sorting and consistency
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue: string;
  description:string;
  registrationLink?: string;
  imageUrl?: string;
  dataAiHint?: string;
  createdAt?: Timestamp; // Added for sorting
}

export interface Article {
  id: string;
  title: string;
  date: string; // This would typically be derived from createdAt or a specific publication date field
  author?: string;
  snippet: string;
  content?: string; // Optional full content
  imageUrl?: string;
  dataAiHint?: string;
  slug: string;
  createdAt?: Timestamp; // Added for sorting
}

// Firestore-friendly structure for social links
export interface SocialLinkFirestore {
  platform: string; // e.g., "LinkedIn", "Twitter", "Mail"
  url: string;
}

// Updated TeamMember interface for Firestore data
export interface TeamMember {
  id: string; // Document ID from Firestore
  name: string;
  role: string;
  imageUrl: string; // Path in Firebase Storage, e.g., "team-images/name.png"
  dataAiHint?: string;
  intro: string;
  profession: string;
  socials?: SocialLinkFirestore[];
  displayOrder?: number; // Optional: for custom sorting if needed
}
