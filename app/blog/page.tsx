import { Metadata } from "next";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { getAllPosts } from "@/lib/mdx";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog | RapidSite",
  description: "Latest updates, guides, and insights about RapidSite",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">RapidSite Blog</h1>
          <p className="text-xl text-muted-foreground">
            Latest updates, guides, and insights about website building with AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg flex flex-col border border-border"
            >
              <Link
                href={`/blog/${post.slug}`}
                className="flex flex-col flex-1"
              >
                {post.coverImage && (
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <Calendar className="mr-1 h-4 w-4" />
                    <span className="mr-3">{formatDate(post.date)}</span>
                    <User className="mr-1 h-4 w-4" />
                    <span className="truncate">{post.author}</span>
                  </div>
                  <h2 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="group-hover:text-primary mt-auto self-start"
                  >
                    Read More →
                  </Button>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
