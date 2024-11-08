import { MetadataRoute } from 'next'
import { createClient } from "@/utils/supabase/server"

// This will create multiple sitemap files: sitemap-1.xml, sitemap-2.xml, etc.
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
): Promise<Response> {
    const id = parseInt(params.id)
    const limit = 1000
    const offset = (id - 1) * limit

    const supabase = await createClient()
    const { data: websites } = await supabase
        .from("websites")
        .select("subdomain, updated_at")
        .eq("is_public", true)
        .eq("seo_indexed", true)
        .eq("isdeleted", false)
        .range(offset, offset + limit - 1)

    const sitemap = websites?.map(site => ({
        url: `https://${site.subdomain}.aiwebsitebuilder.tech`,
        lastModified: new Date(site.updated_at),
        changeFrequency: 'daily' as const,
        priority: 0.5,
    })) || []

    return new Response(JSON.stringify(sitemap), {
        headers: {
            'Content-Type': 'application/xml',
        },
    })
} 