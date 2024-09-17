"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface HeaderProps {
  user: any;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Input type="search" placeholder="Search..." className="w-64" />
          <Button size="icon" variant="ghost" className="rounded-full">
            <Image
              src="/placeholder.svg"
              alt="User Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
