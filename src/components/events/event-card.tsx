
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Event } from "@/types";
import { CalendarDays, MapPin, ArrowRight, Ticket } from "lucide-react";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="group flex flex-col md:flex-row h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02]">
      {event.imageUrl && (
        <div className="relative w-full md:w-1/3 h-56 md:h-auto overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:brightness-105 group-hover:scale-110 transition-all duration-300 ease-in-out"
            data-ai-hint={event.dataAiHint}
          />
        </div>
      )}
      <div className="flex flex-col flex-grow p-0 md:w-2/3">
        <CardHeader>
          <CardTitle className="text-primary text-xl">{event.title}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground pt-1 space-y-1">
            <span className="flex items-center">
              <CalendarDays size={14} className="mr-1.5" />
              {event.date} {event.time && `- ${event.time}`}
            </span>
            <span className="flex items-center">
              <MapPin size={14} className="mr-1.5" />
              {event.venue}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-foreground text-sm line-clamp-3">{event.description}</p>
        </CardContent>
        <CardFooter className="flex justify-end items-center">
          {event.registrationLink ? (
            <Button asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href={event.registrationLink} target="_blank">
                <Ticket size={16} className="mr-2" /> Register Now
              </Link>
            </Button>
          ) : (
             <Button variant="link" asChild className="text-accent p-0">
              <Link href="/events"> 
                More Info <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
}
