import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { JSDOM } from "jsdom";
import NoSitePage from "@/components/NoSitePage";
import SiteContent from "@/components/SiteContent";
import { Metadata, Viewport } from "next";

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
