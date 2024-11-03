'use client'

import * as React from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowRight, Calendar, Search, User } from "lucide-react"
import Link from 'next/link'

// This would typically come from your API or database
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with AI-Powered Web Design",
    excerpt: "Learn how to leverage AI to streamline your web design process and create stunning websites in record time.",
    author: "Jane Doe",
    date: "2023-06-01",
    image: "/placeholder.svg?height=200&width=400"
  },
  {
    id: 2,
    title: "The Future of Web Development: AI and No-Code Platforms",
    excerpt: "Explore how AI and no-code platforms are revolutionizing the web development industry and what it means for developers.",
    author: "John Smith",
    date: "2023-05-28",
    image: "/placeholder.svg?height=200&width=400"
  },
  {
    id: 3,
    title: "Optimizing Website Performance with AI Tools",
    excerpt: "Discover how AI-powered tools can help you optimize your website's performance, from load times to user experience.",
    author: "Alice Johnson",
    date: "2023-05-25",
    image: "/placeholder.svg?height=200&width=400"
  },
  // Add more blog posts as needed
]

export function BlogMainComponent() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Blog</h1>
      
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded-t-lg" />
            </CardHeader>
            <CardContent>
              <CardTitle className="mb-2">{post.title}</CardTitle>
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{post.author}</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/blog/${post.id}`}>
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Separator className="my-8" />

      <Pagination />
    </div>
  )
}