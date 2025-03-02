import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search } from "lucide-react";

export default function InspirationNotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="bg-muted/30 rounded-xl p-8 border border-border max-w-lg">
        <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold mb-2">Website Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The website you're looking for doesn't exist or has been removed from
          our inspiration gallery.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/inspiration">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to Gallery
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">
              Create Your Own Website
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
