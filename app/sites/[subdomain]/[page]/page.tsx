import React from "react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata, Viewport } from "next";
import Script from "next/script";
import { JSDOM } from "jsdom";

interface SitePageProps {
  params: {
    subdomain: string;
    page: string;
  };
}

export default async function SitePage({ params }: SitePageProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log("No user found, redirecting to login");
    return redirect("/login");
  }

  console.log("Fetching website data for subdomain:", params.subdomain);
  const { data: website, error: websiteError } = await supabase
    .from("websites")
    .select("pages, id")
    .eq("subdomain", params.subdomain)
    .single();

  if (websiteError) {
    console.error("Error fetching website:", websiteError);
    return (
      <div>Error fetching website information: {websiteError.message}</div>
    );
  }

  if (!website || !website.pages || website.pages.length === 0) {
    console.error("No pages found for website");
    return <div>No pages found for this website.</div>;
  }

  const initialPageTitle = website.pages[0];
  console.log("Initial page title:", initialPageTitle);

  console.log("Fetching page content");
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("content")
    .eq("user_id", user.id)
    .eq("website_id", website.id)
    .eq("title", `${params.page}.html`)
    .single();

  if (pageError) {
    console.error("Error fetching page content:", pageError);
    return <div>Error fetching page content: {pageError.message}</div>;
  }

  if (!page) {
    console.error("No page content found");
    return <div>No content found for this page.</div>;
  }

  // Function to replace static links with dynamic Next.js Links
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
}): Promise<Metadata> {
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
