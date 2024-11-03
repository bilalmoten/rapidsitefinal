'use client'

import * as React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Facebook, Linkedin, MessageCircle, Twitter, User } from "lucide-react"
import Link from 'next/link'

// This would typically come from your API or database based on the post ID
const blogPost = {
  id: 1,
  title: "Getting Started with AI-Powered Web Design",
  content: `
    <p>Artificial Intelligence (AI) is revolutionizing the web design industry, offering new ways to create stunning and efficient websites. In this post, we'll explore how you can leverage AI to streamline your web design process and create impressive websites in record time.</p>
    
    <h2>Understanding AI in Web Design</h2>
    <p>AI in web design refers to the use of machine learning algorithms and neural networks to automate and enhance various aspects of the design process. From generating layout suggestions to optimizing user experiences, AI tools are becoming indispensable for modern web designers.</p>
    
    <h2>Key Benefits of AI-Powered Web Design</h2>
    <ul>
      <li>Faster prototyping and iteration</li>
      <li>Data-driven design decisions</li>
      <li>Personalized user experiences</li>
      <li>Automated content generation</li>
      <li>Enhanced accessibility features</li>
    </ul>
    
    <h2>Getting Started with AI Web Design Tools</h2>
    <p>To begin incorporating AI into your web design workflow, start by exploring some of the popular AI-powered design tools available in the market. These tools can help with various aspects of design, from generating color palettes to creating entire layouts based on your input.</p>
    
    <p>Remember, while AI can significantly enhance your design process, it's essential to maintain a balance between automation and human creativity. Use AI as a tool to augment your skills rather than replace them entirely.</p>
  `,
  author: {
    name: "Jane Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Jane is a web designer and AI enthusiast with over 10 years of experience in the industry."
  },
  date: "2023-06-01",
  image: "/placeholder.svg?height=400&width=800",
  tags: ["AI", "Web Design", "Technology"]
}

const relatedPosts = [
  {
    id: 2,
    title: "The Future of Web Development: AI and No-Code Platforms",
    excerpt: "Explore how AI and no-code platforms are revolutionizing the web development industry and what it means for developers.",
    image: "/placeholder.svg?height=100&width=200"
  },
  {
    id: 3,
    title: "Optimizing Website Performance with AI Tools",
    excerpt: "Discover how AI-powered tools can help you optimize your website's performance, from load times to user experience.",
    image: "/placeholder.svg?height=100&width=200"
  }
]

export function BlogPostComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link href="/blog">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Blog
        </Link>
      </Button>

      <article className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>
        
        <div className="flex items-center space-x-4 mb-6">
          <Avatar>
            <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
            <AvatarFallback>{blogPost.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-semibold">{blogPost.author.name}</div>
            <div className="text-sm text-muted-foreground">
              <Calendar className="inline h-4 w-4 mr-1" />
              {blogPost.date}
            </div>
          </div>
        </div>

        <img src={blogPost.image} alt={blogPost.title} className="w-full h-64 object-cover rounded-lg mb-6" />

        <div className="prose max-w-none mb-8" dangerouslySetInnerHTML={{ __html: blogPost.content }} />

        <div className="flex flex-wrap gap-2 mb-6">
          {blogPost.tags.map(tag => (
            <Button key={tag} variant="outline" size="sm">{tag}</Button>
          ))}
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

        <Separator className="my-8" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">About the Author</h2>
          <div className="flex items-start space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={blogPost.author.avatar} alt={blogPost.author.name} />
              <AvatarFallback>{blogPost.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{blogPost.author.name}</h3>
              <p className="text-muted-foreground">{blogPost.author.bio}</p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {relatedPosts.map((post) => (
              <Card key={post.id}>
                <CardHeader>
                  <img src={post.image} alt={post.title} className="w-full h-32 object-cover rounded-t-lg" />
                </CardHeader>
                <CardContent>
                  <CardTitle className="mb-2">{post.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{post.excerpt}</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="ghost">
                    <Link href={`/blog/${post.id}`}>
                      Read More
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <Separator className="my-8" />

        <div>
          <h2 className="text-2xl font-bold mb-4">Comments</h2>
          {/* Add your comment system here */}
          <Button>
            <MessageCircle className="mr-2 h-4 w-4" />
            Add a Comment
          </Button>
        </div>
      </article>
    </div>
  )
}