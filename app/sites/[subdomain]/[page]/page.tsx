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

    // Inject website ID first
    const websiteIdScript = document.createElement("script");
    websiteIdScript.textContent = `window.__WEBSITE_ID__ = ${website.id};`;
    websiteIdScript.id = "website-id-script";

    // Add form capture script after website ID
    const formCaptureScript = document.createElement("script");
    formCaptureScript.src = "/form-capture.js";
    formCaptureScript.defer = true;
    formCaptureScript.id = "form-capture-script";

    // Find the first script in head, or append to head if none exists
    const firstScript = document.head.querySelector("script");
    if (firstScript) {
      firstScript.parentNode?.insertBefore(websiteIdScript, firstScript);
      firstScript.parentNode?.insertBefore(formCaptureScript, firstScript);
    } else {
      document.head.appendChild(websiteIdScript);
      document.head.appendChild(formCaptureScript);
    }

    return {
      headContent: document.head.innerHTML,
      bodyContent: document.body.innerHTML,
    };
  };

  const { headContent, bodyContent } = processContent(page.content);

  return <SiteContent content={bodyContent} headContent={headContent} />;
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
