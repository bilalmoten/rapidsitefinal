import { Button } from "./ui/button";
import { Bell, HelpCircle, PlusCircle } from "lucide-react";
import ModeToggle from "./modetoggle";
import NewWebsiteDialog from "./NewWebsiteDialog";

interface NavbarProps {
  email: string;
  id: string;
}

export default function Navbar_new({ email, id }: NavbarProps) {
  return (
    <nav className="shadow-sm m-4">
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <h2 className="text-xl font-bold">Welcome back, {email}!</h2>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            <ModeToggle />
          </div>
          <NewWebsiteDialog userId={id}>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Website
            </Button>
          </NewWebsiteDialog>
        </div>
      </div>
    </nav>
  );
}
