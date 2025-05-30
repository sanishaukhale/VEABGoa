
import EventCard from "@/components/events/event-card";
import type { Event } from "@/types";
import { CalendarHeart } from "lucide-react";
import { firestore } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

async function getEvents(): Promise<Event[]> {
  try {
    const eventsCollection = collection(firestore, 'events');
    // Order by 'createdAt' or 'date'. Ensure 'date' is queryable if used for ordering.
    // If 'date' is a string like "September 5, 2024", direct sorting might not be chronological.
    // It's better to use a Timestamp field like 'eventTimestamp' or 'createdAt' for sorting.
    // This example assumes you have a 'createdAt' field (Firestore Timestamp) for ordering.
    const q = query(eventsCollection, orderBy('createdAt', 'desc')); // or orderBy('date', 'asc') if 'date' is a Timestamp
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Similar to articles, ensure date formatting if 'date' comes from a Timestamp
      return {
        id: doc.id,
        title: data.title,
        date: data.date, // Assuming 'date' is stored as string
        time: data.time,
        venue: data.venue,
        description: data.description,
        imageUrl: data.imageUrl,
        dataAiHint: data.dataAiHint,
        registrationLink: data.registrationLink,
        createdAt: data.createdAt,
      } as Event;
    });
    return events;
  } catch (error) {
    console.error("Error fetching events: ", error);
    return [];
  }
}


export default async function EventsPage() {
  const eventsData = await getEvents();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <CalendarHeart size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">Upcoming Events & Campaigns</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Get involved! Join our events, workshops, and awareness campaigns.
        </p>
      </header>

      {eventsData.length > 0 ? (
        <div className="space-y-8">
          {eventsData.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No upcoming events scheduled at the moment. Please check back soon or ensure events are added to Firestore.</p>
        </div>
      )}
    </div>
  );
}
