
import ArticleCard from "@/components/news/article-card";
import type { Article } from "@/types";
import { Newspaper } from "lucide-react";

const articlesData: Article[] = [
  {
    id: "1",
    title: "VEAB Goa Launches 'Green Goa' Initiative for School Children",
    date: "August 28, 2024",
    author: "VEAB Goa Team",
    snippet: "Our new 'Green Goa' initiative aims to instill environmental awareness and responsibility among school students through interactive workshops and tree plantation drives.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "children planting tree",
    slug: "green-goa-initiative",
  },
  {
    id: "2",
    title: "The Importance of Mangrove Ecosystems in Coastal Protection",
    date: "August 15, 2024",
    author: "Dr. Anya Sharma",
    snippet: "An in-depth look at why mangrove forests are crucial for Goa's coastline, their role in biodiversity, and the threats they face.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "mangrove roots",
    slug: "importance-of-mangroves",
  },
  {
    id: "3",
    title: "Community Spotlight: Success Story from Our Waste Segregation Program",
    date: "July 30, 2024",
    author: "Rohan Almeida",
    snippet: "Highlighting the positive impact of our waste segregation program in a local Goan village, showcasing community participation and results.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "community meeting waste",
    slug: "waste-segregation-success",
  },
  {
    id: "4",
    title: "A Guide to Birdwatching in Goa's Sanctuaries",
    date: "July 10, 2024",
    author: "Guest Blogger: Avian Enthusiast",
    snippet: "Explore the best spots for birdwatching in Goa, common species to look out for, and tips for ethical wildlife observation.",
    imageUrl: "https://placehold.co/600x400.png",
    dataAiHint: "bird colorful feathers",
    slug: "birdwatching-goa-guide",
  },
];

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Newspaper size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">News & Blog</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Stay updated with our latest activities, insights, and environmental news.
        </p>
      </header>

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articlesData.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}
