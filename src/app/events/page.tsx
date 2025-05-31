
import { CalendarHeart, Hourglass } from "lucide-react";

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

      <div className="flex flex-col items-center justify-center text-center py-20">
        <Hourglass size={64} className="mx-auto text-accent mb-6" />
        <h2 className="text-3xl font-semibold text-primary mb-3">Coming Soon!</h2>
        <p className="text-lg text-muted-foreground max-w-md">
          Our events calendar is being updated. Stay tuned for exciting announcements!
        </p>
      </div>
    </div>
  );
}
