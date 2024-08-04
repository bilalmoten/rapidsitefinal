"use client";

import React, { useState } from "react";
import sidebarcss from "./sidebar.module.css";
import Image from "next/image";
// import { FaBars, FaTimes } from 'react-icons/fa';
import NewWebsiteDialog from "@/components/NewWebsiteDialog";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import NextLogo from "./NextLogo";

interface SidebarProps {
  user: string;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const [show, setShow] = useState(false);

  const showSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    if (sidebar) {
      if (sidebar.classList.contains(sidebarcss.show)) {
        sidebar.classList.remove(sidebarcss.show);
        sidebar.classList.add(sidebarcss.hide);
        setShow(false);
      } else {
        sidebar.classList.remove(sidebarcss.hide);
        sidebar.classList.add(sidebarcss.show);
        setShow(true);
      }
    }
  };

  return (
    <>
      <div className={sidebarcss.showsidebar} onClick={showSidebar}>
        {show ? <NextLogo /> : <NextLogo />}
      </div>
      <div className={sidebarcss.abSidebar}>
        <div
          className={`${sidebarcss.sidebar} ${sidebarcss.hide}`}
          id="sidebar"
        >
          <div className={sidebarcss.upperSectionSide}>
            <h1 className={sidebarcss.mainHeadingSidebar}>
              AI Website Builder
            </h1>
            <div className={sidebarcss.innerSection}>
              <div className={`active mt-2 ${sidebarcss.elementInUpper}`}>
                <Image
                  src="/pause.svg"
                  width={24}
                  height={24}
                  alt="Pause icon"
                />
                Dashboard
              </div>
              <div className={sidebarcss.elementInUpper}>
                <Image src="/side.svg" width={24} height={24} alt="Site icon" />
                Site
              </div>
              <div className={sidebarcss.elementInUpper}>
                <Image
                  src="/teams.svg"
                  width={24}
                  height={24}
                  alt="Teams icon"
                />
                Teams
              </div>
              <div className={sidebarcss.elementInUpper}>
                <Image
                  src="/upgrade.svg"
                  width={24}
                  height={24}
                  alt="Upgrade icon"
                />
                Upgrades
              </div>
            </div>
          </div>
          <div className={sidebarcss.downSection}>
            <NewWebsiteDialog userId={props.user}>
              <Button className={sidebarcss.createButton}>
                Create new site
              </Button>
            </NewWebsiteDialog>
            <div className={`mt-5 ${sidebarcss.innerSection}`}>
              <div className={`mt-2 ${sidebarcss.elementInUpper}`}>
                <Image src="/docs.svg" width={24} height={24} alt="Docs icon" />
                Docs
              </div>
              <div className={sidebarcss.elementInUpper}>
                <Image
                  src="/tutorial.svg"
                  width={24}
                  height={24}
                  alt="Tutorials icon"
                />
                Tutorials
              </div>
              <div className={sidebarcss.elementInUpper}>
                <Image src="/help.svg" width={24} height={24} alt="Help icon" />
                Help & feedback
              </div>
              <div className={sidebarcss.elementInUpper}>
                <Image src="/api.svg" width={24} height={24} alt="API icon" />
                API reference
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
