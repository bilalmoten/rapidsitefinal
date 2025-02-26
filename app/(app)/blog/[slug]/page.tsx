import React from "react";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Facebook, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { getPostBySlug, getAllPosts } from "@/lib/mdx";
import Markdown from "react-markdown";

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: `${post.title} | RapidSite Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: [post.coverImage],
    },
  };
}

export default async function BlogPostPage(props: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const post = getPostBySlug(params.slug);
  if (!post) return notFound();

  // Get related posts
  const allPosts = getAllPosts();
  const relatedPosts = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <article className="prose prose-lg dark:prose-invert max-w-3xl mx-auto prose-headings:text-neutral-10 prose-p:text-neutral-30 prose-p:leading-relaxed prose-strong:text-neutral-10 prose-a:text-primary-main hover:prose-a:text-primary-main/80 prose-li:text-neutral-30 prose-code:text-primary-main prose-code:bg-primary-main/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none">
        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full aspect-video object-cover rounded-lg mb-8"
          />
        )}

        <div className="flex items-center space-x-4 mb-8 not-prose">
          <Avatar>
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold text-neutral-10">{post.author}</div>
            <div className="text-sm text-neutral-40 flex items-center">
              <Calendar className="inline h-4 w-4 mr-1" />
              {formatDate(post.date)}
            </div>
          </div>
        </div>

        <div className="mdx-content space-y-6">
          <Markdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-4xl font-bold mb-8 text-neutral-10">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-semibold mt-12 mb-6 text-neutral-10">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold mt-8 mb-4 text-neutral-10">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-relaxed text-neutral-30">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 ml-4 text-neutral-30">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 ml-4 text-neutral-30">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="text-lg leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary-main pl-4 italic text-neutral-30">
                  {children}
                </blockquote>
              ),
            }}
          >
            {post.content}
          </Markdown>
        </div>

        <div className="flex items-center space-x-4 mt-12 not-prose">
          <span className="font-semibold text-neutral-10">Share:</span>
          <Button
            size="icon"
            variant="outline"
            className="border-neutral-70 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
          >
            <Facebook className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="border-neutral-70 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
          >
            <Twitter className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            className="border-neutral-70 text-neutral-30 hover:text-neutral-10 hover:bg-neutral-90/50"
          >
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>

        {relatedPosts.length > 0 && (
          <>
            <Separator className="my-8" />
            <div className="not-prose">
              <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <div
                    key={relatedPost.slug}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-border"
                  >
                    {relatedPost.coverImage && (
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {relatedPost.description}
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
