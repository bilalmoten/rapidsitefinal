import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { JSDOM } from "jsdom";
import NoSitePage from "@/components/NoSitePage";

export default async function SubdomainPage({
  params,
}: {
  params: { subdomain: string };
}) {
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

  const replaceLinks = (content: string) => {
    const dom = new JSDOM(content);
    const document = dom.window.document;

    document.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href");
      if (href && !href.startsWith("http") && !href.startsWith("#")) {
        const newHref = `/sites/${params.subdomain}/${href.replace(
          ".html",
          ""
        )}`;
        a.setAttribute("href", newHref);
      }
    });

    return document.body.innerHTML;
  };

  const modifiedContent = replaceLinks(page.content);

  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <Script
        src="https://kit.fontawesome.com/037776171a.js"
        crossOrigin="anonymous"
        strategy="beforeInteractive"
      />
      <div
        id="page-content"
        dangerouslySetInnerHTML={{ __html: modifiedContent }}
      />
      <Script id="apply-styles">
        {`
          document.body.innerHTML = document.getElementById('page-content').innerHTML;
          document.body.style.margin = '0';
          document.body.style.padding = '0';
          document.body.className = 'bg-white text-gray-800';
        `}
      </Script>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { subdomain: string };
}) {
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

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  };
}
