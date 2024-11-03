import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Calendar, Search, User } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { Suspense } from "react";
import Image from "next/image";
import { Metadata } from "next";

// Enable caching
export const revalidate = 3600; // Revalidate every hour

// Add proper typing for posts
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image: string;
  author: string;
  created_at: string;
}

// Add at the top of the file
export const runtime = "edge"; // Enable edge runtime
export const preferredRegion = "auto"; // Automatically choose closest region
export const dynamic = "force-dynamic"; // Always fetch fresh data

export const metadata: Metadata = {
  title: "Blog | AI Website Builder",
  description: "Latest articles about AI-powered web development and design",
  openGraph: {
    title: "Blog | AI Website Builder",
    description: "Latest articles about AI-powered web development and design",
    type: "website",
  },
};

async function getInitialPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, cover_image, author, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return data as BlogPost[];
}

export default async function BlogPage() {
  const initialPosts = await getInitialPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">AI Website Builder - Blog</h1>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <Input placeholder="Search blog posts..." className="w-64" />
            <Button size="icon" variant="outline">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {initialPosts?.map((post, index) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {post.cover_image && (
                <div className="relative w-full h-48">
                  <Image
                    src={post.cover_image}
                    alt={post.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index < 3} // Load first 3 images immediately
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <User className="h-4 w-4 mr-1" />
                  <span className="mr-4">{post.author}</span>
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(post.created_at)}</span>
                </div>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Button asChild>
                  <Link href={`/blog/${post.slug}`}>
                    Read More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="py-12 border-t border-gray-200 dark:border-gray-700">
          <NewsletterSignup />
        </div>
      </Suspense>
    </div>
  );
}
