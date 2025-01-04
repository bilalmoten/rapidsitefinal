import React from "react";
import { createClient } from "@/utils/supabase/server";
import { Metadata, Viewport } from "next";
import { JSDOM } from "jsdom";
import NoSitePage from "@/components/NoSitePage";
import PageNotFound from "@/components/PageNotFound";
import SiteContent from "@/components/SiteContent";

interface SitePageProps {
  params: Promise<{
    subdomain: string;
    page: string;
  }>;
}

export default async function SitePage(props: SitePageProps) {
  const params = await props.params;
  const supabase = await createClient();

  console.log("Fetching website data for subdomain:", params.subdomain);
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("pages, id")
    .eq("subdomain", params.subdomain)
    .single();

  // If website doesn't exist, show NoSitePage
  if (websiteError || !website) {
    return <NoSitePage subdomain={params.subdomain} />;
  }

  // If website exists but has no pages
  if (!website.pages || website.pages.length === 0) {
    return <PageNotFound subdomain={params.subdomain} page={params.page} />;
  }

  console.log("Fetching page content");
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("website_id", website.id)
    .eq("title", `${params.page}.html`)
    .single();

  // If page doesn't exist or there's an error fetching it
  if (pageError || !page) {
    return <PageNotFound subdomain={params.subdomain} page={params.page} />;
  }

  const processContent = (content: string) => {
    const dom = new JSDOM(content);
    const document = dom.window.document;

    // Process links
    document.querySelectorAll("a").forEach((a: HTMLAnchorElement) => {
      const href = a.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("#")) {
        const newHref = `/sites/${params.subdomain}/${href.replace(
          ".html",
          ""
        )}`;
        a.setAttribute("href", newHref);
      }
    });

    return {
      bodyContent: document.body.innerHTML,
    };
  };

  const { bodyContent } = processContent(page.content);

  return <SiteContent content={bodyContent} />;
}

export async function generateMetadata(props: {
  params: Promise<{ subdomain: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: website } = await supabase
    .from("websites")
    .select("title")
    .eq("subdomain", params.subdomain)
    .single();

  return {
    title: website?.title || "Website",
  };
}

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  };
}
