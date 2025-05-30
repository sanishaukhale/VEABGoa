
import ArticleCard from "@/components/news/article-card";
import type { Article } from "@/types";
import { Newspaper } from "lucide-react";
import { firestore } from '@/lib/firebase';
import { collection, getDocs, orderBy, query, Timestamp } from 'firebase/firestore';

async function getArticles(): Promise<Article[]> {
  try {
    const articlesCollection = collection(firestore, 'articles');
    // Order by 'createdAt' timestamp in descending order to get newest first
    // If you don't have a 'createdAt' field yet, you might want to order by 'date' or add one.
    // For 'createdAt' to work, ensure it's a Firestore Timestamp.
    const q = query(articlesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const articles = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Ensure date is a string. If createdAt is a Timestamp, convert it.
      // This example assumes 'date' field is already a string in Firestore,
      // or you are handling its formatting appropriately.
      // If 'date' is meant to be the publish date from 'createdAt', you'd format it here.
      // e.g., date: (data.createdAt as Timestamp)?.toDate().toLocaleDateString() || new Date().toLocaleDateString()
      return {
        id: doc.id,
        title: data.title,
        date: data.date, // Assuming 'date' is stored as a string as per original static data
        author: data.author,
        snippet: data.snippet,
        imageUrl: data.imageUrl,
        dataAiHint: data.dataAiHint,
        slug: data.slug,
        createdAt: data.createdAt, // Keep the Timestamp for potential use
      } as Article;
    });
    return articles;
  } catch (error) {
    console.error("Error fetching articles: ", error);
    return []; // Return empty array on error
  }
}

export default async function NewsPage() {
  const articlesData = await getArticles();

  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <header className="text-center mb-12">
        <Newspaper size={64} className="mx-auto text-primary mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary">News & Blog</h1>
        <p className="text-xl text-muted-foreground mt-2">
          Stay updated with our latest activities, insights, and environmental news.
        </p>
      </header>

      {articlesData.length > 0 ? (
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesData.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
         <div className="text-center py-10">
          <p className="text-xl text-muted-foreground">No articles found. Please check back soon or ensure articles are added to Firestore.</p>
        </div>
      )}
    </div>
  );
}
