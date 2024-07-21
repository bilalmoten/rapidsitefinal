import Link from "next/link";
import CreateWebsiteButton from "./createwebsitebutton";
import { Button, buttonVariants } from "./ui/button";

const Sidebar = () => {
  return (
    <div className="w-80 bg-white dark:bg-gray-800 p-4">
      <h1 className="text-2xl font-bold mb-8">AI Website Builder</h1>
      <div className=" flex-col justify-end">
        <nav>
          <ul className="space-y-2">
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                Dashboard
              </Button> */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/dashboard"}
              >
                Dashboard
              </Link>
            </li>
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                Sites
              </Button> */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/sites"}
              >
                Sites
              </Link>
            </li>
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                Team
              </Button> */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/team"}
              >
                Team
              </Link>
            </li>
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                Upgrade
              </Button> */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/upgrade"}
              >
                Upgrade
              </Link>
            </li>
          </ul>
        </nav>
        <div className="mt-auto">
          <CreateWebsiteButton />
          <ul className="mt-4 space-y-2">
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                Docs
              </Button>
               */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/docs"}
              >
                Docs
              </Link>
            </li>
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                Tutorials
              </Button> */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/tutorials"}
              >
                Tutorials
              </Link>
            </li>
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                Help & feedback
              </Button> */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/help"}
              >
                Help & feedback
              </Link>
            </li>
            <li>
              {/* <Button variant="ghost" className="w-full justify-start">
                API reference
              </Button> */}
              <Link
                className={buttonVariants({ variant: "ghost" })}
                w-full
                justify-start
                href={"/api-reference"}
              >
                API reference
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
