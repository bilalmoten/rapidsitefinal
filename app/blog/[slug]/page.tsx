import React from "react";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import Markdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Calendar,
  Facebook,
  Linkedin,
  Twitter,
  User,
} from "lucide-react";
import Link from "next/link";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const slug = React.use(Promise.resolve(params.slug));

  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !post) {
    return notFound();
  }

  // Get related posts (example query - adjust as needed)
  const { data: relatedPosts } = await supabase
    .from("blog_posts")
    .select("id, title, excerpt, cover_image, slug")
    .neq("id", post.id)
    .limit(2);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <article className="max-w-3xl mx-auto">
        {post.cover_image && (
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-64 object-cover rounded-lg mb-6"
          />
        )}

        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center space-x-4 mb-6">
          <Avatar>
            <AvatarFallback>{post.author?.[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{post.author}</div>
            <div className="text-sm text-muted-foreground">
              <Calendar className="inline h-4 w-4 mr-1" />
              {formatDate(post.created_at)}
            </div>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-8">
          <Markdown>{post.content}</Markdown>
        </div>

        <div className="flex items-center space-x-4 mb-8">
          <span className="font-semibold">Share:</span>
          <Button size="icon" variant="outline">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="outline">
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>

        {relatedPosts && relatedPosts.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
                  >
                    {relatedPost.cover_image && (
                      <img
                        src={relatedPost.cover_image}
                        alt={relatedPost.title}
                        className="w-full h-32 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {relatedPost.excerpt}
                      </p>
                      <Button asChild variant="ghost">
                        <Link href={`/blog/${relatedPost.slug}`}>
                          Read More
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </article>
    </div>
  );
}
