
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project } from "@/types";
import { MapPin, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="group flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:scale-[1.02]">
      <div className="relative w-full h-56 overflow-hidden">
        <Image
          src={project.imageUrl.startsWith('https://') ? project.imageUrl : `${basePath}${project.imageUrl}`}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:brightness-105 group-hover:scale-110 transition-all duration-300 ease-in-out"
          data-ai-hint={project.dataAiHint}
        />
      </div>
      <CardHeader>
        <CardTitle className="text-primary text-xl">{project.title}</CardTitle>
        {project.location && (
          <CardDescription className="flex items-center text-sm text-muted-foreground pt-1">
            <MapPin size={14} className="mr-1.5" />
            {project.location}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground text-sm line-clamp-3">{project.description}</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="text-accent p-0">
          {/* In a real app, this would link to a detailed project page e.g. /projects/${project.id} */}
          <Link href="/projects"> 
            Learn More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

    