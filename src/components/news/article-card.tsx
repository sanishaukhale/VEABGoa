
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Article } from "@/types";
import { CalendarDays, UserCircle, ArrowRight } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      {article.imageUrl && (
        <div className="relative w-full h-56">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={article.dataAiHint}
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-primary text-xl">{article.title}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground pt-1 space-x-4">
          <span className="inline-flex items-center">
            <CalendarDays size={14} className="mr-1.5" />
            {article.date}
          </span>
          {article.author && (
            <span className="inline-flex items-center">
              <UserCircle size={14} className="mr-1.5" />
              {article.author}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground text-sm line-clamp-4">{article.snippet}</p>
      </CardContent>
      <CardFooter>
        <Button variant="link" asChild className="text-accent p-0">
          {/* In a real app, this would link to a full article page e.g. /news/${article.slug} */}
          <Link href={`/news#${article.slug}`}> 
            Read More <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
