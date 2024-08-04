import React from "react";
import Link from "next/link";
import DeleteWebsiteDialog from "@/components/DeleteWebsiteDialog";
import { buttonVariants } from "./ui/button";
import { Pencil, Eye } from "lucide-react";

interface CardProps {
  heading: string;
  image: string;
  website_id: string;
  content: string;
}

const Card: React.FC<CardProps> = ({ heading, image, website_id, content }) => {
  return (
    <div className="w-[288.33px] h-[231.9px] m-4">
      <img
        src={image}
        width={288.33}
        height={162.17}
        className="rounded-xl"
        alt={heading}
      />
      <div className="cardHeading text-center font-[500] text-[16px]">
        {heading}
      </div>
      <div className="font-[500] text-[#8F4F96] text-[14px]">{content}</div>
      <div className="flex justify-between mt-4">
        <Link
          href={`/dashboard/editor/${website_id}`}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          {/* <a className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"> */}
          <Pencil className="mr-2 h-4 w-4" />
          Edit
          {/* </a> */}
        </Link>
        <Link
          href={`/preview/${website_id}`}
          className={buttonVariants({ variant: "default", size: "sm" })}
        >
          {/* <a className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"> */}
          <Eye className="mr-2 h-4 w-4" />
          Preview
          {/* </a> */}
        </Link>
        <DeleteWebsiteDialog websiteId={website_id} websiteName={heading} />
      </div>
    </div>
  );
};

export default Card;
