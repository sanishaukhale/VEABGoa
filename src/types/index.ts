
import type { Timestamp } from 'firebase/firestore';

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  location?: string;
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

