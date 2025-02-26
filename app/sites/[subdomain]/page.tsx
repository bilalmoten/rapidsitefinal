import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { JSDOM } from "jsdom";
import NoSitePage from "@/components/NoSitePage";
import SiteContent from "@/components/SiteContent";
import { Metadata, Viewport } from "next";

interface WebsiteData {
  id: string;
  pages: string[];
}

export default async function SubdomainPage(props: {
  params: Promise<{ subdomain: string }>;
}) {
  const params = await props.params;
  const supabase = await createClient();

  console.log("Fetching website data for subdomain:", params.subdomain);
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("pages, id")
    .eq("subdomain", params.subdomain)
    .single();

  if (
    websiteError ||
    !website ||
    !website.pages ||
    website.pages.length === 0
  ) {
    return <NoSitePage subdomain={params.subdomain} />;
  }

  const initialPageTitle = website.pages[0];
  console.log("Initial page title:", initialPageTitle);

  console.log("Fetching page content");
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("website_id", website.id)
    .eq("title", initialPageTitle)
    .single();

  if (pageError || !page) {
    return <NoSitePage subdomain={params.subdomain} />;
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

    // Inject website ID
    const websiteIdScript = document.createElement("script");
    websiteIdScript.textContent = `window.__WEBSITE_ID__ = ${website.id};`;
    websiteIdScript.id = "website-id-script";
    document.head.appendChild(websiteIdScript);

    // Add form capture script
    const formCaptureScript = document.createElement("script");
    formCaptureScript.src = "/form-capture.js";
    formCaptureScript.defer = true;
    formCaptureScript.id = "form-capture-script";
    document.head.appendChild(formCaptureScript);

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
