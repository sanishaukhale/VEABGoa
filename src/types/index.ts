
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
}

export interface Article {
  id: string;
  title: string;
  date: string;
  author?: string;
  snippet: string;
  content?: string; // Optional full content
  imageUrl?: string;
  dataAiHint?: string;
  slug: string;
}
