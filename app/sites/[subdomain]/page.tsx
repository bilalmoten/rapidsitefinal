import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Script from "next/script";
import { JSDOM } from "jsdom";
import NoSitePage from "@/components/NoSitePage";

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

  const replaceLinks = (content: string) => {
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

    return document.body.innerHTML;
  };

  const modifiedContent = replaceLinks(page.content);

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      ></link>
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      >
        {" "}
      </link>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/framer-motion@11.15.0/dist/framer-motion.min.js"></script>
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/2.3.0/alpine-ie11.js"
        integrity="sha512-6m6AtgVSg7JzStQBuIpqoVuGPVSAK5Sp/ti6ySu6AjRDa1pX8mIl1TwP9QmKXU+4Mhq/73SzOk6mbNvyj9MPzQ=="
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      ></script>
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

export async function generateMetadata(props: {
  params: Promise<{ subdomain: string }>;
}) {
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

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  };
}
