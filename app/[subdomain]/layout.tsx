import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

export default async function SubdomainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { subdomain: string };
}) {
  const supabase = createClient();

  const { data: website } = await supabase
    .from("websites")
    .select("pages")
    .eq("subdomain", params.subdomain)
    .single();

  return (
    <div>
      <nav>
        {website?.pages.map((page: string) => (
          <Link key={page} href={`/${page}`}>
            {page}
          </Link>
        ))}
      </nav>
      <main>{children}</main>
    </div>
  );
}
