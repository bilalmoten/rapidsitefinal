import { MetadataRoute } from 'next'
import { createClient } from "@/utils/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://aiwebsitebuilder.tech'
    const supabase = await createClient()

    // Get blog posts for dynamic routes
    const { data: blogPosts } = await supabase
        .from("blog_posts")
        .select("slug, created_at")
        .eq("published", true)

    // Get all public websites
    const { data: publicWebsites } = await supabase
        .from("websites")
        .select("subdomain, updated_at")
        .eq("isdeleted", false)
    // Optionally keep these filters if you want users to control SEO
    // .eq("is_public", true)
    // .eq("seo_indexed", true)

    // Static routes
    const staticRoutes = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/inspiration`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/login`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
        {
            url: `${baseUrl}/signup`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        },
    ]

    // Dynamic blog post routes
    const blogRoutes = (blogPosts || []).map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    // User website routes
    const websiteRoutes = (publicWebsites || []).map((site) => ({
        url: `https://${site.subdomain}.aiwebsitebuilder.tech`,
        lastModified: new Date(site.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.5,
    }))

    return [...staticRoutes, ...blogRoutes, ...websiteRoutes]
} 