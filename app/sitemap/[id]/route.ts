import { createClient } from "@/utils/supabase/server"

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

    // Generate XML directly
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${websites?.map(site => `
    <url>
        <loc>https://${site.subdomain}.aiwebsitebuilder.tech</loc>
        <lastmod>${new Date(site.updated_at).toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.5</priority>
    </url>`).join('') || ''}
</urlset>`

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'public, max-age=3600',
        },
    })
} 