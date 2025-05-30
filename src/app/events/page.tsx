
import EventCard from "@/components/events/event-card";
import type { Event } from "@/types";
import { CalendarHeart } from "lucide-react";

const eventsData: Event[] = [
  {
    id: "1",
    title: "Annual Beach Cleanup Challenge",
    date: "September 5, 2024",
    time: "8:00 AM - 12:00 PM",
    venue: "Calangute Beach, Goa",
    description: "Join hundreds of volunteers for our biggest beach cleanup event of the year. Let's make Goa's beaches pristine!",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "beach cleanup volunteers",
    registrationLink: "#",
  },
  {
    id: "2",
    title: "Workshop: Home Composting & Waste Reduction",
    date: "September 18, 2024",
    time: "2:00 PM - 4:00 PM",
    venue: "VEAB Goa Office, Panjim",
    description: "Learn practical techniques for home composting and reducing household waste in this hands-on workshop.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "composting workshop",
    registrationLink: "#",
  },
  {
    id: "3",
    title: "Nature Photography Contest & Exhibition",
    date: "October 1-15, 2024 (Exhibition from Oct 20)",
    venue: "Kala Academy, Panjim",
    description: "Capture the beauty of Goa's flora and fauna. Winning entries will be showcased at our annual exhibition.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "nature photography camera",
  },
   {
    id: "4",
    title: "Seed Ball Making Drive for Afforestation",
    date: "November 10, 2024",
    time: "10:00 AM - 1:00 PM",
    venue: "Bondla Wildlife Sanctuary entrance",
    description: "Participate in creating seed balls which will be used for afforestation efforts in degraded forest areas.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "hands making seed balls",
    registrationLink: "#",
  },
];

export default function EventsPage() {
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
          <p className="text-xl text-muted-foreground">No upcoming events scheduled at the moment. Please check back soon!</p>
        </div>
      )}
    </div>
  );
}
